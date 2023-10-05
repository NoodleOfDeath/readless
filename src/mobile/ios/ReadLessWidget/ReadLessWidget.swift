//
//  ReadLessWidget.swift
//  ReadLessWidget
//
//  Created by thom on 10/2/23.
//

import WidgetKit
import AppIntents
import Intents
import SwiftUI

struct SummaryEntry: TimelineEntry {
  var date: Date = .now
  var context: TimelineProviderContext?
  var topic: String? = "Technology"
  var summaries: [Summary] = []
}

var WidgetPageSize: Dictionary<WidgetFamily, Int> = [
  .systemSmall: 3,
  .systemMedium: 2,
  .systemLarge: 4,
  .systemExtraLarge: 4,
]

var WidgetPlaceholders: Dictionary<WidgetFamily, [Summary]> = [
  .systemSmall: [MOCK_SUMMARY_1, MOCK_SUMMARY_2, MOCK_SUMMARY_3],
  .systemMedium: [MOCK_SUMMARY_1, MOCK_SUMMARY_2],
  .systemLarge: [MOCK_SUMMARY_1, MOCK_SUMMARY_2, MOCK_SUMMARY_3, MOCK_SUMMARY_4],
  .systemExtraLarge: [MOCK_SUMMARY_1, MOCK_SUMMARY_2, MOCK_SUMMARY_3, MOCK_SUMMARY_4],
]

@available(iOS 17.0, *)
struct TopicDetail: AppEntity {
  
  var id: String
  let name: String
  
  static var defaultQuery = TopicQuery()
  
  static var typeDisplayRepresentation: TypeDisplayRepresentation = "Topic"
  
  var displayRepresentation: DisplayRepresentation {
    DisplayRepresentation(title: "\(name)")
  }
  
  static func allTopics() async -> [TopicDetail] {
    return await ConnectService().getCategories().map { TopicDetail(id: $0.name, name: $0.name) }
  }
  
}

@available(iOS 17, *)
struct TopicQuery: EntityQuery {
  func entities(for identifiers: [TopicDetail.ID]) async throws -> [TopicDetail] {
    return await TopicDetail.allTopics()
  }
  
  func suggestedEntities() async throws -> [TopicDetail] {
    return await TopicDetail.allTopics()
  }
  
  func defaultResult() async -> TopicDetail? {
    try? await suggestedEntities().first
  }
}

@available(iOS 17.0, *)
struct AppIntentProvider: AppIntentTimelineProvider {
  
  typealias Entry = SummaryEntry
  
  typealias Intent = CustomConfigurationAppIntent
  
  func placeholder(in context: Context) -> SummaryEntry {
    return SummaryEntry(context: context,
                        topic: "technology",
                        summaries: WidgetPlaceholders[context.family] ?? [])
  }
  
  func snapshot(for configuration: CustomConfigurationAppIntent, in context: Context) async -> SummaryEntry {
    SummaryEntry(context: context, 
                 topic: configuration.topic,
                 summaries: WidgetPlaceholders[context.family] ?? [])
  }
  
  func timeline(for configuration: CustomConfigurationAppIntent, in context: Context) async -> Timeline<SummaryEntry> {
    var entries: [SummaryEntry] = []
    let summaries = await ConnectService().fetchAsync(filter: configuration.topic)
    let pageSize = WidgetPageSize[context.family] ?? 2
    for i in stride(from: 0, to: summaries.count, by: pageSize) {
      let first = summaries[i]
      if context.family != .systemSmall {
        first.loadImages()
      }
      var subset = [first]
      for j in 1 ..< pageSize {
        if let next = i + j < summaries.count ? summaries[i + j] : nil {
          if context.family != .systemSmall {
            next.loadImages()
          }
          subset.append(next)
        }
      }
      let entry = SummaryEntry(context: context,
                               topic: configuration.topic,
                               summaries: subset)
      entries.append(entry)
    }
    let timeline = Timeline(entries: entries, policy: .atEnd)
    return timeline
  }
  
  
}

struct Provider: IntentTimelineProvider {
  
