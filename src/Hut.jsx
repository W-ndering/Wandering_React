import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/bg/19-8_오두막집거실.svg";
import char1 from "./assets/char/기본_주인공1.svg";
import lady from "./assets/char/아줌마.svg";
import textbox from "./assets/obj/text_box.svg";
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
      textStyle: { textAlign: "center", width: "827px", left: "calc(50% - 827px/2 + 0.5px)", top: "41.25%" },
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
      dialogueStyle: { gap: "8px", top: "569px" },
      movable: false
    },
    {
      id: 154,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: "50.55%", top: 978, width: 400, height: 400 }
      ],
      speaker: "player",
      text: "괜찮아요. 덕분에 축제도 즐기고\n재미있었어요.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" },
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
      dialogueStyle: { gap: "8px", top: "569px" },
      movable: false
    },
    {
      id: 156,
      bg: bg,
      char: [
        { src: lady, left: "26.05%", top: 978, width: 400, height: 400 },
        { src: char1, left: 1294, top: 978, width: 400, height: 400 }
      ],
      speaker: "player",
      text: "감사해요 아주머니. 가보겠습니다!",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" },
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
      setCharX(1294); // Reset to starting position
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

  // 마지막 컷에서 문에 도달 시 fade out & navigate
  useEffect(() => {
    if (current.id !== 156) return;
    if (!navigatedRef.current && charX >= DOOR_X) {
      navigatedRef.current = true;
      setIsFading(true);
      setTimeout(() => {
        navigate("/credits");
      }, 1000); // 1초 후 페이지 이동
    }
  }, [current.id, charX, navigate]);

  const bgStyle = typeof current.bg === "string" && current.bg.startsWith("#")
    ? { backgroundColor: current.bg }
    : { backgroundImage: `url(${current.bg})` };

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
            className={styles.character}
            style={{
              position: "absolute",
              left: typeof charLeft === "string" ? charLeft : `${charLeft}px`,
              top: `${c.top}px`,
              width: `${c.width}px`,
              height: `${c.height}px`,
            }}
          />
        );
      });
    }
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character}
        style={{
          position: "absolute",
          left: typeof char.left === "string" ? char.left : `${char.left}px`,
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

        {current.popup && current.popup.type === "text" && (
          <>
            <img src={current.popup.src} alt="textbox" className={styles.textbox} />

            {current.speaker ? (
              <div className={styles.dialogue} style={current.dialogueStyle || {}}>
                <div className={styles.speaker}>{current.speaker}</div>
                <div className={styles.text}>{displayedText}</div>
              </div>
            ) : (
              <div
                className={styles.narration}
                style={{
                  fontFamily: 'DungGeunMo',
                  fontSize: '60px',
                  lineHeight: '140%',
                  letterSpacing: '0.02em',
                  color: '#000000',
                  whiteSpace: 'pre-wrap',
                  ...(current.textStyle || {})
                }}
              >
                {displayedText}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
