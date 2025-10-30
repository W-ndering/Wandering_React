import { HashRouter, Routes, Route } from "react-router-dom";
import BusChoices from "./BusChoices";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<BusChoices />} />
      <Route path="/bus-choices" element={<BusChoices />} />
    </Routes>
  </HashRouter>
);

export default Router;
