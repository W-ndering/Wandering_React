import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "./assets/bg/9-#2_버스정류장.svg?url";
import bg2 from "./assets/bg/10-#2_버스정류장_과거회상.svg?url";
// TODO: Add character imports once provided
// import char1 from "./assets/char/기본_주인공1.svg";
// import oldPlayer from "./assets/char/옛날_주인공.svg";
// import oldFather from "./assets/char/옛날_아버지.svg";
import textbox from "./assets/obj/text_box.svg";
import choicebox from "./assets/obj/선택지.svg";
import styles from "./Scene.module.css";

export default function BusStopMemory() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 38,
      bg: bg1, // 9-#2_버스정류장.svg
      text: "지나다니는 행인들을 보니\n아버지와의 추억이 떠오른다."
    },
    {
      id: 39,
      bg: bg2, // 10-#2_버스정류장_과거회상.svg
      speaker: "player",
      text: "아빠! 나 버스 타고 갈래!",
      // TODO: 옛날_주인공, 옛날_아버지 캐릭터 추가 필요
      // TODO: 텍스트 색상 흰색으로 변경 필요
    },
    {
      id: 40,
      text: "아버지는 잘 계시려나."
    },
    {
      id: 41,
      text: "출발 하기 전에 전화라도 드렸어야 했나."
    },
    {
      id: 42,
      text: "지난 몇 년간 집에서 오는 전화가\n부담스러워 거절하거나 틱틱대곤 했다."
    },
    {
      id: 43,
      bg: "#000000",
      text: ""
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
    if (idx >= storyCuts.length - 1) {
      navigate("/in-bus");
      return;
    }

    setIdx(idx + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;

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
