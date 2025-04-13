import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

// Start mock service in development mode

import { Buffer } from "buffer";

// // 确保全局 Buffer 可用
// if (typeof global !== 'undefined') {
//   global.Buffer = Buffer;
// }
if (typeof global !== "undefined") {
  (global as any).Buffer = Buffer;
} else {
  (window as any).Buffer = Buffer;
}
console.log("Buffer", Buffer);
console.log("global", global);
console.log("window", window, window.Buffer);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
