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
import Mountain from "./pages/Mountain";
import Traveler from "./pages/Traveler";
import ClimbDown from "./pages/ClimbDown";
import CabinIndoor from "./pages/CabinIndoor";
import CabinSunset from "./pages/CabinSunset";
import Beach from "./pages/Beach";
import Result from "./pages/Result";
import BusStop from "./pages/BusStop";
import BusStopMemory from "./pages/BusStopMemory";
import InBus from "./pages/InBus";
import Market from "./pages/Market";
import MarketChoice1 from "./pages/MarketChoice1";
import MarketChoice2 from "./pages/MarketChoice2";
import MarketChoice3 from "./pages/MarketChoice3";
import Hut from "./pages/Hut";
import Credits from "./pages/Credits";
import BgmController from "./pages/BgmController";
import { useState } from "react";

const Router = () => {
  const [bgmEnabled, setBgmEnabled] = useState(false); // bgm 활성화 가능 유무

  const handleStartBgm = () => {
    // Guide의 play 버튼 클릭 시 bgmEnabled가 true로 바뀌면서, BgmController의 canPlay도 true로 바뀜
    setBgmEnabled(true);
  };

  return (
    <BrowserRouter>
      <BgmController canPlay={bgmEnabled} />

      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/prologue" element={<Prologue />} />
        <Route path="/airport" element={<Airport />} />
        <Route path="/walk" element={<Walk />} />
        <Route path="/view" element={<View />} />
        <Route path="/rest" element={<Rest />} />
        <Route path="/reminiscene" element={<Reminiscene />} />
        <Route path="/guide" element={<Guide onStartBgm={handleStartBgm} />} />
        <Route path="/nightdayhotel" element={<NightDayHotel />} />
        <Route path="/mountain" element={<Mountain />} />
        <Route path="/traveler" element={<Traveler />} />
        <Route path="/climbdown" element={<ClimbDown />} />
        <Route path="/cabinindoor" element={<CabinIndoor />} />
        <Route path="/cabinsunset" element={<CabinSunset />} />
        <Route path="/beach" element={<Beach />} />
        <Route path="/result" element={<Result />} />
        <Route path="/bus-stop" element={<BusStop />} />
        <Route path="/bus-stop-memory" element={<BusStopMemory />} />
        <Route path="/in-bus" element={<InBus />} />
        <Route path="/market" element={<Market />} />
        <Route path="/market-choice-1" element={<MarketChoice1 />} />
        <Route path="/market-choice-2" element={<MarketChoice2 />} />
        <Route path="/market-choice-3" element={<MarketChoice3 />} />
        <Route path="/hut" element={<Hut />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </BrowserRouter>
  )
};

export default Router;
