//
//  ContentView.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

struct ContentView: View {
  @Environment(\.colorScheme) var colorScheme
  @ObservedObject var service: ConnectService

  var background: Color {
    return colorScheme == .light ? Color(hex: 0xFFFFFF) : Color(hex: 0x222222)
  }

  var card: Color {
    return colorScheme == .light ? Color(hex: 0xEEEEEE) : Color(hex: 0x111111)
  }

  var primary = Color(hex: 0x8B0000)

  var text: Color {
    return colorScheme == .light ? Color(hex: 0x000000) : Color(hex: 0xFFFFFF)
  }

  var body: some View {
    self.background.ignoresSafeArea()
      .overlay(
        ScrollView {
          VStack {
            ForEach(self.service.summaries, id: \.id) { summary in
              VStack(spacing: 1) {
                VStack(alignment: .leading) {
                  HStack {
                    Text(summary.categoryAttributes?.displayName ?? "")
                      .foregroundColor(self.text)
                      .frame(maxWidth: .infinity)
                      .padding(3)
                  }
                  .background(self.primary)
                  .cornerRadius(8)
                  .frame(maxWidth: .infinity)
                  .multilineTextAlignment(.leading)
                  Text(summary.outletAttributes?.displayName ?? "")
                    .foregroundColor(self.text)
                    .frame(maxWidth: .infinity)
                    .padding(3)
                  Divider()
                  Text(summary.title)
                    .foregroundColor(self.text)
                    .padding(3)
                    .truncationMode(.tail)
                    .lineLimit(3)
                }
                .frame(maxWidth: .infinity)
                .padding(10)
              }
              .background(self.card)
              .cornerRadius(8)
              .padding(0)
            }
          }
        }
        .padding()
      )
      .onAppear(perform: self.service.fetch)
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView(service: ConnectService())
      .preferredColorScheme(.dark)
  }
}
