import { HashRouter, Routes, Route } from "react-router-dom";
import BusStopMemory from "./BusStopMemory";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<BusStopMemory />} />
      <Route path="/bus-stop-memory" element={<BusStopMemory />} />
    </Routes>
  </HashRouter>
);

export default Router;
