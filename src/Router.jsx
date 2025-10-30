import { HashRouter, Routes, Route } from "react-router-dom";
import BusChoice3 from "./BusChoice3";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<BusChoice3 />} />
      <Route path="/bus-choice-3" element={<BusChoice3 />} />
    </Routes>
  </HashRouter>
);

export default Router;
