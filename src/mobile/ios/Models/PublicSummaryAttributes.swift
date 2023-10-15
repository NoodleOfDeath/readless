//
// PublicSummaryAttributes.swift
//

import Foundation
import SwiftUI
#if canImport(AnyCodable)
import AnyCodable
#endif

/** From T, pick a set of properties whose keys are in the union K */
public struct PublicSummaryAttributes: Codable, Hashable {
  
  public var id: Int
  public var url: String
  public var title: String
  public var shortSummary: String?
  public var publisher: PublicPublisherAttributes
  public var category: PublicCategoryAttributes
  public var imageUrl: String?
  public var media: [String: String]?
  public var originalDate: Date?
  public var translations: [String: String]?
  
  public init(id: Int,
              url: String,
              title: String,
              shortSummary: String,
              publisher: PublicPublisherAttributes,
              category: PublicCategoryAttributes,
              imageUrl: String? = nil,
              media: [String: String]? = nil,
              originalDate: Date? = nil,
              translations: [String: String]? = nil) {
    self.id = id
    self.url = url
    self.title = title
    self.shortSummary = shortSummary
    self.publisher = publisher
    self.category = category
    self.imageUrl = imageUrl
    self.media = media
    self.originalDate = originalDate
    self.translations = translations
  }
  
  public enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case url
    case title
    case shortSummary
    case publisher
    case category
    case imageUrl
    case media
    case originalDate
    case translations
  }
  
  // Encodable protocol methods
  
  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(id, forKey: .id)
    try container.encode(url, forKey: .url)
    try container.encode(title, forKey: .title)
    try container.encodeIfPresent(shortSummary, forKey: .shortSummary)
    try container.encode(publisher, forKey: .publisher)
    try container.encode(category, forKey: .category)
    try container.encodeIfPresent(media, forKey: .media)
    try container.encodeIfPresent(imageUrl, forKey: .imageUrl)
    try container.encodeIfPresent(originalDate, forKey: .originalDate)
    try container.encodeIfPresent(translations, forKey: .translations)
  }
  
}

public class Summary {
  
  public var root: PublicSummaryAttributes
  public var id: Int
  public var url: String
  public var title: String
  public var shortSummary: String?
  public var publisher: PublicPublisherAttributes
  public var category: PublicCategoryAttributes
  public var imageUrl: String?
  public var media: [String: String]?
  public var originalDate: Date?
  public var translations: [String: String]?
  
  public var deeplink: URL {
    return URL(string: "https://readless.ai/read/?s=\(id)")!
  }
  
  public var primaryImageUrl: URL? {
    return URL(string: (media?["imageArticle@sm"] ??
                        media?["imageAi1@sm"] ??
                        media?["imageArticle"] ??
                        media?["imageAi1"] ??
                        imageUrl ?? ""))
  }
  
  public init(_ summary: PublicSummaryAttributes) {
    self.root = summary
    self.id = summary.id
    self.url = summary.url
    self.title = summary.title
    self.shortSummary = summary.shortSummary
    self.publisher = summary.publisher
    self.category = summary.category
    self.imageUrl = summary.imageUrl
    self.media = summary.media
    self.originalDate = summary.originalDate
    self.translations = summary.translations
  }
  
  @Published public var image: Image?
  @Published public var publisherIcon: Image?
  
  public func loadImages() {
    if let url = primaryImageUrl {
      image = Image.load(from: url, maxWidth: 100)
    }
    publisherIcon = Image.load(from: publisher.icon, maxWidth: 40)
  }
  
}


public var MOCK_SUMMARY_1 = Summary(
  PublicSummaryAttributes(id: 1,
                          url: "https://readless.ai",
                          title: "Summary Preview",
                          shortSummary: "Short Summary",
                          publisher: PublicPublisherAttributes(name: "cnn",
                                                               displayName: "CNN"),
                          category: PublicCategoryAttributes(name: "sports",
                                                             displayName: "Sports",
                                                             icon: "basketball")
                         ))

public var MOCK_SUMMARY_2 = Summary(
  PublicSummaryAttributes(id: 2,
                          url: "https://readless.ai",
                          title: "Summary Preview",
                          shortSummary: "Short Summary",
                          publisher: PublicPublisherAttributes(name: "forbes",
                                                               displayName: "Forbes"),
                          category: PublicCategoryAttributes(name: "politics",
                                                             displayName: "politics",
                                                             icon: "bank")
                         ))

public var MOCK_SUMMARY_3 = Summary(
  PublicSummaryAttributes(id: 3,
                          url: "https://readless.ai",
                          title: "Summary Preview",
                          shortSummary: "Short Summary",
                          publisher: PublicPublisherAttributes(name: "forbes",
                                                               displayName: "Forbes"),
                          category: PublicCategoryAttributes(name: "politics",
                                                             displayName: "politics",
                                                             icon: "bank")
                         ))

public var MOCK_SUMMARY_4 = Summary(
  PublicSummaryAttributes(id: 4,
                          url: "https://readless.ai",
                          title: "Summary Preview",
                          shortSummary: "Short Summary",
                          publisher: PublicPublisherAttributes(name: "forbes",
                                                               displayName: "Forbes"),
                          category: PublicCategoryAttributes(name: "politics",
                                                             displayName: "politics",
                                                             icon: "bank")
                         ))

