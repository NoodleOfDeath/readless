//
//  ConnectService.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

class ConnectService: ObservableObject {
  
  @Published var summaries = [PublicSummaryAttributes]()
  @Published var loading = false
  
  init(summaries: [PublicSummaryAttributes] = [PublicSummaryAttributes]()) {
    self.summaries = summaries
  }
  
  @Sendable func fetchSync () {
    guard let url = URL(string: "https://api.readless.ai/v1/summary") else {
      return
    }
    self.loading = true
    let request = URLRequest(url: url)
    URLSession.shared.dataTask(with: request) { data, response, error in
      if let data = data {
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(dateFormatter)
        DispatchQueue.main.async {
          if let decodedResponse = try? decoder.decode(BulkResponse<PublicSummaryAttributes>.self, from: data) {
            self.summaries = decodedResponse.rows
          }
          self.loading = false
        }
      }
      self.loading = false
    }.resume()
  }
  
  func fetch() async throws {
    guard let url = URL(string: "https://api.readless.ai/v1/summary?scope=conservative") else {
      return
    }
    self.loading = true
    let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))
    guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
      throw URLError(.badServerResponse)
    }
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .formatted(dateFormatter)
    DispatchQueue.main.async {
      if let decodedResponse = try? decoder.decode(BulkResponse<PublicSummaryAttributes>.self, from: data) {
        self.summaries = decodedResponse.rows
      }
      self.loading = false
    }
    
  }

  
}
