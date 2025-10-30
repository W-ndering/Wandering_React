import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "./assets/bg/9-2_버스정류장.svg";
import char1 from "./assets/char/기본_주인공1.svg";
import npc1 from "./assets/char/Npc1.svg";
import npc2 from "./assets/char/Npc2.svg";
import npc4 from "./assets/char/Npc4.svg";
import busImg from "./assets/obj/버스.svg";
import textbox from "./assets/obj/text_box.svg";
import choicebox from "./assets/obj/선택지.svg";
import interactionIcon from "./assets/obj/interaction.svg";
import styles from "./Scene.module.css";

export default function BusStop() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 32,
      bg: bg1,
      dim: "rgba(0, 0, 0, 0.4)",
      title: "버스 정류장"
    },
    {
      id: 33,
      bg: bg1,
      char: char1,
      npc: [
        { src: npc1, left: 2302, top: 960 },
        { src: npc2, left: 1628, top: 960 },
        { src: npc4, left: 1974, top: 960 }
      ],
      text: "\" 0000번 버스\n8분 뒤 도착 \"",
      popup: { type: "text", src: textbox }
    },
    {
      id: 34,
      bg: bg1,
      char: char1,
      npc: [
        { src: npc1, left: 2302, top: 960 },
        { src: npc2, left: 1628, top: 960 },
        { src: npc4, left: 1974, top: 960 }
      ],
      text: "기다리기에 나쁘지 않은 시간이다.",
      popup: { type: "inter", src: interactionIcon }
    },
    {
      id: 35,
      bg: bg1,
      char: char1,
      obj: [{ src: busImg, left: 30, top: 812, width: 720, height: 720 }],
      text: "버스가 도착했다.",
      choice: {
        src: choicebox,
        text: "버스에 탑승한다"
      }
    },
    {
      id: 36,
      bg: bg1,
      char: char1,
      npc: [
        { src: npc1, left: 2302, top: 960 },
        { src: npc2, left: 1628, top: 960 },
        { src: npc4, left: 1974, top: 960 }
      ],
      dim: "rgba(0, 0, 0, 0.4)",
      text: "지나다니는 사람들을 보며\n이 동네는 어떤 곳일까 생각에 잠긴다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 37,
      bg: "#000000",
      text: "지나다니는 사람들을 보며\n이 동네는 어떤 곳일까 생각에 잠긴다.",
      popup: { type: "text", src: textbox }
    },
  ];
  const [current, setCurrent] = useState(storyCuts[0]);
  const [lastVisual, setLastVisual] = useState({
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
    npc: storyCuts[0].npc ?? null,
    obj: storyCuts[0].obj ?? null,
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
      char:
        cut.char === "none"
          ? null
          : (cut.char ?? lastVisual.char),
      npc: cut.npc === "none" ? null : (cut.npc ?? lastVisual.npc),
      obj: cut.obj === "none" ? null : (cut.obj ?? lastVisual.obj)
    };
    setCurrent(merged);
    setLastVisual({ bg: merged.bg, char: merged.char, npc: merged.npc, obj: merged.obj });

    navigatedRef.current = false;
  }, [idx]);

  const handleNext = async (choiceIndex = null) => {
    if (idx >= storyCuts.length - 1) {
      navigate("/bus-stop-memory");
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
              width: "400px",
              height: "400px",
              left: "734px",
              top: "960px",
            }}
          />
        )}

        {Array.isArray(current.npc) && current.npc.map((npc, i) => (
          <img
            key={i}
            src={npc.src}
            alt={`npc${i + 1}`}
            className={styles.charNPC}
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              left: `${npc.left}px`,
              top: `${npc.top}px`,
            }}
          />
        ))}

        {Array.isArray(current.obj) && current.obj.map((obj, i) => (
          <img
            key={i}
            src={obj.src}
            alt={`obj${i + 1}`}
            style={{
              position: "absolute",
              width: `${obj.width || 400}px`,
              height: `${obj.height || 400}px`,
              left: `${obj.left}px`,
              top: `${obj.top}px`,
            }}
          />
        ))}

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
