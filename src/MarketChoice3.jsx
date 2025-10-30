import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/bg/24-9_3번선택지.svg";
import char1 from "./assets/char/기본_주인공1.svg";
import charDraw from "./assets/char/그림_주인공.svg";
import npc6 from "./assets/char/Npc6.svg";
import npc7 from "./assets/char/Npc7_.svg";
import npc8 from "./assets/char/npc8.svg";
import textbox from "./assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function MarketChoice3() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const storyCuts = [
    {
      id: 146,
      bg: bg,
      char: { src: char1, left: "46.76%", top: 978, width: 400, height: 400 },
      npc: [
        { src: npc6, left: 478, top: 1138, width: 240, height: 240 },
        { src: npc8, left: 759, top: 1138, width: 240, height: 240 },
        { src: npc7, left: 957, top: 1138, width: 240, height: 240 }
      ],
      text: "아이들이 특이한 놀이를 하고 있길래\n다가가서 말을 걸어보았다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "1073px", left: "calc(50% - 1073px/2 + 0.5px)", top: "44.17%" }
    },
    {
      id: 147,
      bg: bg,
      char: { src: char1, left: "46.76%", top: 978, width: 400, height: 400 },
      npc: [
        { src: npc6, left: 478, top: 1138, width: 240, height: 240 },
        { src: npc8, left: 759, top: 1138, width: 240, height: 240 },
        { src: npc7, left: 957, top: 1138, width: 240, height: 240 }
      ],
      speaker: "player",
      text: "이건 어떻게 하는 거야?",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
    },
    {
      id: 148,
      bg: bg,
      char: { src: char1, left: "46.76%", top: 978, width: 400, height: 400 },
      npc: [
        { src: npc6, left: 478, top: 1138, width: 240, height: 240 },
        { src: npc8, left: 759, top: 1138, width: 240, height: 240 },
        { src: npc7, left: 957, top: 1138, width: 240, height: 240 }
      ],
      speaker: "player",
      text: "그렇구나. 혹시 내가 추천 해 주는 놀이\n한 번 해 볼래?",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
    },
    {
      id: 149,
      bg: bg,
      char: { src: charDraw, left: 1209, top: 1005, width: 400, height: 400 },
      npc: [
        { src: npc6, left: 478, top: 1138, width: 240, height: 240 },
        { src: npc8, left: 759, top: 1138, width: 240, height: 240 },
        { src: npc7, left: 957, top: 1138, width: 240, height: 240 }
      ],
      speaker: "player",
      text: "자 이렇게 모래에 네모를 그리고...\n1부터 10까지 쓰는 거야......",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
    },
    {
      id: 150,
      bg: bg,
      char: { src: char1, left: "46.76%", top: 978, width: 400, height: 400 },
      npc: [
        { src: npc6, left: 478, top: 1138, width: 240, height: 240 },
        { src: npc8, left: 759, top: 1138, width: 240, height: 240 },
        { src: npc7, left: 957, top: 1138, width: 240, height: 240 }
      ],
      speaker: "아이들",
      text: "이거는 이렇게 하면 이기는 거구,\n저렇게 하면 지는 거예요!",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
    },
    {
      id: 151,
      bg: bg,
      char: { src: char1, left: "46.76%", top: 978, width: 400, height: 400 },
      npc: [
        { src: npc6, left: 478, top: 1138, width: 240, height: 240 },
        { src: npc8, left: 759, top: 1138, width: 240, height: 240 },
        { src: npc7, left: 957, top: 1138, width: 240, height: 240 }
      ],
      speaker: "아이들",
      text: "네!!",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
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
                {current.speaker ? (
                  <div
                    className={styles.dialogueBox}
                    style={current.dialogueStyle || {}}
                  >
                    <div className={styles.speaker}>
                      {current.speaker}
                    </div>
                    <div className={styles.dialogueText}>
                      {displayedText}
                    </div>
                  </div>
                ) : (
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
                )}
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
