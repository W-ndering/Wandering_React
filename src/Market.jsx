import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/bg/21-9_시장입구.svg";
import char1 from "./assets/char/기본_주인공1.svg";
import oldMan from "./assets/char/아저씨.svg";
import textbox from "./assets/obj/text_box.svg";
import { postChoice } from "./lib/api";
import styles from "./Scene.module.css";

export default function Market() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 132,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 },
        { src: oldMan, left: 1800, top: 978, width: 400, height: 400 }
      ],
      speaker: "아저씨",
      text: "우리 마을 축제가 있어서 데리고 나왔네.\n온 김에 좀 즐기다 가게나.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
    },
    {
      id: 133,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 },
        { src: oldMan, left: 1800, top: 978, width: 400, height: 400 }
      ],
      text: "해안 주변 마을.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "460px", left: "calc(50% - 460px/2)", top: "47.08%" }
    },
    {
      id: 134,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 },
        { src: oldMan, left: 1800, top: 978, width: 400, height: 400 }
      ],
      text: "등불이 켜지고 사람들은 음악과 춤으로 가득한 축제를 즐기고 있다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "920px", left: "calc(50% - 920px/2)", top: "41.25%" }
    },
    {
      id: 135,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 },
        { src: oldMan, left: 1800, top: 978, width: 400, height: 400 }
      ],
      text: "바닷 바람에 생선과 향신료 냄새가 섞여 퍼진다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "1012px", left: "calc(50% - 1012px/2)", top: "44.17%" }
    },
    {
      id: 136,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 },
        { src: oldMan, left: 1800, top: 978, width: 400, height: 400 }
      ],
      speaker: "아저씨",
      text: "나는 저기 생선 좀 사러 갈 테니,\n축제 좀 즐기고 있게나",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px", top: "569px" }
    },
    {
      id: 137,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 }
      ]
    },
    {
      id: 138,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 }
      ],
      dim: "rgba(0, 0, 0, 0.4)",
      text: "뭘 할까?",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "245px", left: "calc(50% - 245px/2 + 0.5px)", top: "47.08%" }
    },
    {
      id: 139,
      bg: bg,
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 }
      ],
      dim: "rgba(0, 0, 0, 0.4)",
      text: "뭘 할까?",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "245px", left: "calc(50% - 245px/2 + 0.5px)", top: "47.08%" },
      choices: [
        { text: "광장에서 춤추기", left: 668, top: 647 },
        { text: "마을 축제 둘러보기", left: 668, top: 895 },
        { text: "푸드 트럭에서 간식 먹기", left: 668, top: 1143 }
      ]
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

  const handleChoice = async (choiceIndex) => {
    // API call for choice tracking
    await postChoice({ sceneId: 139, optionKey: choiceIndex + 1 });

    if (choiceIndex === 0) {
      navigate("/market-choice-1");
    } else if (choiceIndex === 1) {
      navigate("/market-choice-2");
    } else {
      navigate("/market-choice-3");
    }
  };

  const handleNext = async () => {
    if (current.choices) {
      return; // Wait for user to click a choice
    }

    if (idx >= storyCuts.length - 1) {
      return;
    }

    setIdx(idx + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      if (current.choices) return; // Don't proceed if choices are shown

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
  }, [isTyping, current.text, current.choices, idx]);

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

        {current.choices && (
          <div className={styles.choicesContainer}>
            {current.choices.map((choice, i) => (
              <div
                key={i}
                className={styles.choiceButton}
                style={{
                  position: "absolute",
                  left: choice.left,
                  top: choice.top,
                  width: "1225px",
                  height: "228px",
                  cursor: "pointer"
                }}
                onClick={() => handleChoice(i)}
              >
                <img src={choicebox} alt="선택지" className={styles.choiceboxImage} />
                <div className={styles.choiceText}>{choice.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
