//
//  ContentView.swift
//  watchOS Watch App
//
//  Created by tmorgan on 4/12/23.
//

import SwiftUI

public class Summary {
  
}

class State: ObservableObject {
  @Published internal var summaries = [Summary]()
}

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("Hello, world!")
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
