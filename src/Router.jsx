import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mountain from "./Mountain"
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Mountain />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
