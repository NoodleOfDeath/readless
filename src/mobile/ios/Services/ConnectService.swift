//
//  ConnectService.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

struct Endpoints {
  static let GetSummaries = "https://api.readless.ai/v1/summary"
}

class ConnectService: ObservableObject {
  @Published var summaries = [PublicSummaryAttributes]()
  @Published var loading = false
  @Published var error: String?

  init(summaries: [PublicSummaryAttributes] = [PublicSummaryAttributes]()) {
    self.summaries = summaries
  }

  func fetchHandler(_ data: Data?) -> [PublicSummaryAttributes] {
    if let data = data {
      let decoder = JSONDecoder()
      decoder.dateDecodingStrategy = .custom { (decoder) -> Date in
        let container = try decoder.singleValueContainer()
        let dateString = try container.decode(String.self)
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
        if let date = dateFormatter.date(from: dateString) {
            return date
        }
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        if let date = dateFormatter.date(from: dateString) {
            return date
        }
        throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date format")
      }
      do {
        let decodedResponse = try decoder.decode(BulkResponse<PublicSummaryAttributes, SentimentMetadata>.self, from: data)
        self.summaries = decodedResponse.rows
      } catch {
        print(error)
        self.error = error.localizedDescription
      }
    }
    self.loading = false
    return self.summaries
  }
  
  @Sendable func fetchSync() {
    return self.fetchSync(nil)
  }
  
  @Sendable func fetchSync(_ callback: ((_ summaries: [PublicSummaryAttributes]) -> ())?) {
    guard let url = URL(string: Endpoints.GetSummaries) else {
      return
    }
    loading = true
    error = nil
    let request = URLRequest(url: url)
    URLSession.shared.dataTask(with: request) { (data, _, _) in
      DispatchQueue.main.async {
        let summaries = self.fetchHandler(data)
        callback?(summaries)
      }
    }.resume()
  }
  
  @Sendable func fetchAsync() async -> [PublicSummaryAttributes] {
    guard let url = URL(string: Endpoints.GetSummaries) else {
      return []
    }
    loading = true
    error = nil
    let request = URLRequest(url: url)
    guard let (data, _) = try? await URLSession.shared.data(for: request) else {
      return []
    }
    return self.fetchHandler(data)
  }
  
}
