import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/7-1_밤의호텔.svg";
import bg2 from "../assets/bg/8-2_아침호텔.svg";
import char1 from "../assets/char/잠옷_주인공1.svg";
import char2 from "../assets/char/기본_주인공1.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import statebox from "../assets/obj/상태창.svg"
import phone from "../assets/obj/핸드폰_검색.svg"
import styles from "./NightDayHotel.module.css";

export default function NightDayHotel() {
  const navigate = useNavigate();
  const NEXT_ROUTE = "/bus-stop"; // 다음 스토리 경로 설정 (임시)
  const [idx, setIdx] = useState(0);
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      char: char1,
      speaker: nickname,
      text: "피곤하다. 내일을 위해서 일찍 자야지."
    },
    {
      id: 2,
      bg: "#282828",
      char: "none",
      speaker: "???",
      text: "산으로 가."
    },
    {
      id: 3,
      bg: bg2,
      text: "정말 머릿속에서만 들리는\n이 목소리 때문에 미칠 지경이다."
    },
    {
      id: 4,
      char: "none",
      text: "나를 이곳까지 끌고 온 목적이 뭐지?"
    },
    {
      id: 5,
      char: "none",
      text: "솔직히 밑져야 본전이다."
    },
    {
      id: 6,
      char: "none",
      text: "어차피 할 것도 없고 여기까지 온 거\n하라는 대로 해봐야겠다."
    },
    {
      id: 7,
      char: char1,
      text: "어차피 할 것도 없고 여기까지 온 거\n하라는 대로 해봐야겠다."
    },
    {
      id: 8,
      text: "산? 그게 어디지?",
    },
    {
      id: 9,
      text: "산? 그게 어디지?",
      choice: {
        src: choicebox,
        text: "검색하기"
      }
    },
    {
      id: 10,
      char: "none",
      popup: {
        src: statebox,
        obj: phone,
        text: "검색어 : 산\n0000번 버스로 약 1시간"
      }
    },
    {
      id: 11,
      char: "none",
      popup: {
        src: statebox,
        obj: phone,
        text: "또다시 장거리 이동이다.\n슬슬 준비해야겠다."
      }
    },
    {
      id: 12,
      char: char2,
      text: "(오른쪽으로 이동하자.)"
    }/*,
    {
      id: 13,
      bg: "#282828",
      char: "none"
    }*/
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const [charX, setCharX] = useState(500); // 시작 x좌표(px) — 필요에 따라 조정
  const keysRef = useRef({ left: false, right: false });
  const SPEED = 500;
  const minX = 0;
  const maxX = 2160;
  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);


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
    const cut = storyCuts[idx];
    const merged = {
      ...cut,
      bg: cut.bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
      char:
        cut.char === "none" // 캐릭터 사용 안 하는 경우
          ? null
          : cut.char ?? lastVisual.char, // char 입력 없으면 이전 char 유지
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char });
  }, [idx]);

  const handleNext = () => {
    if (idx < storyCuts.length - 1) setIdx(idx + 1); // 현재 컷이 마지막이 아니면 다음 컷으로 이동을 위해 idx 설정
    else (
      navigate(NEXT_ROUTE) // 현재 컷이 마지막이면 다음 경로로 이동
    )
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

  // 키 입력 등록
  useEffect(() => {
    const down = (e) => {
      if (e.key === "ArrowLeft") {
        if (!keysRef.current.left) keysRef.current.left = true;
      }
      if (e.key === "ArrowRight") {
        if (!keysRef.current.right) keysRef.current.right = true;
      }
    };
    const up = (e) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);


  // 이동 루프
  useEffect(() => {
    // 루프 시작 시 초기화
    lastTimeRef.current = null;
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }

    moveTimerRef.current = setInterval(() => {
      if (!current.char) return;

      const now = performance.now();
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now; // 첫 틱은 이동하지 않음 (초반 튐 방지)
        return;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const { left, right } = keysRef.current;
      const dir = (left ? -1 : 0) + (right ? 1 : 0);
      if (dir !== 0) {
        setCharX(x => Math.max(minX, Math.min(maxX, x + dir * SPEED * dt)));
      }
    }, 16);

    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
        moveTimerRef.current = null;
      }
    };
  }, [current.char, SPEED, minX, maxX]);


  return (
    <div className={styles.viewport}>

      <div className={styles.stage}>
        {current.bg.startsWith("#") // 배경
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 특정 장면에서 배경 dim */}
        {[3, 4, 5, 6, 9, 10, 11].includes(current.id) && <div className={styles.bgDim} />}

        {/* 캐릭터 */}
        {current.char && (
          <img
            src={current.char}
            alt="캐릭터"
            className={styles.character}
            style={{
              position: "absolute",
              bottom: 75,
              left: `${charX}px`,
            }}
          />
        )}

        {current.text && ( // 텍스트창
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            <div // 화자 없으면 가운데정렬 (기본은 왼쪽정렬), 있으면 약간 위로 옮기기
              className={`${styles.textboxContent}
                ${!current.speaker ? styles.centerText : ""} 
                ${current.speaker ? styles.upText : ""}`} >
              {current.speaker && (
                <div className={styles.speaker}>{current.speaker}</div>
              )}
              <div className={styles.content}>{displayedText}</div>
            </div>
          </div>
        )}


        {current.choice && ( // 선택지창
          <div className={styles.choiceWrap}>
            <img
              src={current.choice.src}
              alt="선택지박스"
              className={styles.choiceImage}
              onClick={handleNext}
            />
            {current.choice.text && (
              <div className={styles.choiceText}>
                {current.choice.text}
              </div>
            )}
          </div>
        )}

        {current.popup && ( // 팝업창(아이템)
          <div className={styles.popupWrap}>
            <img src={current.popup.src} alt="팝업창" className={styles.popupImage} onClick={handleNext}/>

            {current.popup.obj && (
              <img src={current.popup.obj} alt="팝업창오브제" className={styles.popupObjImage} />
            )}

            {current.popup.text && (
              <div className={styles.popupText}>
                {idx === 9
                  ? current.popup.text.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className={i === 1 ? styles.popupLineSmall : ""}
                    >
                      {line}
                    </div>
                  ))
                  : current.popup.text}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
