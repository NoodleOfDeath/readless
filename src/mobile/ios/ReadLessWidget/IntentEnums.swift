//
//  IntentEnums.swift
//

import Foundation
import AppIntents

@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
enum WidgetChannel: String, AppEnum {
  case topStories
  case liveFeed
  case customTopic
  
  static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Channel")
  static var caseDisplayRepresentations: [Self: DisplayRepresentation] = [
    .topStories: "Top Stories",
    .liveFeed: "Live Feed",
    .customTopic: "Custom Topic"
  ]
  
}

@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
enum WidgetDateFormat: String, AppEnum {
  case relative
  case timestamp
  
  static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Date Format")
  static var caseDisplayRepresentations: [Self: DisplayRepresentation] = [
    .relative: "Relative",
    .timestamp: "Oct. 21 3:22 PM",
  ]
  
}
