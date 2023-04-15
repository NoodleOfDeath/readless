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
      return "\(day) day\(day == 1 ? "" : "s") ago"
    } else if let hour = interval.hour, hour > 0 {
      return "\(hour) hour\(hour == 1 ? "" : "s") ago"
    } else if let minute = interval.minute, minute > 0 {
      return "\(minute) minute\(minute == 1 ? "" : "s") ago"
    } else {
      return "just now"
    }
  }
}
