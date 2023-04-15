//
// BulkResponsePublicOutletAttributes.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct BulkResponsePublicOutletAttributes: Codable, JSONEncodable, Hashable {

    public var rows: [PublicOutletAttributes]
    public var count: Double

    public init(rows: [PublicOutletAttributes], count: Double) {
        self.rows = rows
        self.count = count
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case rows
        case count
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(rows, forKey: .rows)
        try container.encode(count, forKey: .count)
    }
}

