import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/bg/22-9_1번선택지.svg";
import charDance from "./assets/char/춤_주인공2.svg";
import npc1 from "./assets/char/마을축제_춤주는 행인1.svg";
import npc2 from "./assets/char/마을축제_춤추는 행인2.svg";
import npc3 from "./assets/char/마을축제_춤추는 행인3.svg";
import npc4 from "./assets/char/마을축제_춤추는 행인4.svg";
import npc5 from "./assets/char/마을축제_춤추는 행인5.svg";
import textbox from "./assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function MarketChoice1() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const storyCuts = [
    {
      id: 140,
      bg: bg,
      char: { src: charDance, left: 715, top: 990, width: 400, height: 400 },
      npc: [
        { src: npc1, left: 36, top: 990, width: 400, height: 400 },
        { src: npc5, left: 365, top: 990, width: 400, height: 400 },
        { src: npc3, left: 1180, top: 990, width: 400, height: 400 },
        { src: npc4, left: 1548, top: 990, width: 400, height: 400 },
        { src: npc2, left: 2000, top: 990, width: 400, height: 400 }
      ],
      text: "광장에서 마을 사람들이 춤을 추고 있다.\n다가가 함께 춤을 춘다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "1166px", left: "calc(50% - 1166px/2)", top: "44.17%" }
    },
    {
      id: 141,
      bg: bg,
      char: { src: charDance, left: 715, top: 990, width: 400, height: 400 },
      npc: [
        { src: npc1, left: 36, top: 990, width: 400, height: 400 },
        { src: npc5, left: 365, top: 990, width: 400, height: 400 },
        { src: npc3, left: 1180, top: 990, width: 400, height: 400 },
        { src: npc4, left: 1548, top: 990, width: 400, height: 400 },
        { src: npc2, left: 2000, top: 990, width: 400, height: 400 }
      ],
      text: "자고로 축제는 노래와 춤이 있어야 한다고\n생각하는 주의이다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "797px", left: "calc(50% - 797px/2 - 0.5px)", top: "41.25%" }
    },
    {
      id: 142,
      bg: bg,
      char: { src: charDance, left: 715, top: 990, width: 400, height: 400 },
      npc: [
        { src: npc1, left: 36, top: 990, width: 400, height: 400 },
        { src: npc5, left: 365, top: 990, width: 400, height: 400 },
        { src: npc3, left: 1180, top: 990, width: 400, height: 400 },
        { src: npc4, left: 1548, top: 990, width: 400, height: 400 },
        { src: npc2, left: 2000, top: 990, width: 400, height: 400 }
      ],
      text: "한참 노래를 부르며 춤을 춘다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "890px", left: "calc(50% - 890px/2)", top: "47.08%" }
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

  const navigatedRef = useRef(false);

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
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      // 마지막 씬에서 fade out & in 처리
      setIsFading(true);
      setTimeout(() => {
        navigate("/hut");
      }, 1000); // 1초 후 페이지 이동
      return;
    }

    setIdx(idx + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;

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
  }, [isTyping, current.text, idx]);

  const bgStyle = typeof current.bg === "string" && current.bg.startsWith("#")
    ? { backgroundColor: current.bg }
    : { backgroundImage: `url(${current.bg})` };

  const renderChar = (char) => {
    if (!char) return null;
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character}
        style={{
          left: char.left,
          top: char.top,
          width: char.width,
          height: char.height,
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
          left: n.left,
          top: n.top,
          width: n.width,
          height: n.height,
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
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
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
