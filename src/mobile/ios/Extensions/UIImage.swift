//
//  UIImage.swift
//  ReadLess
//
//  Created by thom on 10/6/23.
//

import Foundation
import UIKit

extension UIImage {
  
  func resized(toWidth width: CGFloat, isOpaque: Bool = true) -> UIImage? {
    let size = CGSize(width: width, height: width / size.width * size.height)
    return self.resized(toSize: size, isOpaque: isOpaque)
  }
  
  func resized(toSize size: CGSize, isOpaque: Bool = true) -> UIImage? {
    UIGraphicsBeginImageContextWithOptions(size, true, 1.0)
    self.draw(in: CGRect(origin: .zero, size: size))
    defer { UIGraphicsEndImageContext() }
    return UIGraphicsGetImageFromCurrentImageContext()
  }
  
}
