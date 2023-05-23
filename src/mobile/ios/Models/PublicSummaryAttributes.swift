//
// PickSummaryAttributesExcludeKeyofSummaryAttributesRawTextOrFilteredText.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

/** From T, pick a set of properties whose keys are in the union K */
public struct PublicSummaryAttributes: Codable, Hashable {

  public var id: Int
  public var url: String
  public var title: String
  public var outlet: PublicOutletAttributes
  public var category: PublicCategoryAttributes
  public var imageUrl: String?
  public var originalDate: Date?
  public var translations: [PublicTranslationAttributes]?
  
  public func translationMap() -> [String: String] {
    guard let translations = self.translations else { return [String: String]() }
    var map = [String: String]()
    for translation in translations {
      map[translation.attribute] = translation.value
    }
    return map
  }

  public init(id: Int,
              url: String,
              title: String,
              outlet: PublicOutletAttributes,
              category: PublicCategoryAttributes,
              imageUrl: String? = nil,
              originalDate: Date? = nil,
              translations: [PublicTranslationAttributes]? = nil) {
    self.id = id
    self.url = url
    self.title = title
    self.outlet = outlet
    self.category = category
    self.imageUrl = imageUrl
    self.originalDate = originalDate
    self.translations = translations
  }

  public enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case url
    case title
    case outlet
    case category
    case imageUrl
    case originalDate
    case translations
  }

  // Encodable protocol methods

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(id, forKey: .id)
    try container.encode(url, forKey: .url)
    try container.encode(title, forKey: .title)
    try container.encode(outlet, forKey: .outlet)
    try container.encode(category, forKey: .category)
    try container.encodeIfPresent(imageUrl, forKey: .imageUrl)
    try container.encodeIfPresent(originalDate, forKey: .originalDate)
    try container.encodeIfPresent(translations, forKey: .translations)
  }
  
}

