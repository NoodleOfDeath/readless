//
//  Image.swift
//  ReadLess
//
//  Created by thom on 10/4/23.
//

import Foundation
import SwiftUI

public extension Image {
  
  static func load(from imageURL: URL, maxWidth: CGFloat) -> Image? {
    guard let uiImage = UIImage.load(from: imageURL, maxWidth: maxWidth) else { return nil }
    return Image(uiImage: uiImage)
  }
  
  static func load(from string: String, completion: @escaping @Sendable (_ image: Image?) -> Void) {
    guard let imageUrl = URL(string: string) else { return }
    return self.load(from: imageUrl, completion: completion)
  }
  
  static func load(from url: URL?, completion: @escaping @Sendable (_ image: Image?) -> Void) {
    guard let url = url else {
      completion(nil)
      return
    }
    URLSession.shared.dataTask(with: url) { data, _, error in
      if let data = data, let image = UIImage(data: data) {
        completion(Image(uiImage: image))
      }
    }.resume()
  }
  
  static func loadAsync(from string: String) async -> Image? {
    guard let url = URL(string: string) else { return nil }
    return await self.loadAsync(from: url)
  }
  
  static func loadAsync(from url: URL?) async -> Image? {
    guard let url = url else { return nil }
    let request = URLRequest(url: url)
    guard let (data, _) = try? await URLSession.shared.data(for: request) else { return nil }
    guard let image = UIImage(data: data) else { return nil }
    return Image(uiImage: image)
  }
  
}
