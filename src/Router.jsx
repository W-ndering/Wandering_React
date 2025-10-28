import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Prologue from "./pages/Prologue";
import Airport from "./pages/Airport";
const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Intro/>} />
      <Route path="/prologue" element={<Prologue/>} />
      <Route path="/airport" element={<Airport/>} />

    </Routes>
  </BrowserRouter>
);

export default Router;
