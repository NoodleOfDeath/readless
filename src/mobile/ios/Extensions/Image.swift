//
//  Image.swift
//  ReadLess
//
//  Created by thom on 10/4/23.
//

import Foundation
import CoreGraphics
import SwiftUI

public extension Image {
  
  static func loadAsync(from string: String, maxWidth: CGFloat? = nil) async -> Image? {
    guard let url = URL(string: string) else { return nil }
    return await self.loadAsync(from: url, maxWidth: maxWidth)
  }
  
  static func loadAsync(from url: URL?, maxWidth: CGFloat? = nil) async -> Image? {
    guard let url = url else { return nil }
    let request = URLRequest(url: url)
    guard let (data, _) = try? await URLSession.shared.data(for: request) else { return nil }
    guard let image = UIImage(data: data) else { return nil }
    if let maxWidth = maxWidth, let image = image.resized(toWidth: maxWidth) {
      return Image(uiImage: image)
    }
    return Image(uiImage: image)
  }
  
  static func load(from string: String, maxWidth: CGFloat? = nil, completion: @escaping @Sendable (_ image: Image?) -> Void) {
    guard let imageUrl = URL(string: string) else { return }
    return self.load(from: imageUrl, completion: completion)
  }
  
  static func load(from url: URL?, maxWidth: CGFloat? = nil, completion: @escaping @Sendable (_ image: Image?) -> Void) {
    guard let url = url else {
      completion(nil)
      return
    }
    URLSession.shared.dataTask(with: url) { data, _, error in
      if let data = data, let image = UIImage(data: data) {
        if let maxWidth = maxWidth, let image = image.resized(toWidth: maxWidth) {
          completion(Image(uiImage: image))
        } else {
          completion(Image(uiImage: image))
        }
      }
    }.resume()
  }
  
}
