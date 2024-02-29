//
// BulkResponse.swift
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct BulkResponse<T: Codable>: Codable {
  
  public var count: Int
  public var rows: [T]
  
  public init(count: Int, rows: [T]) {
    self.count = count
    self.rows = rows
  }
  
  public enum CodingKeys: String, CodingKey, CaseIterable {
    case count
    case rows
  }
  
  // Encodable protocol methods
  
  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(count, forKey: .count)
    try container.encode(rows, forKey: .rows)
  }
}

public struct BulkMetadataResponse<T: Codable, M: Codable>: Codable {
  
  public var count: Int
  public var rows: [T]
  public var metadata: M?
  
  public init(count: Int, rows: [T], metadata: M? = nil) {
    self.count = count
    self.rows = rows
    self.metadata = metadata
  }
  
  public enum CodingKeys: String, CodingKey, CaseIterable {
    case count
    case rows
    case metadata
  }
  
  // Encodable protocol methods
  
  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(count, forKey: .count)
    try container.encode(rows, forKey: .rows)
    try container.encodeIfPresent(metadata, forKey: .metadata)
  }
}

public struct SentimentMetadata: Codable {
  
  public var sentiment: Double;
  
  public init(sentiment: Double) {
    self.sentiment = sentiment
  }
  
  public enum CodingKeys: String, CodingKey, CaseIterable {
    case sentiment
  }
  
  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(sentiment, forKey: .sentiment)
  }
}
