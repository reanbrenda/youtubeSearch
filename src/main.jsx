import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import { YoutubeDetails } from './Pages/YoutubeDetails.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/:videoId" element={<YoutubeDetails/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
