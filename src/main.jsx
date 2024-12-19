import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import { YoutubeDetails } from "./Pages/YoutubeDetails.jsx";
import PlaylistPage from "./Pages/PlaylistPage.jsx"; // Import PlaylistPage

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/:videoId" element={<YoutubeDetails />} />
          <Route path="/playlists/:playlistId" element={<PlaylistPage />} /> {/* Add PlaylistPage route */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

