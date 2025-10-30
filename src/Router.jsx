import { HashRouter, Routes, Route } from "react-router-dom";
import Hut from "./Hut";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Hut />} />
      <Route path="/hut" element={<Hut />} />
    </Routes>
  </HashRouter>
);

export default Router;
