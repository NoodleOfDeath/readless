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

public enum MediaType {
  case image
  case publisherIcon
}

public enum MediaResolution: String {
  case xs
  case sm
  case md
  case lg
  case xl
  case xxl
  case xxxl
}

public class Summary {
  
  public var root: PublicSummaryAttributes
  
  public var id: Int { root.id }
  public var url: String { root.url }
  public var title: String { root.title }
  public var shortSummary: String? { root.shortSummary }
  public var publisher: PublicPublisherAttributes { root.publisher }
  public var category: PublicCategoryAttributes { root.category }
  public var imageUrl: String? { root.imageUrl }
  public var media: [String: String]? { root.media }
  public var originalDate: Date? { root.originalDate }
  public var translations: [String: String]? { root.translations }
  
  public var deeplink: URL {
    URL(string: "https://readless.ai/read/?s=\(id)")!
  }
  
  @Published public var image: Image?
  @Published public var publisherIcon: Image?
  
  public init(_ summary: PublicSummaryAttributes) {
    self.root = summary
  }
  
  public func getMediaURL(type: MediaType, resolution: MediaResolution? = nil) -> URL? {
    if type == .image {
      let keys = ["imageArticle", "imageAi1"].map {
        guard let resolution = resolution else { return $0 }
        return "\($0)@\(resolution.rawValue)"
      }
      for key in keys {
        if let string = media?[key], let url = URL(string: string) {
          return url
        }
      }
      if let url = imageUrl {
        return URL(string: url)
      }
    } else
    if type == .publisherIcon {
      return publisher.icon
    }
    return nil
  }
  
  public func loadImages(resolution: MediaResolution? = nil) {
    if let url = getMediaURL(type: .image, resolution: resolution) {
      image = Image.load(from: url, maxWidth: 80)
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


