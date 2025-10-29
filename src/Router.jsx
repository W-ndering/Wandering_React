import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mountain from "./Mountain";
import Traveler from "./Traveler";
import ClimbDown from "./ClimbDown";
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/mountain" element={<Mountain />} />
      <Route path="/traveler" element={<Traveler />} />
      <Route path="/climbdown" element={<ClimbDown />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