  func placeholder(in context: Context) -> SummaryEntry {
    return SummaryEntry(context: context, 
                        topic: "technology",
                        summaries: WidgetPlaceholders[context.family] ?? [])
  }
  
  func getSnapshot(for configuration: IWidgetTopicConfigurationIntent,
                   in context: Context,
                   completion: @escaping (SummaryEntry) -> ()) {
    let entry = SummaryEntry(context: context, 
                             topic: configuration.topic,
                             summaries: WidgetPlaceholders[context.family] ?? [])
    completion(entry)
  }
  
  func getTimeline(for configuration: IWidgetTopicConfigurationIntent,
                   in context: Context,
                   completion: @escaping (Timeline<SummaryEntry>) -> Void) {
    var entries: [SummaryEntry] = []
    let pageSize = WidgetPageSize[context.family] ?? 2
    ConnectService().fetchSync(filter: configuration.topic) { summaries in
      for i in stride(from: 0, to: summaries.count, by: pageSize) {
        let first = summaries[i]
        if context.family != .systemSmall {
          first.loadImages()
        }
        var subset = [first]
        for j in 1 ..< pageSize {
          if let next = i + j < summaries.count ? summaries[i + j] : nil {
            if context.family != .systemSmall {
              next.loadImages()
            }
            subset.append(next)
          }
        }
      }
      let timeline = Timeline(entries: entries, policy: .atEnd)
      completion(timeline)
    }
  }
}

struct ReadLessWidgetEntryView : View {
  var entry: Provider.Entry
  
  let iconSize = 20.0
  
  var body: some View {
    VStack(spacing: 8.0) {
      HStack {
        Text(entry.topic ?? "Topic")
          .font(.subheadline)
          .bold()
          .padding(0)
        Spacer()
        Image("LogoCompact")
          .resizable()
          .frame(width: iconSize * 1.25, height: iconSize)
          .aspectRatio(contentMode: .fit)
      }
      if (entry.topic == nil) {
        ForEach(0..<2) { _ in
          SummaryCard(style: entry.context?.family == .systemSmall ? .small : .medium)
        }
      } else
      if (entry.summaries.count == 0) {
        Text("No results found")
      } else {
        ForEach(entry.summaries, id: \.id) {
          SummaryCard(summary: $0, 
                      style: entry.context?.family == .systemSmall ? .small : .medium)
        }
      }
    }
  }
}

struct ReadLessWidget: Widget {
  let kind: String = "ReadLessWidget"
  
  var body: some WidgetConfiguration {
    if #available(iOS 17.0, macOS 14.0, watchOS 10.0, *) {
      return AppIntentConfiguration(kind: kind,
                                    intent: CustomConfigurationAppIntent.self,
                                    provider: AppIntentProvider()) {
        ReadLessWidgetEntryView(entry: $0)
          .containerBackground(.fill.tertiary, for: .widget)
      }
      .configurationDisplayName("Topic")
      .description("Choose a topic")
      .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    } else {
      return IntentConfiguration(kind: kind, 
                                 intent: IWidgetTopicConfigurationIntent.self,
                                 provider: Provider()) {
        ReadLessWidgetEntryView(entry: $0)
          .padding()
          .background()
      }
      .configurationDisplayName("Topic")
      .description("Choose a topic")
      .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
  }
}

#Preview(as: .systemSmall) {
  ReadLessWidget()
} timeline: {
  SummaryEntry(topic: "Sports", summaries: WidgetPlaceholders[.systemSmall] ?? [])
}

#Preview(as: .systemMedium) {
  ReadLessWidget()
} timeline: {
  SummaryEntry(topic: "Sports", summaries: WidgetPlaceholders[.systemMedium] ?? [])
}

#Preview(as: .systemLarge) {
  ReadLessWidget()
} timeline: {
  SummaryEntry(topic: "Sports", summaries: WidgetPlaceholders[.systemLarge] ?? [])
}

#Preview(as: .systemExtraLarge) {
  ReadLessWidget()
} timeline: {
  SummaryEntry(topic: "Sports", summaries: WidgetPlaceholders[.systemLarge] ?? [])
  SummaryEntry(topic: "Politics", summaries: WidgetPlaceholders[.systemLarge] ?? [])
}
