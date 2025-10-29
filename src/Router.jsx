import { BrowserRouter, Routes, Route } from "react-router-dom";
import Result from "./Result"
// import Onboarding from "./pages/Onboarding";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/result" element={<Result />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
