import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/bg/23-9_2번선택지.svg";
import char2 from "./assets/char/기본_주인공2.svg";
import char3 from "./assets/char/기본_주인공3.svg";
import npc5 from "./assets/char/Npc5.svg";
import textbox from "./assets/obj/text_box.svg";
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
      textStyle: { textAlign: "center", width: "858px", left: "calc(50% - 858px/2)", top: "44.17%" },
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
      textStyle: { textAlign: "center", width: "828px", left: "calc(50% - 828px/2)", top: "41.25%" },
      movable: false
    },
    {
      id: 145,
      bg: bg,
      char: { src: char3, left: 599, top: 978, width: 400, height: 400 },
      text: "더할 나위 없이 덩달아 흥겨워지는 풍경이다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "827px", left: "calc(50% - 827px/2 + 0.5px)", top: "44.58%" },
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
    if (cut.movable) {
      setCharX(599); // Reset to starting position
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
      if (e.key !== "Enter") return;
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
    if (!current.movable) return;

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

  const bgStyle = typeof current.bg === "string" && current.bg.startsWith("#")
    ? { backgroundColor: current.bg }
    : { backgroundImage: `url(${current.bg})` };

  const renderChar = (char) => {
    if (!char) return null;
    const charLeft = current.movable ? charX : char.left;
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character}
        style={{
          position: "absolute",
          left: typeof charLeft === "string" ? charLeft : `${charLeft}px`,
          top: `${char.top}px`,
          width: `${char.width}px`,
          height: `${char.height}px`,
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
        className={styles.npc}
        style={{
          position: "absolute",
          left: typeof n.left === "string" ? n.left : `${n.left}px`,
          top: `${n.top}px`,
          width: `${n.width}px`,
          height: `${n.height}px`,
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
        className={styles.object}
        style={{
          position: "absolute",
          left: typeof obj.left === "string" ? obj.left : `${obj.left}px`,
          top: `${obj.top}px`,
          width: `${obj.width}px`,
          height: `${obj.height}px`,
        }}
      />
    ));
  };

  return (
    <div className={styles.viewport}>
      {isFading && <div className={`${styles.fadeOverlay} ${styles.fadeOut}`} />}
      <div className={styles.stage}>
        <div className={styles.background} style={bgStyle}>
          {current.dim && <div className={styles.dim} style={{ backgroundColor: current.dim }} />}
          {current.title && <div className={styles.title}>{current.title}</div>}
          {renderChar(current.char)}
          {renderNpc(current.npc)}
          {renderObjects(current.objects)}
        </div>

        {current.popup && (
          <div className={styles.popupContainer}>
            {current.popup.type === "text" && (
              <div className={styles.textPopup}>
                <img src={current.popup.src} alt="textbox" className={styles.textboxImage} />
                <div
                  className={styles.dialogueText}
                  style={{
                    position: "absolute",
                    whiteSpace: "pre-wrap",
                    ...(current.textStyle || {})
                  }}
                >
                  {displayedText}
                </div>
              </div>
            )}

            {current.popup.type === "interact" && (
              <div className={styles.popupInterContainer} onClick={handleNext}>
                {current.popup.icon && (
                  <img
                    src={current.popup.icon}
                    alt="interaction"
                    className={styles.popupInterImage}
                    onClick={handleNext}
                  />
                )}
              </div>
            )}

            {current.popup.type === "single" && (
              <img src={current.popup.src}
                alt="단독아이템"
                className={styles.popupSingleImage}
                onClick={handleNext}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
