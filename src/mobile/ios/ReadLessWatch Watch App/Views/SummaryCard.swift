//
//  SummaryCard.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/14/23.
//

import SwiftUI

struct SummaryCard: View {
  let summary: PublicSummaryAttributes
  let compact: Bool

  @Environment(\.colorScheme) private var colorScheme

  var card: Color {
    return colorScheme == .light ? Color(hex: 0xEEEEEE) : Color(hex: 0x111111)
  }

  var primary = Color(hex: 0x8B0000)

  var body: some View {
    VStack(spacing: 1) {
      VStack(alignment: .leading) {
        HStack {
          Text(summary.categoryAttributes?.displayName ?? "")
            .frame(maxWidth: .infinity)
            .padding(3)
        }
        .background(self.primary)
        .cornerRadius(8)
        .frame(maxWidth: .infinity)
        .multilineTextAlignment(.leading)
        Text(summary.outletAttributes?.displayName ?? "")
          .frame(maxWidth: .infinity)
          .padding(3)
        Divider()
        Text(summary.originalDate?.distanceFromNow() ?? "")
          .font(.footnote)
          .frame(maxWidth: .infinity)
          .padding(3)
          .multilineTextAlignment(.leading)
        if summary.originalDate?.distanceFromNow() != summary.createdAt?.distanceFromNow() {
          Text("(generated \(summary.createdAt?.distanceFromNow() ?? ""))")
            .font(.footnote)
            .frame(maxWidth: .infinity)
            .padding(3)
            .multilineTextAlignment(.leading)
        }
        Text(summary.title)
          .padding(3)
          .if(compact) { view in
            view
              .truncationMode(.tail)
              .lineLimit(3)
          }
      }
      .frame(maxWidth: .infinity)
      .padding(10)
    }
    .background(self.card)
    .cornerRadius(8)
  }
}
