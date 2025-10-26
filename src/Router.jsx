import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Onboarding />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
