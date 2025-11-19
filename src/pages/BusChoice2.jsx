import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/12-5_버스_도착.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import busLady from "../assets/char/버스아줌마.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function BusChoice2() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 59,
      bg: bg,
      char: [
        { src: char1, left: "80.08%", top: 965, width: 400, height: 400 },
        { src: busLady, left: 1146, top: 995, width: 400, height: 400 }
      ],
      speaker: "player",
      text: "안녕하세요 아주머니.\n정말 죄송한데 버스비 좀 얻을 수 있을까요..?",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "20px" },
      textStyle: { fontSize: "52px" }
    },
    {
      id: 60,
      bg: bg,
      char: [
        { src: char1, left: "80.08%", top: 965, width: 400, height: 400 },
        { src: busLady, left: 1146, top: 995, width: 400, height: 400 }
      ],
      speaker: "아주머니",
      text: "에구, 잠들었길래 조마조마 했는데,\n결국 도둑맞았나 보네. 자. 여기요.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "20px" }
    },
    {
      id: 61,
      bg: bg,
      char: [
        { src: char1, left: "80.08%", top: 965, width: 400, height: 400 },
        { src: busLady, left: 1146, top: 995, width: 400, height: 400 }
      ],
      speaker: "player",
      text: "정말 감사합니다 아주머니!",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px" }
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
      if (e.key !== " ") return;
      e.preventDefault();
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
            position: "absolute",
            left: `${c.left}px`,
            top: `${c.top}px`,
            width: `${c.width}px`,
            height: `${c.height}px`,
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
          position: "absolute",
          left: `${n.left}px`,
          top: `${n.top}px`,
          width: `${n.width}px`,
          height: `${n.height}px`,
        }}
      />
    ));
  };

  return (
    <div className={styles.viewport}>
      <div className={styles.stage}>
        <div className={styles.background} style={bgStyle}>
          {current.dim && <div className={styles.bgDim} style={{ background: current.dim }} />}
          {current.title && <div className={styles.titleText}>{current.title}</div>}
          {renderChar(current.char)}
          {renderNpc(current.npc)}
        </div>

        {current.popup && current.popup.type === "text" && (
          <div className={styles.textboxWrap}>
            <img src={current.popup.src} alt="텍스트박스" className={styles.textboxImage} />
            <div
              className={[
                styles.textboxContent,
                !current.speaker ? styles.centerText : "",
                current.speaker ? styles.upText : ""
              ].join(" ").trim()}
              style={current.dialogueStyle || {}}
            >
              {current.speaker && (
                <div className={styles.speaker} style={current.textColor ? { color: current.textColor } : {}}>
                  {current.speaker}
                </div>
              )}
              <div className={styles.content} style={{
                ...(current.textColor ? { color: current.textColor } : {}),
                ...(current.textStyle || {})
              }}>
                {displayedText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
