import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/12-5_버스_도착.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import busDriver from "../assets/char/버스기사.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function BusChoice3() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 62,
      bg: bg,
      char: [
        { src: char1, left: "80.08%", top: 965, width: 400, height: 400 },
        { src: busDriver, left: "63.2%", top: 965, width: "15.63%", height: 400 }
      ],
      speaker: "player",
      text: "죄송합니다!!!",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "20px", top: "569px" }
    },
    {
      id: 63,
      bg: bg,
      char: [
        { src: char1, left: "80.08%", top: 965, width: 400, height: 400 },
        { src: busDriver, left: "63.2%", top: 965, width: "15.63%", height: 400 }
      ],
      speaker: "버스 기사",
      text: "에잇 저 놈!!! @##@$!@#",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "20px", top: "569px" }
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
      navigate("/mountain");
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
    if (Array.isArray(char)) {
      return char.map((c, i) => (
        <img
          key={i}
          src={c.src}
          alt="character"
          className={styles.character}
          style={{
            left: c.left,
            top: c.top,
            width: c.width,
            height: c.height,
          }}
        />
      ));
    }
    return <img src={char} alt="character" className={styles.character} />;
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
                  className={styles.dialogueBox}
                  style={current.dialogueStyle || {}}
                >
                  {current.speaker && (
                    <div
                      className={styles.speaker}
                      style={current.textColor ? { color: current.textColor } : {}}
                    >
                      {current.speaker}
                    </div>
                  )}
                  <div
                    className={styles.dialogueText}
                    style={{
                      ...(current.textColor ? { color: current.textColor } : {}),
                      ...(current.textStyle || {})
                    }}
                  >
                    {displayedText}
                  </div>
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
