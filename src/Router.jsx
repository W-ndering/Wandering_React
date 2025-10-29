import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mountain from "./Mountain";
import Traveler from "./Traveler";
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Mountain />} />
      <Route path="/traveler" element={<Traveler />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
