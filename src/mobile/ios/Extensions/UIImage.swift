//
//  UIImage.swift
//  ReadLess
//
//  Created by thom on 10/6/23.
//

import Foundation
import ImageIO
import UIKit

extension UIImage {
  
  static func load(from imageURL: URL, maxWidth: CGFloat = .infinity) -> UIImage? {
    
    // Create an CGImageSource that represent an image
    let imageSourceOptions = [kCGImageSourceShouldCache: false] as CFDictionary
    guard let imageSource = CGImageSourceCreateWithURL(imageURL as CFURL, imageSourceOptions) else {
      return nil
    }
    
    guard let imageProperties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, nil) as Dictionary?,
          let pixelWidth = imageProperties[kCGImagePropertyPixelWidth]?.floatValue,
          let pixelHeight = imageProperties[kCGImagePropertyPixelHeight]?.floatValue
    else {
      return nil
    }
    
    let size = CGSize(width: maxWidth, height: maxWidth / CGFloat(pixelWidth) * CGFloat(pixelHeight))
    
    // Calculate the desired dimension
    let maxDimensionInPixels = max(size.width, size.height)
    
    // Perform downsampling
    let options = [
      kCGImageSourceCreateThumbnailFromImageAlways: true,
      kCGImageSourceCreateThumbnailFromImageIfAbsent: true,
      kCGImageSourceShouldCacheImmediately: true,
      kCGImageSourceCreateThumbnailWithTransform: true,
      kCGImageSourceThumbnailMaxPixelSize: maxDimensionInPixels
    ] as CFDictionary
    
    guard let imgRef = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, options) else { return nil }
    return UIImage(cgImage: imgRef)
  }
  
}


