import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Prologue from "./pages/Prologue";
import Airport from "./pages/Airport";
import View from "./pages/View";
import Rest from "./pages/Rest";
import Walk from "./pages/Walk";
import Reminiscene from "./pages/Reminiscene";
import Guide from "./pages/Guide";
import NightDayHotel from "./pages/NightDayHotel";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Intro/>} />
      <Route path="/prologue" element={<Prologue/>} />
      <Route path="/airport" element={<Airport/>} />
      <Route path="/walk" element={<Walk/>} />
      <Route path="/view" element={<View/>} />
      <Route path="/rest" element={<Rest/>} />
      <Route path="/reminiscene" element={<Reminiscene/>} />
      <Route path="/guide" element={<Guide/>} />
      <Route path="/nightdayhotel" element={<NightDayHotel />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
