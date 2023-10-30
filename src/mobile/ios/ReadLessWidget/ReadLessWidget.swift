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

let SUPPORTED_FAMILIES: [WidgetFamily] = [
  .systemMedium,
  .systemLarge,
  .accessoryCircular,
  .accessoryRectangular,
  .accessoryInline
]

let DEFAULT_TIMELINE_INTERVAL: Double = 10

struct DEEPLINKS {
  static let topStories = "https://readless.ai/top"
  static let liveFeed = "https://readless.ai/live"
}

struct CustomWidgetConfiguration {
  var channel: WidgetChannel = .topStories
  var topic: String?
  var dateFormat: WidgetDateFormat = .relative
}

struct SummaryEntry: TimelineEntry {
  var date: Date = .now
  var context: TimelineProviderContext?
  var config: CustomWidgetConfiguration?
  var summaries = [Summary]()
}

var WidgetPageSize: Dictionary<WidgetFamily, Int> = [
  .systemSmall: 1,
  .systemMedium: 2,
  .systemLarge: 5,
  .systemExtraLarge: 5,
]

var WidgetPlaceholders: Dictionary<WidgetFamily, [Summary]> = [
  .systemSmall: [MOCK_SUMMARY_1, MOCK_SUMMARY_2, MOCK_SUMMARY_3],
  .systemMedium: [MOCK_SUMMARY_1, MOCK_SUMMARY_2],
  .systemLarge: [MOCK_SUMMARY_1, MOCK_SUMMARY_2, MOCK_SUMMARY_3, MOCK_SUMMARY_4],
  .systemExtraLarge: [MOCK_SUMMARY_1, MOCK_SUMMARY_2, MOCK_SUMMARY_3, MOCK_SUMMARY_4],
]

func buildEntries(in context: TimelineProviderContext,
                  for configuration: CustomWidgetConfiguration) async -> [SummaryEntry] {
  let endpoint = configuration.channel == .topStories ? ENDPOINTS.GetTopStories : ENDPOINTS.GetSummaries
  let filter =  configuration.channel == .topStories ? "" : configuration.channel == .liveFeed ? "" : configuration.topic
  let summaries = Array(await APIClient().fetchAsync(endpoint: endpoint,
                                                     filter: filter).reversed())
  let pageSize = WidgetPageSize[context.family] ?? 2
  var entries: [SummaryEntry] = []
  for i in stride(from: 0, to: summaries.count, by: pageSize) {
    let first = summaries[i]
    first.loadImages(resolution: .sm)
    var subset = [first]
    for j in 1 ..< pageSize {
      if let next = i + j < summaries.count ? summaries[i + j] : nil {
        next.loadImages(resolution: .sm)
        subset.insert(next, at: 0)
      }
    }
    let offset = DEFAULT_TIMELINE_INTERVAL + floor(Double(i) / Double(pageSize))
    let fireDate = Date.now.addingTimeInterval(offset)
    let entry = SummaryEntry(date: fireDate,
                             context: context,
                             config: configuration,
                             summaries: subset)
    entries.append(entry)
  }
  return entries
}

struct Provider: IntentTimelineProvider {
  
  func placeholder(in context: Context) -> SummaryEntry {
    return SummaryEntry(context: context,
                        config: CustomWidgetConfiguration(channel: .customTopic,
                                                          topic: "Technology"),
                        summaries: WidgetPlaceholders[context.family] ?? [])
  }
  
  func getSnapshot(for configuration: IWidgetTopicConfigurationIntent,
                   in context: Context,
                   completion: @escaping (SummaryEntry) -> ()) {
    let entry = SummaryEntry(context: context,
                             config: CustomWidgetConfiguration(channel: .customTopic,
                                                               topic: configuration.topic))
    completion(entry)
  }
  
