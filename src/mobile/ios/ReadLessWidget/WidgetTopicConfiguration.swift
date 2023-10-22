//
//  WidgetTopicConfiguration.swift
//  ReadLess
//
//  Created by thom on 10/7/23.
//

import Foundation
import AppIntents

@available(iOS 17.0, macOS 14.0, watchOS 10.0, *)
struct WidgetTopicConfiguration: AppIntent, WidgetConfigurationIntent, CustomIntentMigratedAppIntent, PredictableIntent {
  static let intentClassName = "IWidgetTopicConfigurationIntent"
  
  static var title: LocalizedStringResource = "Widget Topic Configuration"
  static var description = IntentDescription("Intent for configuring the topic of a widget")
  
  @Parameter(title: "Channel", default: .topStories)
  var channel: WidgetChannel?
  
  @Parameter(title: "Topic", default: "")
  var topic: String?
  
  @Parameter(title: "Date Format", default: .relative)
  var dateFormat: WidgetDateFormat?
  
  static var parameterSummary: some ParameterSummary {
    When(\.$channel, .equalTo, .customTopic) {
      Summary {
        \.$channel
        \.$topic
        \.$dateFormat
      }
    } otherwise: {
      Summary {
        \.$channel
        \.$dateFormat
      }
    }
  }
  
  static var predictionConfiguration: some IntentPredictionConfiguration {
    IntentPrediction(parameters: (\.$channel, \.$topic, \.$dateFormat)) { feedType, topic, dateFormat in
      DisplayRepresentation(
        title: "",
        subtitle: ""
      )
    }
    IntentPrediction(parameters: (\.$channel, \.$dateFormat)) { feedType, dateFormat in
      DisplayRepresentation(
        title: "",
        subtitle: ""
      )
    }
  }
  
  func perform() async throws -> some IntentResult {
    // TODO: Place your refactored intent handler code here.
    return .result()
  }
}

@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
fileprivate extension IntentDialog {
  static var topicParameterPrompt: Self {
    "Topic"
  }
}

