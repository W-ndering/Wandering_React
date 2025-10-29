import { BrowserRouter, Routes, Route } from "react-router-dom";
import CabinSunset from "./CabinSunset";
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/cabinsunset" element={<CabinSunset />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
