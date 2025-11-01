import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/23-9_2번선택지.svg";
import char2 from "../assets/char/기본_주인공2.svg";
import char3 from "../assets/char/기본_주인공3.svg";
import npc5 from "../assets/char/Npc5.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function MarketChoice2() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [charX, setCharX] = useState(599); // 23.4% of 2560 = 599
  const keysRef = useRef({ left: false, right: false });
  const navigatedRef = useRef(false);
  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  const SPEED = 500;
  const minX = 0;
  const maxX = 2160;

  const storyCuts = [
    {
      id: 143,
      bg: bg,
      char: { src: char3, left: "23.4%", top: 978, width: 400, height: 400 },
      npc: [
        { src: npc5, left: 1600, top: 978, width: 400, height: 400 }
      ],
      text: "축제를 둘러보니 여러 풍경들이 눈에 들어온다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "858px"},
      movable: false
    },
    {
      id: 144,
      bg: bg,
      char: { src: char2, left: 1080, top: 978, width: 400, height: 400 },
      npc: [
        { src: npc5, left: 1600, top: 978, width: 400, height: 400 }
      ],
      text: "특이한 음식을 파는 사람들,\n광장에서 춤을 추는 사람들,\n구석에서 놀고 있는 아이들",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "828px"},
      movable: false
    },
    {
      id: 145,
      bg: bg,
      char: { src: char3, left: 599, top: 978, width: 400, height: 400 },
      text: "더할 나위 없이 덩달아 흥겨워지는 풍경이다.\n(오른쪽으로 이동하자)",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "827px"},
      movable: true
    }
  ];

  const [current, setCurrent] = useState(storyCuts[0]);
  const [lastVisual, setLastVisual] = useState({
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
    npc: storyCuts[0].npc ?? null,
  });
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  useEffect(() => {
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
      bg: cut.bg ?? lastVisual.bg,
      char: cut.char ?? lastVisual.char,
      npc: cut.npc ?? lastVisual.npc,
    };
    setCurrent(merged);
    setLastVisual({ bg: merged.bg, char: merged.char, npc: merged.npc });

    // Reset charX when moving to movable scene
    // ❗️ 수정 1: 'movable' 씬으로 이동할 때 'char' 데이터의 초기 'left' 값으로 설정
    if (cut.movable && cut.char.left) {
        // '23.4%' 같은 문자열을 숫자로 변환 (이 코드는 599로 고정됨)
        // 여기서는 데이터에 있는 599를 사용합니다.
        const initialX = typeof cut.char.left === 'string' 
            ? parseFloat(cut.char.left) // %를 숫자로 바꾸는 더 복잡한 로직이 필요할 수 있음
            : cut.char.left;
        // storyCuts[2].char.left가 599 (숫자)이므로 599가 됩니다.
        setCharX(initialX); 
    }
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      return; // 마지막 씬에서는 Enter로 진행 안 함 (이동만 가능)
    }

    setIdx(idx + 1);
  };

  // Enter키로 다음 컷으로 이동 (마지막 컷 제외)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== " ") return;
      e.preventDefault();
      if (current.movable) return; // 이동 가능한 씬에서는 Enter 무시

      if (isTyping) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setDisplayedText(current.text);
        setIsTyping(false);
      } else {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTyping, current.text, idx, current.movable]);

  // 키 입력 등록 (마지막 씬에서만)
  useEffect(() => {
    if (!current.movable) return;

    const down = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") {
        if (!keysRef.current.left) keysRef.current.left = true;
      }
      if (e.key === "d" || e.key === "ArrowRight") {
        if (!keysRef.current.right) keysRef.current.right = true;
      }
    };
    const up = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "d" || e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [current.movable]);

  // 이동 루프 (마지막 씬에서만)
  useEffect(() => {
    if (!current.movable) {
        // 이동 가능하지 않은 씬에서는 타이머를 확실히 제거합니다.
        if (moveTimerRef.current) {
            clearInterval(moveTimerRef.current);
            moveTimerRef.current = null;
        }
        return;
    }

    // 루프 시작 시 초기화
    lastTimeRef.current = null;
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }

    moveTimerRef.current = setInterval(() => {
      const now = performance.now();
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now;
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
  }, [current.movable, SPEED, minX, maxX]);

  // 마지막 컷에서 우측 끝 도달 시 fade out & navigate
  useEffect(() => {
    if (current.id !== 145) return;
    const EDGE = maxX - 5;
    if (!navigatedRef.current && charX >= EDGE) {
      navigatedRef.current = true;
      setIsFading(true);
      setTimeout(() => {
        navigate("/hut");
      }, 1000); // 1초 후 페이지 이동
    }
  }, [current.id, charX, maxX, navigate]);

  const renderChar = (char) => {
    if (!char) return null;
    // 'movable' 상태에 따라 'left' 값을 'charX' 또는 'char.left'로 결정
    const charLeft = current.movable ? charX : char.left;
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character} // ❗️ 수정 2: 올바른 CSS 클래스 사용
        style={{
          position: "absolute",
          // 'charLeft'가 숫자면 'px'를 붙이고 문자열(예: '23.4%')이면 그대로 사용
          left: typeof charLeft === "string" ? charLeft : `${charLeft}px`,
          top: typeof char.top === "string" ? char.top : `${char.top}px`,
          width: typeof char.width === "string" ? char.width : `${char.width}px`,
          height: typeof char.height === "string" ? char.height : `${char.height}px`,
        }}
      />
    );
  };

  const renderNpc = (npc) => {
    if (!npc) return null;
    return npc.map((n, i) => (
      <img
        key={i}
        src={n.src}
        alt="npc"
        className={styles.charNPC} // ❗️ 수정 3: 'styles.npc' -> 'styles.charNPC'
        style={{
          position: "absolute",
          left: typeof n.left === "string" ? n.left : `${n.left}px`,
          top: typeof n.top === "string" ? n.top : `${n.top}px`,
          width: typeof n.width === "string" ? n.width : `${n.width}px`,
          height: typeof n.height === "string" ? n.height : `${n.height}px`,
        }}
      />
    ));
  };

  const renderObjects = (objects) => {
    // (이전과 동일한 로직)
    if (!objects) return null;
    return objects.map((obj, i) => (
      <img
        key={i}
        src={obj.src}
        alt="object"
        className={styles.object} // .object 클래스가 CSS에 정의되어 있어야 함
        style={{
          position: "absolute",
          left: typeof obj.left === "string" ? obj.left : `${obj.left}px`,
          top: typeof obj.top === "string" ? obj.top : `${obj.top}px`,
          width: typeof obj.width === "string" ? obj.width : `${obj.width}px`,
          height: typeof obj.height === "string" ? obj.height : `${obj.height}px`,
        }}
      />
    ));
  };

  // ❗️ 수정 4: 'InBus.jsx'와 동일한 렌더링 구조로 변경
  return (
    <div className={styles.viewport}>
      {/* 🚨 참고: 'styles.fadeOverlay'와 'styles.fadeOut' CSS 클래스 필요 */}
      {isFading && <div className={`${styles.fadeOverlay} ${styles.fadeOut}`} />}
      
      <div className={styles.stage}>
        {/* 1. 배경 (z-index: 0) */}
        {typeof current.bg === "string" && current.bg.startsWith("#")
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 2. 딤 (z-index: 4) */}
        {current.dim && (
          <div className={styles.bgDim} style={{ background: current.dim }} />
        )}

        {/* 3. 타이틀 (z-index: 2) */}
        {current.title && (
          <div className={styles.titleText}>{current.title}</div>
        )}

        {/* 4. 캐릭터 및 NPC (z-index: 2, 3) */}
        {renderChar(current.char)}
        {renderNpc(current.npc)}
        {renderObjects(current.objects)}

        {/* 5. 텍스트 박스 (z-index: 6) */}
        {current.text && (
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            {(() => {
              const hasLineBreak = current.text.includes("\n");
              
              const contentClasses = [
                styles.textboxContent,
                !current.speaker ? styles.centerText : "",
                current.speaker && !hasLineBreak ? styles.upText : "",
                current.speaker && hasLineBreak ? styles.upTextMulti : ""
              ].join(" ").trim();
              
              const customStyle = current.speaker 
                ? (current.dialogueStyle || {}) 
                : (current.textStyle || {});

              return (
                <div className={contentClasses} style={customStyle}>
                  {current.speaker && (
                    <div className={styles.speaker}>{current.speaker}</div>
                  )}
                  <div className={styles.content}>{displayedText}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. 선택지 (이 파일에는 없음) */}
        
        {/* 7. 팝업 (이 파일에는 없음) */}
        {current.popup && current.popup.type !== "text" && (
          <div className={styles.popupWrap}>
            {/* ... (InBus.jsx의 팝업 렌더링 로직) ... */}
          </div>
        )}
      </div>
    </div>
  );
}