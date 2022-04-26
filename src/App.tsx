import { MantineProvider } from "@mantine/core";
import React from "react";
import "./App.css";
import Board from "./components/Board";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <MantineProvider
        theme={{
          // Theme is deeply merged with default theme
          colorScheme: "light",
          fontFamily: "Roboto, sans-serif",
          colors: {
            // Add your color
            "deep-blue": ["#E9EDFC", "#C1CCF6", "#99ABF0" /* ... */],
            // or replace default theme color
            blue: ["#E9EDFC", "#C1CCF6", "#99ABF0" /* ... */],
          },

          shadows: {
            // other shadows (xs, sm, lg) will be merged from default theme
            md: "1px 1px 3px rgba(0,0,0,.25)",
            xl: "5px 5px 3px rgba(0,0,0,.25)",
          },

          headings: {
            fontFamily: "Roboto, sans-serif",
            sizes: {
              h1: { fontSize: 56 },
              h2: { fontSize: 40 },
              h3: { fontSize: 32 },
              h4: { fontSize: 24 },
            },
          },
        }}
      >
        <div className="game">
          <Board height={8} width={8} mines={10} />
        </div>
        {/* <Home/> */}
      </MantineProvider>
    </div>
  );
}

export default App;
