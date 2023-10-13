//
//  ContentView.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

struct ContentView: View {
  @Environment(\.colorScheme) private var colorScheme
  @ObservedObject private var service = APIClient()
  
  @State var summaries: [Summary] = []
  @State var selectedSummary: PublicSummaryAttributes?

  var background: Color {
    return colorScheme == .light ? Color(hex: 0xFFFFFF) : Color(hex: 0x222222)
  }

  var body: some View {
    NavigationView {
      self.background.ignoresSafeArea()
        .overlay(
          VStack {
            if self.service.loading {
              ProgressView()
            } else
            if let error = self.service.error {
              Text("Error loading")
              Text(error)
              Button("Reload", action: self.fetchSummaries)
            } else {
              List(self.summaries.enumerated().map({ $0 }), id: \.element.id) { index, summary in
                VStack {
                  if index == 0 {
                    Button("Reload", action: self.fetchSummaries)
                  }
                  NavigationLink(
                    destination: ScrollView { SummaryCard(summary: summary,
                                                          style: .small,
                                                          expanded: true)
                    }.navigationTitle(summary.translations?["title"] ?? summary.title) ,
                    tag: summary.root,
                    selection: $selectedSummary) {
                      SummaryCard(summary: summary, 
                                  style: .small)
                    }
                }
              }.refreshable {
                self.fetchSummaries()
              }
            }
          }
          .padding(EdgeInsets(top: 10.0, leading: 0, bottom: 0, trailing: 0))
        )
    }
    .navigationViewStyle(.stack)
    .onAppear(perform: self.fetchSummaries)
  }
  
  func fetchSummaries() {
    self.service.fetchSync { self.summaries = $0 }
  }
  
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView().preferredColorScheme(.dark)
  }
}
