//
//  ReadLessWatchApp.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

@main
struct ReadLessWatch_Watch_AppApp: App {
    var body: some Scene {
      WindowGroup {
        ContentView(service: ConnectService())
      }
    }
}
