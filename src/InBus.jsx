import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "./assets/bg/11-4_버스_출발.svg";
import bg2 from "./assets/bg/12-5_버스_도착.svg";
import bg3 from "./assets/bg/9-2_버스정류장.svg";
import char1 from "./assets/char/기본_주인공1.svg";
import busDriver from "./assets/char/버스기사.svg";
import textbox from "./assets/obj/text_box.svg";
import choicebox from "./assets/obj/선택지.svg";
import { postChoice } from "./lib/api";
import styles from "./Scene.module.css";

export default function InBus() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 44,
      bg: bg1,
      dim: "rgba(0, 0, 0, 0.4)",
      title: "버스 안"
    },
    {
      id: 45,
      bg: bg1,
      char: [
        { src: char1, left: 2050, top: 965, width: 400, height: 400 },
        { src: busDriver, left: "63.2%", top: 965, width: "15.63%", height: 400 }
      ],
      dim: "rgba(0, 0, 0, 0.4)",
      text: "버스에 올라탔다. 무얼 할까?",
      choice: {
        src: choicebox,
        text: "버스 요금함을 확인한다"
      },
      popup: { type: "text", src: textbox }
    },
    {
      id: 46,
      bg: bg1,
      char: [
        { src: char1, left: 2050, top: 965, width: 400, height: 400 },
        { src: busDriver, left: "63.2%", top: 965, width: "15.63%", height: 400 }
      ],
      speaker: "버스 기사",
      text: "하차 하실 때 요금을 내세요",
      popup: { type: "text", src: textbox }
    },
    {
      id: 47,
      bg: bg1,
      char: [
        { src: char1, left: 2050, top: 965, width: 400, height: 400 },
        { src: busDriver, left: "63.2%", top: 965, width: "15.63%", height: 400 }
      ],
      text: "이 동네는 하차 할 때 돈을 내는 것 같다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 48,
      bg: bg1,
      char: [
        { src: char1, left: 2050, top: 965, width: 400, height: 400 },
        { src: busDriver, left: "63.2%", top: 965, width: "15.63%", height: 400 }
      ],
      text: "이 동네는 하차 할 때 돈을 내는 것 같다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 49,
      bg: bg1,
      char: char1,
      text: "다시 지갑을 가방에 넣고 자리에 앉아 창 밖을 구경한다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 50,
      bg: "#000000",
      text: "잦은 이동에 피곤한 나머지 눈이 감긴다 . . .",
      popup: { type: "text", src: textbox }
    },
    {
      id: 51,
      bg: bg2,
      char: char1,
      text: "\" 이번 정류장은 산 입구입니다. \"",
      popup: { type: "text", src: textbox }
    },
    {
      id: 52,
      bg: bg2,
      char: char1,
      text: "어...? 언제 잠들었지? 이제 내릴 때가 되었다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 53,
      bg: bg2,
      char: char1,
      text: "가방에서 지갑을 꺼내려고 보니, 지갑을 넣어 둔 자리에는 아무 것도 없다.",
      popup: { type: "text", src: textbox }
    },
    {
      id: 54,
      bg: bg2,
      char: char1,
      dim: "rgba(0, 0, 0, 0.4)",
      text: "이제 내려야 하는데 어떡하지. 걱정에 휩싸인다.",
      choice: {
        src: choicebox,
        text: [
          "버스 기사에게 가서 사정을 이야기한다",
          "다른 사람들에게 도움을 청하러 간다",
          "버스에서 내리지 않고 그냥 버스를 타고 간다"
        ]
      },
      popup: { type: "text", src: textbox }
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

  const SCENE_ID = 44;

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
    if (current.choice && choiceIndex !== null) {
      try {
        await postChoice({
          sceneId: SCENE_ID,
          optionKey: choiceIndex + 1
        });
      } catch (error) {
        console.error("Failed to post choice:", error);
      }
    }

    if (idx >= storyCuts.length - 1) {
      navigate("/bus-choices");
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

        {Array.isArray(current.char) ? (
          current.char.map((ch, i) => (
            <img
              key={i}
              src={ch.src}
              alt={`캐릭터${i + 1}`}
              className={styles.character}
              style={{
                position: "absolute",
                width: typeof ch.width === 'string' ? ch.width : `${ch.width || 400}px`,
                height: `${ch.height || 400}px`,
                left: typeof ch.left === 'string' ? ch.left : `${ch.left}px`,
                top: `${ch.top}px`,
              }}
            />
          ))
        ) : current.char ? (
          <img
            src={current.char}
            alt="캐릭터"
            className={styles.character}
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              left: "635px",
              top: "965px",
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
              width: "400px",
              height: "400px",
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
