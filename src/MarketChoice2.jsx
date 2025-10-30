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
      textStyle: { textAlign: "center", width: "858px", left: "calc(50% - 858px/2)", top: "44.17%" }
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
      textStyle: { textAlign: "center", width: "828px", left: "calc(50% - 828px/2)", top: "41.25%" }
    },
    {
      id: 145,
      bg: bg,
      char: { src: char3, left: "23.4%", top: 978, width: 400, height: 400 },
      text: "더할 나위 없이 덩달아 흥겨워지는 풍경이다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "827px", left: "calc(50% - 827px/2 + 0.5px)", top: "44.58%" }
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
      navigate("/hut");
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
