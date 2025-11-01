import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/21-9_시장입구.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import oldMan from "../assets/char/아저씨.svg";
import textbox from "../assets/obj/text_box.svg";
// ❗️ 수정 1: 'choicebox' 이미지를 import 해야 합니다.
import choicebox from "../assets/obj/선택지.svg"; 
import { postChoice } from "../lib/api";
import styles from "./Scene.module.css";

export default function Market() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
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
      dialogueStyle: { gap: "8px" }
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
      textStyle: { textAlign: "center", width: "460px", left: "calc(50% - 460px/2)" }
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
      textStyle: { textAlign: "center", width: "920px"}
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
      textStyle: { textAlign: "center", width: "1012px"}
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
      dialogueStyle: { gap: "8px" }
    },
    {
      id: 137,
      bg: bg,
      speaker: nickname,
      text: "네! 다녀오세요.",
      char: [
        { src: char1, left: "28.32%", top: 978, width: 400, height: 400 }
      ]
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
    await postChoice({ sceneId: 5, optionKey: choiceIndex + 1 });

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
      if (e.key !== " ") return;
      e.preventDefault();
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
            position: "absolute", // 'position'을 명시해주는 것이 좋습니다.
            left: c.left,
            top: c.top,
            width: c.width,
            height: c.height,
          }}
        />
      ));
    }
    // 배열이 아닌 단일 캐릭터일 경우 (InBus.jsx 호환)
    return <img src={char} alt="character" className={styles.character} />;
  };

  const renderNpc = (npc) => {
    if (!npc) return null;
    return npc.map((n, i) => (
      <img
        key={i}
        src={n.src}
        alt="npc"
        // ❗️ 수정 2: 'styles.npc'가 아닌 'styles.charNPC'를 사용해야 합니다.
        className={styles.charNPC}
        style={{
          position: "absolute",
          left: n.left,
          top: n.top,
          width: n.width,
          height: n.height,
        }}
      />
    ));
  };

  // ❗️ 수정 3: 'InBus.jsx'와 동일한 렌더링 구조로 변경합니다.
  return (
    <div className={styles.viewport}>
      <div className={styles.stage}>
        {/* 1. 배경 (먼저 렌더링, z-index: 0) */}
        {typeof current.bg === "string" && current.bg.startsWith("#")
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 2. 딤 (z-index: 4) */}
        {current.dim && (
          <div className={styles.bgDim} style={{ background: current.dim }} />
        )}

        {/* 3. 타이틀 (z-index: 2) */}
        {current.title && (
          <div className={styles.titleText}>{current.title}</div>
        )}

        {/* 4. 캐릭터 및 NPC (z-index: 2, 3) */}
        {renderChar(current.char)}
        {renderNpc(current.npc)}
        {/* 참고: 'objects' 데이터가 없으므로 renderObjects는 호출되지 않습니다. */}

        {/* 5. 텍스트 박스 (z-index: 6) */}
        {/* 'current.text'가 있을 때 'InBus.jsx'의 텍스트박스 로직을 그대로 사용합니다. */}
        {current.text && (
          <div className={styles.textboxWrap}>
            {/* 'current.popup.src' (Market.jsx) 대신 'textbox' (InBus.jsx)를 사용합니다. 
              데이터 구조를 통일하는 것이 가장 좋지만, 일단은 import한 'textbox'를 사용합니다.
            */}
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            {(() => {
              const hasLineBreak = current.text.includes("\n");
              
              // 'Market.jsx'의 커스텀 스타일(textStyle, dialogueStyle)을 적용할 수 있도록
              // 'InBus.jsx'의 클래스 로직과 style을 병합합니다.
              const contentClasses = [
                styles.textboxContent,
                !current.speaker ? styles.centerText : "",
                current.speaker && !hasLineBreak ? styles.upText : "",
                current.speaker && hasLineBreak ? styles.upTextMulti : ""
              ].join(" ").trim();
              
              // 'Market.jsx'의 데이터에 있는 커스텀 스타일을 적용합니다.
              const customStyle = current.speaker 
                ? (current.dialogueStyle || {}) 
                : (current.textStyle || {});

              return (
                <div className={contentClasses} style={customStyle}>
                  {current.speaker && (
                    <div className={styles.speaker}>{current.speaker}</div>
                  )}
                  <div className={styles.content}>{displayedText}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. 선택지 (z-index: 5) */}
        {/* 'InBus.jsx'의 선택지 로직을 사용합니다. */}
        {current.choices && (
          <div className={styles.choiceWrap}>
            <div className={styles.choiceList}>
              {current.choices.map((choice, i) => (
                <div
                  key={i}
                  className={styles.choiceItem}
                  onClick={() => handleChoice(i)}
                  // 참고: 'Market.jsx' 데이터의 left/top 값은
                  // CSS(.choiceList)가 flex-direction: column으로 되어있어 무시됩니다.
                  // CSS와 동일하게 중앙 정렬된 세로 목록으로 표시됩니다.
                >
                  <img
                    src={choicebox} // import한 'choicebox' 사용
                    alt={`선택지박스 ${i + 1}`}
                    className={styles.choiceImage}
                  />
                  <div className={styles.choiceText}>{choice.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. 팝업 (InBus.jsx의 로직)
          'Market.jsx'의 현재 데이터에는 "text" 타입 팝업만 있으나,
          "text"는 5번에서 'textboxWrap'으로 처리했습니다.
          따라서 이 부분은 'InBus.jsx'처럼 다른 팝업(state, inter, single)을 
          위한 로직이며, 'Market.jsx'의 텍스트 표시에 영향을 주지 않습니다.
        */}
        {current.popup && current.popup.type !== "text" && (
          <div className={styles.popupWrap}>
            {current.popup.type === "state" && (
              <>
                <img
                  src={current.popup.src}
                  alt="상태창"
                  className={styles.popupImage} // .popupImage는 CSS에 없습니다.
                />
                {/* ... (InBus.jsx의 나머지 팝업 로직) ... */}
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