//
// PartialUpdateCredentialRequest.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

/** Make all properties in T optional */
public struct PartialUpdateCredentialRequest: Codable, JSONEncodable, Hashable {

    public var userId: Double?
    public var password: String?

    public init(userId: Double? = nil, password: String? = nil) {
        self.userId = userId
        self.password = password
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case userId
        case password
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(userId, forKey: .userId)
        try container.encodeIfPresent(password, forKey: .password)
    }
}
