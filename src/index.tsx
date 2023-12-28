import * as React from "react";
import { createRoot } from "react-dom/client";
import { GcmpComponent } from "./app";

const container = document.getElementById("root") as HTMLElement | null;
if (!container) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(container);

const App = (): React.ReactElement => {
  return <GcmpComponent config={{}} />;
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
