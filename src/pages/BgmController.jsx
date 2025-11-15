// 사용자의 아무런 상호작용 없이 음원이 자동재생되는 건 거의 불가능하다고 하여
// 일단 Guide.jsx의 play 버튼을 눌렀을 때부터 음원 재생이 시작되도록 구현하였습니다.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import bgm1 from "../assets/bgm/bgm1.mp3";
import bgm2 from "../assets/bgm/bgm2.mp3";
import bgm3 from "../assets/bgm/bgm3.mp3";
import bgm4 from "../assets/bgm/bgm4.mp3";
import bgm5 from "../assets/bgm/bgm5.mp3";

const BGM_FILES = {
  bgm1,
  bgm2,
  bgm3,
  bgm4,
  bgm5
};

const BGM_GROUP = {
  // --- bgm1 구간 ---
  "/prologue": "bgm1",
  "/airport": "bgm1",
  "/view": "bgm1",
  "/rest": "bgm1",
  "/walk": "bgm1",
  "/nightdayhotel": "bgm1",

  // --- bgm2 구간 ---
  "/bus-stop": "bgm2",
  "/bus-stop-memory": "bgm2",
  "/in-bus": "bgm2",
  "/bus-choice-1": "bgm2",
  "/bus-choice-2": "bgm2",
  "/bus-choice-3": "bgm2",

  // --- bgm3 구간 ---
  "/mountain": "bgm3",
  "/traveler": "bgm3",
  "/climbdown": "bgm3",

  // --- bgm4 구간 ---
  "/reminiscene": "bgm4",
  "/cabinindoor": "bgm4",
  "/market": "bgm4",
  "/market-choice-1": "bgm4",
  "/market-choice-2": "bgm4",
  "/market-choice-3": "bgm4",
  "/hut": "bgm4",
  "/cabinsunset": "bgm4",

  // --- bgm5 구간 ---
  "/beach": "bgm5",
  "/result": "bgm5",
  "/credits": "bgm5"
};

export default function BgmController({ canPlay }) {
  const audioRef = useRef(new Audio());
  const [currentGroup, setCurrentGroup] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // 라우트 or canPlay 바뀔 때마다 BGM 처리
  useEffect(() => {
    const audio = audioRef.current;
    const path = location.pathname;
    const newGroup = BGM_GROUP[path] ?? null;

    // 이 라우트에 bgm 없음 → 정지
    if (!newGroup) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentGroup(null);
      return;
    }

    // 같은 그룹이면 같은 BGM 유지
    if (newGroup === currentGroup) {
      // 다만 canPlay가 true로 바뀐 순간에는 재생 시도
      if (canPlay && audio.paused) {
        audio.play().catch(() => { });
      }
      return;
    }

    // 그룹이 변경되면 bgm 교체
    const newSrc = BGM_FILES[newGroup];

    audio.pause();
    audio.currentTime = 0;
    audio.src = newSrc;

    if (canPlay) {
      audio.play().catch((e) => {
        console.log("BGM 재생 실패:", e);
      });
    }

    setCurrentGroup(newGroup);
  }, [location.pathname, canPlay, currentGroup]);

  return null;
}
