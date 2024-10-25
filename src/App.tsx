import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import GeneratePlaylistPage from "./pages/GeneratePlaylistPage";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "/generateplaylist",
    element: <GeneratePlaylistPage />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
