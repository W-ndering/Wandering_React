import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/16-7_산에서내려가는길.svg";
import bg2 from "../assets/bg/17-7_절벽.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char2 from "../assets/char/기본_주인공2.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./ClimbDown.module.css";

export default function Traveler() {
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      char: char1,
      speaker: nickname,
      text: "저기요, 저 이제 어디로 가야해요?"
    },
    {
      id: 2,
      speaker: "목소리",
      text: "산을 내려가 봐."
    },
    {
      id: 3,
      bg: bg2,
      char: char2,
      text: "산을 올라갔다 내려갔다\n왜 이렇게 힘든 길을 걸어가야 하는지\n정말 의문이다."
    },
    {
      id: 4,
      text: "이렇게까지 해서\n내가 찾아야 하는 것이 뭔지."
    },
    {
      id: 5,
      text: "산을 내려갈수록 길이 보이지 않는다.\n사람이 다니는 산이 아닌 것 같다."
    },
    {
      id: 6,
      bg: "#282828",
      char: "none",
      speaker: nickname,
      text: "어어? ..."
    },
    {
      id: 7,
      bg: "#000000",
      speaker: nickname,
      text: "으아아악!!!"
    },
    {
      id: 8,
      text: "절벽에서 굴러 떨어진 듯 하다."
    },
    {
      id: 9,
      text: "몸을 일으켜 보려 했지만\n다리를 다친 듯 일어설 수 없다."
    },
    {
      id: 10,
      text: "아직 내가 뭘 찾는지도 모르는데,\n이렇게 죽는 건가."
    },
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
    npc: storyCuts[0].npc ?? null,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const [charX, setCharX] = useState(100); // 시작 x좌표(px) — 필요에 따라 조정
  const navigatedRef = useRef(false);

  useEffect(() => { // 텍스트 타이핑 효과
    const text = current.text;

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    if (!text) { setDisplayedText(""); setIsTyping(false); return; }
    setDisplayedText(""); setIsTyping(true);

    let i = 0;
    typingTimerRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        setIsTyping(false);
      }
    }, 50);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [current.text]);

  useEffect(() => {
    const merged = {
      ...storyCuts[idx],
      bg: storyCuts[idx].bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
      char:
        storyCuts[idx].char === "none" // 캐릭터 사용 안 하는 경우
          ? null
          : (storyCuts[idx].char ?? lastVisual.char) // char 입력 없으면 이전 char 유지
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char });

    navigatedRef.current = false;

    if (storyCuts[idx].id === 5) {
      setCharX(850);
    }
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      navigate("/reminiscene"); // 회상 씬으로 이동
      return;
    }

    setIdx(idx + 1);
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;

      // 타이핑 중이면 타이머를 멈추고 즉시 완성
      if (isTyping && current.text) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setDisplayedText(current.text);
        setIsTyping(false);
        return;
      }
      // 그 외엔 다음 컷
      handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTyping, current.id, current.text]);

  return (
    <div className={styles.viewport}>

      <div className={styles.stage}>
        {current.bg.startsWith("#") // 배경
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 캐릭터 */}
        {current.char && (
          <img
            src={current.char}
            alt="캐릭터"
            className={styles.character}
            style={{
              position: "absolute",
              bottom: 65,
              left: `${charX}px`,
            }}
          />
        )}

        {current.text && (
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            {(() => {
              const hasLineBreak = current.text.includes("\n"); // 대사 줄바꿈 유무
              const isBigText = current.id === 7; // 해당 설명은 "화자와 대사 출력" 설명에 포함했습니다

              return (
                <div
                  className={[
                    styles.textboxContent, // 텍스트 박스 안에 있는 텍스트 위치 분기
                    !current.speaker ? styles.centerText : "",           // 기본 (화자 X)
                    current.speaker && !hasLineBreak ? styles.noLineBreak : "",  // 화자 O, 대사 줄바꿈 X
                    current.speaker && (hasLineBreak || isBigText) ? styles.yesLineBreak : "" // 화자 O, 대사 줄바꿈 O (줄바꿈은 없지만 대사 크기가 큰 경우도 포함)
                  ].join(" ").trim()}
                >
                  {current.speaker && (
                    <div className={styles.speaker}>{current.speaker}</div>
                  )}
                  <div className={`${styles.content} ${current.id === 7 ? styles.contentCustom2 : ""}`}>{displayedText}</div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

    </div>
  );
}