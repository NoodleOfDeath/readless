//
//  SummaryCard.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/14/23.
//

import SwiftUI

enum SummaryCardStyle {
  case small
  case medium
}

struct SummaryCard: View {
  var summary: Summary?
  let style: SummaryCardStyle
  var expanded: Bool = false
  var deeplink: Bool = false
  
  @Environment(\.colorScheme) private var colorScheme

  var backdrop: Color {
    return colorScheme == .light ? Color(hex: 0xffffff, alpha: 0.3) : Color(hex: 0x000000, alpha: 0.3)
  }

  var placeholder: Color {
    return colorScheme == .light ? Color(hex: 0xf0f0f0) : Color(hex: 0x303030)
  }
  
  var headerHeight: CGFloat {
    return 15.0
  }
  
  var headerFont: Font {
    return .system(size: 10)
  }
  
  var titleFont: Font {
    return .caption
  }
  
  var imageHeight: CGFloat {
    return style == .small ? 170.0 : 55.0
  }
  
  var HEADER: some View {
    HStack {
      if let summary = summary {
        if let image = summary.publisherIcon {
          image
            .resizable()
            .frame(width: headerHeight, height: headerHeight)
            .aspectRatio(contentMode: .fit)
        } else {
          Text("")
            .frame(width: headerHeight, height: headerHeight)
            .onAppear {
              Image.load(from: summary.publisher.icon) { image in DispatchQueue.main.async { self.summary?.publisherIcon = image } }
            }
        }
        Text(summary.publisher.displayName)
          .font(headerFont)
        Text("•")
          .font(headerFont)
        Text(summary.originalDate?.distanceFromNow() ?? "")
          .font(headerFont)
        Spacer()
      }
    }
    .multilineTextAlignment(.leading)
  }
  
  var TITLE: some View {
    HStack {
      if let summary = summary {
        Text(summary.translations?["title"] ?? summary.title)
          .font(titleFont)
          .bold()
          .lineSpacing(-10.0)
          .truncationMode(.tail)
          .lineLimit(!expanded ? 2 : 10)
      }
      Spacer()
    }
    .multilineTextAlignment(.leading)
  }
  
  var DESCRIPTION: some View {
    HStack {
      if let summary = summary {
        Text(summary.translations?["shortSummary"] ?? summary.shortSummary ?? "")
          .font(titleFont)
          .bold()
          .lineSpacing(-10.0)
      }
    }
    .multilineTextAlignment(.leading)
  }
  
  var IMAGE: some View {
    VStack {
      if let summary = summary {
        if let image = summary.image {
          image
            .resizable()
            .scaledToFill()
            .frame(width: imageHeight, height: imageHeight)
        } else {
          Text("")
            .font(headerFont)
            .frame(width: imageHeight, height: imageHeight)
            .onAppear {
              if let url = summary.primaryImageUrl {
                Image.load(from: url) { image in DispatchQueue.main.async { self.summary?.image = image } }
              }
            }
        }
      }
    }
  }
  
  var CONTENT: some View {
    VStack {
      if style == .small  {
        if !expanded {
          IMAGE
            .overlay {
              VStack {
                Spacer()
                VStack {
                  HEADER
                  TITLE
                }
                .padding(4.0)
                .cornerRadius(8.0)
                .background(backdrop)
              }
            }
            .padding(4.0)
        } else {
          VStack(spacing: 8.0) {
            HEADER
            TITLE
            IMAGE
            DESCRIPTION
          }
        }
      } else
      if style == .medium {
        HStack {
          VStack(spacing: 4.0) {
            HEADER
            TITLE
          }
          .multilineTextAlignment(.leading)
          IMAGE
            .cornerRadius(8.0)
        }
        .frame(maxWidth: .infinity)
      }
    }
  }

  var body: some View {
    if let summary = summary {
      if deeplink == true {
        Link(destination: summary.deeplink, label: {
          CONTENT
        })
      } else {
        CONTENT
      }
    } else {
      if style == .small {
        
      } else
      if style == .medium {
        HStack {
          VStack(spacing: 4.0) {
            HStack {
              Spacer()
            }
            .frame(height: headerHeight)
            .background(placeholder)
            HStack {
              Spacer()
            }
            .frame(height: headerHeight)
            .background(placeholder)
          }
          VStack {
            Spacer()
          }
          .frame(width: imageHeight, height: imageHeight)
          .background(placeholder)
          .cornerRadius(8.0)
        }
        .frame(maxWidth: .infinity)
      }
    }
  }
  
}
