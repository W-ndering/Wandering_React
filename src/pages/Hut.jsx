import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/19-8_오두막집거실.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import lady from "../assets/char/아줌마.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function Hut() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [charX, setCharX] = useState(1294); // 50.55% of 2560 = 1294
  const keysRef = useRef({ left: false, right: false });
  const navigatedRef = useRef(false);
  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  const SPEED = 500;
  const minX = 0;
  const maxX = 2160;
  const DOOR_X = 1850; // 문 위치
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const storyCuts = [
    {
      id: 152,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: "50.55%", top: 978, width: 400, height: 400 }
      ],
      text: "축제를 즐기고 다시 아주머니 댁으로\n돌아와 짐을 챙겼다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "827px"},
      movable: false
    },
    {
      id: 153,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: "50.55%", top: 978, width: 400, height: 400 }
      ],
      speaker: "아주머니",
      text: "벌써 가려구? 조금 더 쉬다 가지.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"},
      movable: false
    },
    {
      id: 154,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: "50.55%", top: 978, width: 400, height: 400 }
      ],
      speaker: "player", // ❗️ 'player' 문자열은 아래 렌더링 로직에서 'nickname'으로 치환됩니다.
      text: "괜찮아요. 덕분에 축제도 즐기고\n재미있었어요.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"},
      movable: false
    },
    {
      id: 155,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: "50.55%", top: 978, width: 400, height: 400 }
      ],
      speaker: "아주머니",
      text: "그래요. 잠깐이지만 만나서 반가웠어요.\n앞으로의 길에 행운이 있길 바랄게요.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"},
      movable: false
    },
    {
      id: 156,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: 1294, top: 978, width: 400, height: 400 }
      ],
      speaker: "player", // ❗️ 'player' 문자열은 아래 렌더링 로직에서 'nickname'으로 치환됩니다.
      text: "감사해요 아주머니. 가보겠습니다!",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"},
      movable: true // 마지막 씬에서 이동 가능
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
    if (cut.movable) {
      // 'char' 배열의 1번 인덱스(주인공)의 left 값(1294)으로 charX를 설정
      const playerChar = Array.isArray(cut.char) ? cut.char[1] : cut.char;
      const initialX = typeof playerChar.left === 'string' 
        ? parseFloat(playerChar.left) // % 값일 경우를 대비 (여기서는 1294)
        : playerChar.left;
      setCharX(initialX || 1294); 
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

  // 마지막 컷에서 문에 도달 시 fade out & navigate
  useEffect(() => {
    if (current.id !== 156) return;
    if (!navigatedRef.current && charX >= DOOR_X) {
      navigatedRef.current = true;
      setIsFading(true);
      setTimeout(() => {
        navigate("/cabinsunset");
      }, 1000); // 1초 후 페이지 이동
    }
  }, [current.id, charX, navigate, DOOR_X]); // ❗️ DOOR_X를 의존성 배열에 추가

  const renderChar = (char) => {
    if (!char) return null;
    if (Array.isArray(char)) {
      return char.map((c, i) => {
        // 마지막 씬의 주인공(인덱스 1)만 이동 가능
        const isMovableChar = current.movable && i === 1;
        const charLeft = isMovableChar ? charX : c.left;

        return (
          <img
            key={i}
            src={c.src}
            alt="character"
            // ❗️ 수정 1: 'char' 데이터가 배열일 때 'styles.character' 또는 'styles.charNPC'를
            // 어떻게 적용할지 CSS에 정의되지 않았습니다.
            // 여기서는 'InBus.jsx'의 로직과 맞추기 위해,
            // 주인공(i===1)은 'styles.character', 그 외(i===0)는 'styles.charNPC'로 가정합니다.
            // *만약 'lady'도 'z-index: 3'이어야 한다면 둘 다 'styles.character'를 사용하세요.*
            className={i === 1 ? styles.character : styles.charNPC}
            style={{
              position: "absolute",
              left: typeof charLeft === "string" ? charLeft : `${charLeft}px`,
              top: typeof c.top === "string" ? c.top : `${c.top}px`,
              width: typeof c.width === "string" ? c.width : `${c.width}px`,
              height: typeof c.height === "string" ? c.height : `${c.height}px`,
            }}
          />
        );
      });
    }
    // 배열이 아닌 단일 캐릭터일 경우 (InBus.jsx 호환)
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character}
        style={{
          position: "absolute",
          left: typeof char.left === "string" ? char.left : `${char.left}px`,
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
        // ❗️ 수정 2: 'styles.npc' -> 'styles.charNPC'
        className={styles.charNPC}
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

  // ❗️ 수정 3: 'InBus.jsx'와 동일한 렌더링 구조로 변경
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
                    <div className={styles.speaker}>
                      {/* ❗️ 수정 4: 'player' 문자열을 'nickname' 변수로 교체 */}
                      {current.speaker === 'player' ? nickname : current.speaker}
                    </div>
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