import { HashRouter, Routes, Route } from "react-router-dom";
import MarketChoice1 from "./MarketChoice1";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<MarketChoice1 />} />
      <Route path="/market-choice-1" element={<MarketChoice1 />} />
    </Routes>
  </HashRouter>
);

export default Router;
