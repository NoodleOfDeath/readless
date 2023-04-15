//
//  View.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/15/23.
//

import SwiftUI

extension View {
  @ViewBuilder func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
    if condition {
      transform(self)
    } else {
      self
    }
  }
}
