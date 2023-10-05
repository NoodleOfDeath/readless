//
//  CustomConfigurationAppIntent.swift
//  
//
//  Created by thom on 10/3/23.
//

import Foundation
import AppIntents

@available(iOS 17.0, macOS 14.0, watchOS 10.0, *)
struct CustomConfigurationAppIntent: AppIntent, WidgetConfigurationIntent, CustomIntentMigratedAppIntent, PredictableIntent {
    static let intentClassName = "CustomConfiguration"

    static var title: LocalizedStringResource = "Custom Configuration"
    static var description = IntentDescription("")

    @Parameter(title: "Topic")
    var topic: String?

    static var parameterSummary: some ParameterSummary {
        Summary {
            \.$topic
        }
    }

    static var predictionConfiguration: some IntentPredictionConfiguration {
        IntentPrediction(parameters: (\.$topic)) { topic in
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
