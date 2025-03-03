import * as React from "react";
import { createRoot } from "react-dom/client";
import { GcmpComponent } from "./app";

const container = document.getElementById("root") as HTMLElement | null;
if (!container) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(container);

const App = (): React.ReactElement => {
  return (
    <GcmpComponent
      config={{
        debug: true,
        purposes: [
          {
            purpose: 10,
            selectors: '[data-name="analytics"],[data-consent="analytics"]',
            cookies: [/^ga/i, /^_ga/i, /^_gid/i],
          },
          {
            purpose: 7,
            selectors:
              '[data-name="externalmedia"],[data-consent="externalmedia"]',
          },
        ],
      }}
    />
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
