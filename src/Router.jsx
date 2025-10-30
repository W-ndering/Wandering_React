import { BrowserRouter, Routes, Route } from "react-router-dom";
import CabinIndoor from "./CabinIndoor"
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/cabinindoor" element={<CabinIndoor />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
