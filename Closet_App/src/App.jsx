import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import ClosetGrid from "./ClosetGrid";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ClosetGrid />} />
        <Route path="/generate" element={<MainPage />} />
      </Routes>
    </HashRouter>
  );
}