//
//  ConnectService.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

class ConnectService: ObservableObject {
  
  @Published var summaries = [PublicSummaryAttributes]()
  
  init(summaries: [PublicSummaryAttributes] = [PublicSummaryAttributes]()) {
    self.summaries = summaries
  }
  
  func fetch() {
    guard let url = URL(string: "https://api.readless.ai/v1/summary") else {
      return
    }
    let request = URLRequest(url: url)
    URLSession.shared.dataTask(with: request) { data, response, error in
      print("shit")
      print("\(String(describing: response)) \(String(describing: error))")
      if let data = data {
        print("fuckkkkkk")
        if let decodedResponse = try? JSONDecoder().decode([PublicSummaryAttributes].self, from: data) {
          DispatchQueue.main.async {
            self.summaries = decodedResponse
            print(decodedResponse)
          }
          return
        }
      }
    }.resume()
  }
  
}
