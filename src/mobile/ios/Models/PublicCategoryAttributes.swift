//
// PublicCategoryAttributes.swift
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct PublicCategoryAttributes: Codable, Hashable {

  public var name: String
  public var displayName: String
  public var icon: String

  public init(name: String, displayName: String, icon: String) {
    self.name = name
    self.displayName = displayName
    self.icon = icon
  }

  public enum CodingKeys: String, CodingKey, CaseIterable {
    case name
    case displayName
    case icon
  }

  // Encodable protocol methods

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(name, forKey: .name)
    try container.encode(displayName, forKey: .displayName)
    try container.encode(icon, forKey: .icon)
  }
}

