import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Prologue from "./pages/Prologue";
import Airport from "./pages/Airport";
import View from "./pages/View";
import Rest from "./pages/Rest";
import Walk from "./pages/Walk";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Intro/>} />
      <Route path="/prologue" element={<Prologue/>} />
      <Route path="/airport" element={<Airport/>} />
      <Route path="/Walk" element={<Walk/>} />
      <Route path="/View" element={<View/>} />
      <Route path="/Rest" element={<Rest/>} />
    </Routes>
  </BrowserRouter>
);

export default Router;
