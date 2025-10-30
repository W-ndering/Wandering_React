import { HashRouter, Routes, Route } from "react-router-dom";
import InBus from "./InBus";

const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<InBus />} />
      <Route path="/in-bus" element={<InBus />} />
    </Routes>
  </HashRouter>
);

export default Router;
