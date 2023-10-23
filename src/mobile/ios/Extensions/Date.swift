//
//  Date.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/14/23.
//

import Foundation

extension Date {
  
  func distanceFromNow() -> String {
    let interval = Calendar.current.dateComponents([.minute, .hour, .day], from: self, to: Date())
    if let day = interval.day, day > 0 {
      return "\(day)d"
    } else if let hour = interval.hour, hour > 0 {
      return "\(hour)h"
    } else if let minute = interval.minute, minute > 0 {
      return "\(minute)m"
    } else {
      return "just now"
    }
  }
  
  func formatted(_ format: String) -> String? {
    let formatter = DateFormatter();
    formatter.dateFormat = format
    return formatter.string(from: self)
  }
  
}
