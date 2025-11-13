import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import bg1 from "./assets/bg/9-2_버스정류장.svg";
import bg2 from "../assets/bg/10-2_버스정류장_과거회상.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import oldPlayer from "../assets/char/옛날_주인공.svg";
import oldFather from "../assets/char/옛날_아버지.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Scene.module.css";

export default function BusStopMemory() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const storyCuts = [
    {
      id: 38,
      bg: bg2,
      text: "지나다니는 행인들을 보니\n아버지와의 추억이 떠오른다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "827px", left: "calc(50% - 827px/2 + 0.5px)", top: "44.17%", fontSize: "60px", letterSpacing: "0.02em" }
    },
    {
      id: 39,
      bg: bg2,
      speaker: nickname,
      text: "아빠! 나 버스 타고 갈래!",
      char: [
        { src: oldPlayer, left: 522, top: 1121, width: 240, height: 240 },
        { src: oldFather, left: 692, top: 961, width: 400, height: 400 }
      ],
      textColor: "#FFFFFF",
      fadeIn: true,
      popup: { type: "text", src: textbox }
    },
    {
      id: 40,
      bg: bg2,
      char: char1,
      text: "아버지는 잘 계시려나.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 41,
      bg: bg2,
      char: char1,
      text: "출발 하기 전에 전화라도 드렸어야 했나.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 42,
      bg: bg2,
      char: char1,
      text: "지난 몇 년간 집에서 오는 전화가\n부담스러워 거절하거나 틱틱대곤 했다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 43,
      bg: bg2,
      char: char1,
      text: "...",
      popup: { type: "text", src: textbox }
    },
    {
      id: 44,
      bg: bg1,
      char: char1,
      obj: [{ src: busImg, left: 30, top: 812, width: 720, height: 720 }],
      text: "버스가 도착했다.",
      choice: {
        src: choicebox,
        text: "버스에 탑승한다"
      }
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
    if (e.key !== " ") return;
    e.preventDefault();

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

        {Array.isArray(current.char) ? (
          current.char.map((ch, i) => (
            <img
              key={i}
              src={ch.src}
              alt={`캐릭터${i + 1}`}
              className={`${styles.character} ${current.fadeIn ? styles.fadeIn : ''}`}
              style={{
                position: "absolute",
                width: `${ch.width || 400}px`,
                height: `${ch.height || 400}px`,
                left: `${ch.left}px`,
                top: `${ch.top}px`,
              }}
            />
          ))
        ) : current.char ? (
          <img
            src={current.char}
            alt="캐릭터"
            className={`${styles.character} ${current.fadeIn ? styles.fadeIn : ''}`}
            style={{
              position: "absolute",
              left: "734px",
              top: "960px",
            }}
          />
        ) : null}

        {Array.isArray(current.npc) && current.npc.map((npc, i) => (
          <img
            key={i}
            src={npc.src}
            alt={`npc${i + 1}`}
            className={styles.charNPC}
            style={{
              position: "absolute",
              left: `${npc.left}px`,
              top: `${npc.top}px`,
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
                  style={{ color: current.textColor || "#000000" }}
                >
                  {current.speaker && (
                    <div className={styles.speaker} style={{ color: current.textColor || "#FFFFFF" }}>{current.speaker}</div>
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