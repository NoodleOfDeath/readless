//
//  Enum.swift
//
//
//  Created by thom on 10/7/23.
//

import Foundation
import AppIntents

@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
enum Channel: String, AppEnum {
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


