import { HashRouter, Routes, Route } from "react-router-dom";
import BusStop from "./BusStop";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<BusStop />} />
      <Route path="/bus-stop" element={<BusStop />} />
    </Routes>
  </HashRouter>
);

export default Router;