  func getTimeline(for configuration: IWidgetTopicConfigurationIntent,
                   in context: Context,
                   completion: @escaping (Timeline<SummaryEntry>) -> Void) {
    Task {
      let channel = WidgetChannel.allCases[configuration.channel.rawValue]
      let config = CustomWidgetConfiguration(channel: channel,
                                             topic: configuration.topic,
                                             dateFormat: WidgetDateFormat.allCases[configuration.dateFormat.rawValue])
      let entries = await buildEntries(in: context, for: config)
      let timeline = Timeline(entries: entries, policy: .atEnd)
      completion(timeline)
    }
  }
  
}

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
    return await APIClient().getCategories().map { TopicDetail(id: $0.name, name: $0.name) }
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
  typealias Intent = WidgetTopicConfiguration
  
  func placeholder(in context: Context) -> SummaryEntry {
    return SummaryEntry(context: context,
                        config: CustomWidgetConfiguration(channel: .customTopic,
                                                          topic: "Technology"),
                        summaries: WidgetPlaceholders[context.family] ?? [])
  }
  
  func snapshot(for configuration: WidgetTopicConfiguration,
                in context: Context) async -> SummaryEntry {
    SummaryEntry(context: context,
                 config: CustomWidgetConfiguration(channel: .customTopic,
                                                   topic: configuration.topic))
  }
  
  func timeline(for configuration: WidgetTopicConfiguration,
                in context: Context) async -> Timeline<SummaryEntry> {
    let config = CustomWidgetConfiguration(channel: configuration.channel ?? .topStories,
                                           topic: configuration.topic,
                                           dateFormat: configuration.dateFormat ?? .relative)
    let entries = await buildEntries(in: context, for: config)
    let timeline = Timeline(entries: entries, policy: .atEnd)
    return timeline
  }
  
}

struct ReadLessWidgetEntryView : View {
  
  @Environment(\.colorScheme) private var colorScheme
  
  var entry: Provider.Entry
  
  let iconSize = 20.0
  
  var deeplink: URL {
    if entry.context?.family == .systemSmall {
      return entry.summaries.first?.deeplink ?? URL(string: DEEPLINKS.topStories)!
    }
    if entry.config?.channel == .liveFeed {
      return URL(string: DEEPLINKS.liveFeed)!
    }
    if entry.config?.channel == .topStories {
      return URL(string: DEEPLINKS.topStories)!
    }
    return URL(string: "https://readless.ai/search?filter=\(entry.config?.topic ?? "")")!
  }
  
  var body: some View {
    VStack(spacing: 8.0) {
      HStack {
        Text(entry.config?.channel == .topStories ? String(localized: "Top Stories") :
              entry.config?.channel == .liveFeed ? String(localized: "Live Feed") :
              entry.config?.topic ?? String(localized: "Topic"))
        .textCase(.uppercase)
        .font(.subheadline)
        .bold()
        .padding(0)
        Spacer()
        if colorScheme == .light {
          Image("LogoCompact")
            .resizable()
            .scaledToFit()
            .frame(width: iconSize, height: iconSize)
        } else {
          Image("LogoCompact")
            .resizable()
            .colorInvert()
            .scaledToFit()
            .frame(width: iconSize, height: iconSize)
        }
      }
      if (entry.config?.topic == nil) {
        let size = WidgetPageSize[entry.context?.family ?? .systemMedium] ?? 2
        ForEach(0 ..< size, id: \.self) { _ in
          SummaryCard(style: entry.context?.family == .systemSmall ? .small : .medium)
        }
      } else
      if (entry.summaries.count == 0) {
        Text("No results found")
      } else {
        ForEach(entry.summaries, id: \.id) {
          SummaryCard(summary: $0,
                      style: entry.context?.family == .systemSmall ? .small : .medium,
                      dateFormat: entry.config?.dateFormat == .timestamp ? "MMM dd h:mm a" : nil,
                      deeplink: true)
        }
      }
    }
    .widgetURL(deeplink)
  }
}

struct ReadLessWidget: Widget {
  let kind: String = "ReadLessWidget"
  
  var body: some WidgetConfiguration {
    if #available(iOS 17.0, macOS 14.0, watchOS 10.0, *) {
      return  AppIntentConfiguration(kind: kind,
                                     intent: WidgetTopicConfiguration.self,
                                     provider: AppIntentProvider()) {
        ReadLessWidgetEntryView(entry: $0)
          .containerBackground(.fill.tertiary, for: .widget)
      }
                                     .configurationDisplayName(String(localized: "Topic"))
                                     .description(String(localized: "Choose a topic"))
                                     .supportedFamilies(SUPPORTED_FAMILIES)
    } else {
      return IntentConfiguration(kind: kind,
                                 intent: IWidgetTopicConfigurationIntent.self,
                                 provider: Provider()) {
        ReadLessWidgetEntryView(entry: $0)
          .padding()
          .background()
      }
                                 .configurationDisplayName(String(localized: "Topic"))
                                 .description(String(localized: "Choose a topic"))
                                 .supportedFamilies(SUPPORTED_FAMILIES)
    }
  }
}




