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
  let date: Date
  var summary: PublicSummaryAttributes?
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
    return []
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
    SummaryEntry(date: .now, summary: nil)
  }
  
  func snapshot(for configuration: CustomConfigurationAppIntent, in context: Context) async -> SummaryEntry {
    SummaryEntry(date: .now, summary: nil)
  }
  
  func timeline(for configuration: CustomConfigurationAppIntent, in context: Context) async -> Timeline<SummaryEntry> {
    var entries: [SummaryEntry] = []
    let service = ConnectService()
    let summaries = await service.fetchAsync()
    for summary in summaries {
      if let date = summary.originalDate {
        let entry = SummaryEntry(date: date, summary: summary)
        entries.append(entry)
      }
    }
    let timeline = Timeline(entries: entries, policy: .atEnd)
    return timeline
  }
  
  
}

struct Provider: IntentTimelineProvider {
  
  func placeholder(in context: Context) -> SummaryEntry {
    SummaryEntry(date: .now, summary: nil)
  }
  
  func getSnapshot(for configuration: CustomConfiguration, 
                   in context: Context,
                   completion: @escaping (SummaryEntry) -> ()) {
    let entry = SummaryEntry(date: Date(), summary: nil)
    completion(entry)
  }
  
  func getTimeline(for configuration: CustomConfiguration,
                   in context: Context,
                   completion: @escaping (Timeline<SummaryEntry>) -> Void) {
    var entries: [SummaryEntry] = []
    let service = ConnectService()
    service.fetchSync() { summaries in
      for summary in summaries {
        if let date = summary.originalDate {
          let entry = SummaryEntry(date: date, summary: summary)
          entries.append(entry)
        }
      }
      let timeline = Timeline(entries: entries, policy: .atEnd)
      completion(timeline)
    }
  }
}

struct ReadLessWidgetEntryView : View {
  var entry: Provider.Entry
  
  var body: some View {
    VStack {
      if let summary = entry.summary {
        SummaryCard(summary: summary, compact: false)
      }
    }
  }
}

struct ReadLessWidget: Widget {
  let kind: String = "ReadLessWidget"
  
  var body: some WidgetConfiguration {
    if #available(iOS 17.0, macOS 14.0, watchOS 10.0, *) {
      return AppIntentConfiguration(kind: kind, intent: CustomConfigurationAppIntent.self, provider: AppIntentProvider()) { entry in
        ReadLessWidgetEntryView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
      }
      .configurationDisplayName("My Widget")
      .description("This is an example widget.")
    } else {
      return IntentConfiguration(kind: kind, intent: CustomConfiguration.self, provider: Provider()) { entry in
        ReadLessWidgetEntryView(entry: entry)
          .padding()
          .background()
      }
      .configurationDisplayName("My Widget")
      .description("This is an example widget.")
    }
  }
}

#Preview(as: .systemSmall) {
  ReadLessWidget()
} timeline: {
  SummaryEntry(date: .now, summary: MOCK_SUMMARY)
}
