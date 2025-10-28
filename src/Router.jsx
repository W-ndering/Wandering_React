import { BrowserRouter, Routes, Route } from "react-router-dom";
import NightDayHotel from "./NightDayHotel";
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<NightDayHotel />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
