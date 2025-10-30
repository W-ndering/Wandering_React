import { HashRouter, Routes, Route } from "react-router-dom";
import Credits from "./Credits";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Credits />} />
      <Route path="/credits" element={<Credits />} />
    </Routes>
  </HashRouter>
);

export default Router;
