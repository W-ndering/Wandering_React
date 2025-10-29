import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beach from "./Beach"
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/beach" element={<Beach />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
