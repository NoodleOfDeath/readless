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
  @State private var image: Image? = nil
  @State private var publisherIcon: Image? = nil

  @Environment(\.colorScheme) private var colorScheme

  var card: Color {
    return colorScheme == .light ? Color(hex: 0xEEEEEE) : Color(hex: 0x111111)
  }

  var primary = Color(hex: 0x8B0000)

  var body: some View {
    VStack(spacing: 1) {
      VStack(alignment: .leading) {
        HStack {
          if let image = publisherIcon {
            image
              .fixedSize()
              .frame(width: 20, height: 20)
              .aspectRatio(contentMode: .fit)
          } else {
            Text("")
              .onAppear {
                loadImage(summary.publisher.icon) { image in self.publisherIcon = image }
              }
          }
          Text(summary.publisher.displayName)
            .frame(maxWidth: .infinity)
            .padding(3)
        }
        .background(self.primary)
        .cornerRadius(8)
        .frame(maxWidth: .infinity)
        .multilineTextAlignment(.leading)
        Text(summary.category.displayName)
          .frame(maxWidth: .infinity)
          .padding(3)
        Text(summary.originalDate?.distanceFromNow() ?? "")
          .font(.footnote)
          .frame(maxWidth: .infinity)
          .padding(3)
          .multilineTextAlignment(.leading)
        Divider()
        if let image = image {
          image
              .resizable()
              .aspectRatio(contentMode: .fit)
        } else {
            Text("Loading Image...")
            .onAppear {
              if let url = summary.media?["imageArticle"] ?? summary.media?["imageAi1"] ?? summary.imageUrl {
                loadImage(url) { image in self.image = image }
              }
            }
        }
        Text(compact ? (summary.translations?["title"] ?? summary.title) : (summary.translations?["shortSummary"] ?? summary.shortSummary ?? ""))
          .padding(3)
          .if(compact) { view in
            view
              .truncationMode(.tail)
              .lineLimit(compact ? 3 : 10)
          }
      }
      .frame(maxWidth: .infinity)
      .padding(10)
    }
    .background(self.card)
    .cornerRadius(8)
  }
  
}

func loadImage(_ url: String, completionHandler: @escaping @Sendable (_ image: Image) -> Void) {
  guard let imageUrl = URL(string: url) else { return }
    URLSession.shared.dataTask(with: imageUrl) { data, _, error in
        if let data = data, let uiImage = UIImage(data: data) {
            DispatchQueue.main.async {
                completionHandler(Image(uiImage: uiImage))
            }
        }
    }.resume()
}
