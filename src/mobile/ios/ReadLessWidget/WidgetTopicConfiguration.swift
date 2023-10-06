//
//  WidgetTopicConfiguration.swift
//  
//
//  Created by thom on 10/6/23.
//

import Foundation
import AppIntents

@available(iOS 17.0, macOS 14.0, watchOS 10.0, *)
struct WidgetTopicConfiguration: AppIntent, WidgetConfigurationIntent, CustomIntentMigratedAppIntent, PredictableIntent {
    static let intentClassName = "IWidgetTopicConfigurationIntent"

    static var title: LocalizedStringResource = "Widget Topic Configuration"
    static var description = IntentDescription("Intent for configuring the topic of a widget")

    @Parameter(title: "Top Stories")
    var topStories: Bool?

    @Parameter(title: "Topic", default: "Technology")
    var topic: String?

    @Parameter(title: "Update Interval")
    var updateInterval: Measurement<UnitDuration>?

    static var parameterSummary: some ParameterSummary {
        When(\.$topStories, .equalTo, false) {
            Summary {
                \.$topic
                \.$updateInterval
                \.$topStories
            }
        } otherwise: {
            Summary {
                \.$topStories
                \.$updateInterval
            }
        }
    }

    static var predictionConfiguration: some IntentPredictionConfiguration {
        IntentPrediction(parameters: (\.$topic, \.$updateInterval, \.$topStories)) { topic, updateInterval, topStories in
            DisplayRepresentation(
                title: "",
                subtitle: ""
            )
        }
        IntentPrediction(parameters: (\.$topStories, \.$updateInterval)) { topStories, updateInterval in
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

