//
//  ReadLessWidget.swift
//  ReadLessWidget
//
//  Created by thom on 10/2/23.
//

import WidgetKit
import SwiftUI

struct SummaryEntry: TimelineEntry {
  let date: Date
  var summary: PublicSummaryAttributes?
}

struct Provider: TimelineProvider {
  
  @Environment(\.colorScheme) private var colorScheme
  
  func placeholder(in context: Context) -> SummaryEntry {
    SummaryEntry(date: Date(), summary: nil)
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SummaryEntry) -> ()) {
    let entry = SummaryEntry(date: Date(), summary: nil)
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<SummaryEntry>) -> Void) {
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
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      if #available(iOS 17.0, *) {
        ReadLessWidgetEntryView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
      } else {
        ReadLessWidgetEntryView(entry: entry)
          .padding()
          .background()
      }
    }
    .configurationDisplayName("My Widget")
    .description("This is an example widget.")
  }
}

#Preview(as: .systemSmall) {
  ReadLessWidget()
} timeline: {
  SummaryEntry(date: .now, summary: MOCK_SUMMARY)
}
