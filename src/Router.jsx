import { HashRouter, Routes, Route } from "react-router-dom";
import Market from "./Market";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Market />} />
      <Route path="/market" element={<Market />} />
    </Routes>
  </HashRouter>
);

export default Router;
