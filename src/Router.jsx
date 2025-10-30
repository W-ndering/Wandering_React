import { HashRouter, Routes, Route } from "react-router-dom";
import HutFront from "./HutFront";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<HutFront />} />
      <Route path="/hut-front" element={<HutFront />} />
    </Routes>
  </HashRouter>
);

export default Router;
