//
//  ContentView.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

struct ContentView: View {
  @ObservedObject private var service: ConnectService = ConnectService()
  
  @Environment(\.colorScheme) private var colorScheme
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
            } else {
              List(self.service.summaries, id: \.id) { summary in
                NavigationLink(
                  destination: ScrollView { SummaryCard(summary: summary, compact: false)
                  }.navigationTitle(summary.title) ,
                  tag: summary,
                  selection: $selectedSummary) {
                    SummaryCard(summary: summary, compact: true)
                  }
              }.refreshable {
                try? await self.service.fetch()
              }
            }
          }
          .padding(EdgeInsets(top: 10.0, leading: 0, bottom: 0, trailing: 0))
          .onAppear(perform: self.service.fetchSync)
        )
    }
    .navigationViewStyle(.stack)
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView().preferredColorScheme(.dark)
  }
}
