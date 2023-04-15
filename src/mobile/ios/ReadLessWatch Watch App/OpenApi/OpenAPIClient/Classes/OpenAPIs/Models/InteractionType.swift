//
// InteractionType.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public enum InteractionType: String, Codable, CaseIterable {
  case bookmark = "bookmark"
  case comment = "comment"
  case copy = "copy"
  case downvote = "downvote"
  case favorite = "favorite"
  case feedback = "feedback"
  case listen = "listen"
  case read = "read"
  case share = "share"
  case upvote = "upvote"
  case view = "view"
}
