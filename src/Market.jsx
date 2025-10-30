import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "./assets/bg/21-9_시장입구.svg";
// TODO: Add character imports once provided
// import char1 from "./assets/char/기본_주인공1.svg";
import textbox from "./assets/obj/text_box.svg";
import choicebox from "./assets/obj/선택지.svg";
import { postChoice } from "./lib/api";
import styles from "./Scene.module.css";

export default function Market() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      text: "시장에 도착했다."
    },
    {
      id: 2,
      text: "활기찬 사람들의 목소리가 들린다.",
    },
    {
      id: 3,
      text: "여기저기 구경하며 걸어본다.",
    },
    {
      id: 4,
      text: "무엇을 할까?",
      choice: {
        src: choicebox,
        text: [
          "시장을 더 둘러본다",
          "오두막으로 간다"
        ]
      }
    },
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

  const [charX, setCharX] = useState(100);
  const navigatedRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const SPEED = 500;
  const minX = 0;
  const maxX = 2160;
  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  const SCENE_ID = 132;

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
      char:
        cut.char === "none"
          ? null
          : (cut.char ?? lastVisual.char),
      npc: cut.npc === "none" ? null : (cut.npc ?? lastVisual.npc)
    };
    setCurrent(merged);
    setLastVisual({ bg: merged.bg, char: merged.char, npc: merged.npc });

    navigatedRef.current = false;
  }, [idx]);

  const handleNext = async (choiceIndex = null) => {
    if (current.id === 4 && choiceIndex !== null) {
      const optionKey = choiceIndex + 1;

      await postChoice({ sceneId: SCENE_ID, optionKey });

      if (choiceIndex === 0) {
        navigate("/market-choices");
      } else {
        navigate("/hut");
      }
      return;
    }

    if (idx >= storyCuts.length - 1) {
      navigate("/market-choices");
      return;
    }

    setIdx(idx + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      if ([4].includes(current.id)) return;

      if (isTyping && current.text) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setDisplayedText(current.text);
        setIsTyping(false);
        return;
      }
      handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTyping, current.id, current.text]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    lastTimeRef.current = null;
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }

    moveTimerRef.current = setInterval(() => {
      if (!current.char) return;

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
  }, [current.char, SPEED, minX, maxX]);

  return (
    <div className={styles.viewport}>
      <div className={styles.stage}>
        {current.bg.startsWith("#")
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {current.dim && (
          <div className={styles.bgDim} style={{ background: current.dim }} />
        )}

        {current.ddim && (
          <div className={styles.ddim} style={{ background: current.ddim }} />
        )}

        {current.title && (
          <div className={styles.titleText}>{current.title}</div>
        )}

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

        {current.npc?.src && (
          <img
            src={current.npc.src}
            alt="npc"
            className={styles.charNPC}
            style={{
              position: "absolute",
              bottom: 65,
              left: `${current.npc.x ?? 1650}px`,
            }}
          />
        )}

        {current.text && (
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            {(() => {
              const hasLineBreak = current.text.includes("\n");

              return (
                <div
                  className={[
                    styles.textboxContent,
                    !current.speaker ? styles.centerText : "",
                    current.speaker && !hasLineBreak ? styles.upText : "",
                    current.speaker && hasLineBreak ? styles.upTextMulti : ""
                  ].join(" ").trim()}
                >
                  {current.speaker && (
                    <div className={styles.speaker}>{current.speaker}</div>
                  )}
                  <div className={styles.content}>{displayedText}</div>
                </div>
              );
            })()}
          </div>
        )}

        {current.choice && (
          <div className={`${styles.choiceWrap} ${Array.isArray(current.choice.text)
            ? styles.choiceWrap
            : styles.choiceWrapSingle
            }`}>
            {Array.isArray(current.choice.text) ? (
              <div className={styles.choiceList}>
                {current.choice.text.map((label, i) => (
                  <div
                    key={i}
                    className={styles.choiceItem}
                    onClick={() => handleNext(i)}
                  >
                    <img
                      src={current.choice.src}
                      alt={`선택지박스 ${i + 1}`}
                      className={styles.choiceImage}
                    />
                    <div className={styles.choiceText}>{label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={styles.choiceItem}
                onClick={() => handleNext(0)}
              >
                <img
                  src={current.choice.src}
                  alt="선택지박스"
                  className={styles.choiceImage}
                />
                <div className={styles.choiceText}>{current.choice.text}</div>
              </div>
            )}
          </div>
        )}

        {current.popup && (
          <div className={styles.popupWrap}>
            {current.popup.type === "state" && (
              <>
                <img
                  src={current.popup.src}
                  alt="상태창"
                  className={styles.popupImage}
                />

                {current.popup.obj && (
                  <img
                    src={current.popup.obj}
                    alt="상태창오브젝트"
                    className={styles.popupObjImage}
                  />
                )}

                {current.popup.text && (
                  <div className={styles.popupText}>
                    {current.popup.text}
                  </div>
                )}
              </>
            )}

            {current.popup.type === "inter" && (
              <div className={styles.popupWrap}>
                <div className={styles.circle}></div>

                {current.popup && (
                  <img src={current.popup.src} alt="인터랙션아이콘"
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
