import { createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../components/Layout";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
    },
    ],
  },
]);

export default router;
