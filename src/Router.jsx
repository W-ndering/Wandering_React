import { HashRouter, Routes, Route } from "react-router-dom";
import MarketChoice2 from "./MarketChoice2";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<MarketChoice2 />} />
      <Route path="/market-choice-2" element={<MarketChoice2 />} />
    </Routes>
  </HashRouter>
);

export default Router;
