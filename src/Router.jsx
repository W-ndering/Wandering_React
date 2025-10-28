import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stage1 from "./pages/Stage1";
import Stage2 from "./pages/Stage2";
import Airport from "./pages/Airport";
const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/airport" element={<Airport/>} />
      <Route path="/s1" element={<Stage1/>} />
      <Route path="/s2" element={<Stage2/>} />
    </Routes>
  </BrowserRouter>
);

export default Router;
