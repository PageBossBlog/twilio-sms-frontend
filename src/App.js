import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Support from "./pages/support";
import SMSSender from "./pages/smsSender";

function App() {
  return (
    <BrowserRouter>
      <nav className="fixed top-0 left-0 z-20 w-full bg-white border-b-2 border-blue-600">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
          <a href="/" className="flex items-center">
            <div className="inline-flex self-center text-2xl font-bold text-blue-600 whitespace-nowrap">
              <span>SMS Sender</span>
              <a
                href="https://t.me/pageboss"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-3 py-0.5 ml-2 text-sm font-medium text-black bg-green-200 rounded-full"
              >
                <span>by PageBoss</span>
              </a>
            </div>
          </a>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<SMSSender />} />
        <Route path="/support" element={<Support />} />
      </Routes>

      <footer className="m-4 bg-white rounded-lg shadow">
        <div className="w-full max-w-screen-xl p-4 mx-auto md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-900 sm:text-center">
            © 2024{" "}
            <a href="https://SMS Sender.web.app/" className="hover:underline">
              SMS Sender
            </a>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-900 sm:mt-0">
            <li>
              <a href="/support" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;