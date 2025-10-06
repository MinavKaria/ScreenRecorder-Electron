import { RouterProvider } from "react-router-dom";
import router from "./configs/router";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
}

export default App;
