import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/24-9_3번선택지.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import charDraw from "../assets/char/그림_주인공.svg";
import npc6 from "../assets/char/Npc6.svg";
import npc7 from "../assets/char/Npc7_.svg";
import npc8 from "../assets/char/npc8.svg";
import textbox from "../assets/obj/text_box.svg";
import { useCharacterControl } from "../hooks/useCharacterControl";
import styles from "./Scene.module.css";

export default function MarketChoice3() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const nickname = sessionStorage.getItem('NICKNAME') || '나';

  // 통합 조작 시스템 (상호작용 키만 사용)
  const { isInteractionKey } = useCharacterControl({
    enableMovement: false,
    enableJump: false,
  });
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
      textStyle: { textAlign: "center", width: "1073px"}
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
      speaker: nickname,
      text: "이건 어떻게 하는 거야?",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"}
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
      speaker: nickname,
      text: "그렇구나. 혹시 내가 추천 해 주는 놀이\n한 번 해 볼래?",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"}
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
      speaker: nickname,
      text: "자 이렇게 모래에 네모를 그리고...\n1부터 10까지 쓰는 거야......",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px"}
    },
    // ❗️ 수정 1: id 150, 151이 중복되어 있어 150 -> 150_A, 151 -> 150_B로 가정하고 수정.
    // 원본 데이터의 150, 151이 순서대로 나와야 한다면 id를 150, 151로 유지해도 됩니다.
    // 여기서는 150, 151을 149 다음 컷으로 간주하고 id를 수정했습니다.
    // (원본 코드의 150, 151이 148과 149 사이에 들어가야 한다면 순서를 변경해야 합니다.)
    // *원본 코드의 순서를 그대로 따르겠습니다. (149 -> 150 -> 151)*
    {
      id: 150, // 원본 ID 유지
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
      dialogueStyle: { gap: "8px"}
    },
    {
      id: 151, // 원본 ID 유지
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
      dialogueStyle: { gap: "8px" }
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
      if (!isInteractionKey(e)) return;
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
  }, [isTyping, current.text, idx, isInteractionKey]);

  const renderChar = (char) => {
    if (!char) return null;
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character}
        style={{
          position: "absolute",
          left: typeof char.left === "string" ? char.left : `${char.left}px`,
          top: typeof char.top === "string" ? char.top : `${char.top}px`,
          width: typeof char.width === "string" ? char.width : `${char.width}px`,
          height: typeof char.height === "string" ? char.height : `${char.height}px`,
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
        // ❗️ 수정 2: 'styles.npc' -> 'styles.charNPC'
        className={styles.charNPC}
        style={{
          position: "absolute",
          left: typeof n.left === "string" ? n.left : `${n.left}px`,
          top: typeof n.top === "string" ? n.top : `${n.top}px`,
          width: typeof n.width === "string" ? n.width : `${n.width}px`,
          height: typeof n.height === "string" ? n.height : `${n.height}px`,
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
        className={styles.object} // .object 클래스가 CSS에 정의되어 있어야 함
        style={{
          position: "absolute",
          left: typeof obj.left === "string" ? obj.left : `${obj.left}px`,
          top: typeof obj.top === "string" ? obj.top : `${obj.top}px`,
          width: typeof obj.width === "string" ? obj.width : `${obj.width}px`,
          height: typeof obj.height === "string" ? obj.height : `${obj.height}px`,
        }}
      />
    ));
  };

  // ❗️ 수정 3: 'InBus.jsx'와 동일한 렌더링 구조로 변경
  return (
    <div className={styles.viewport}>
      {/* 🚨 참고: 'styles.fadeOverlay'와 'styles.fadeOut' CSS 클래스 필요 */}
      {isFading && <div className={`${styles.fadeOverlay} ${styles.fadeOut}`} />}
      
      <div className={styles.stage}>
        {/* 1. 배경 (z-index: 0) */}
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
        {renderObjects(current.objects)}

        {/* 5. 텍스트 박스 (z-index: 6) */}
        {current.text && (
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            {(() => {
              const hasLineBreak = current.text.includes("\n");
              
              // 이 파일은 'speaker'가 있으므로 'InBus.jsx'의 전체 로직을 사용합니다.
              const contentClasses = [
                styles.textboxContent,
                !current.speaker ? styles.centerText : "",
                current.speaker && !hasLineBreak ? styles.upText : "",
                current.speaker && hasLineBreak ? styles.upTextMulti : ""
              ].join(" ").trim();
              
              // 'Market.jsx'처럼 커스텀 스타일(textStyle, dialogueStyle)을 적용합니다.
              const customStyle = current.speaker 
                ? (current.dialogueStyle || {}) 
                : (current.textStyle || {});

              return (
                <div className={contentClasses} style={customStyle}>
                  {current.speaker && (
                    <div className={styles.speaker}>{current.speaker}</div>
                  )}
                  {/* 'styles.dialogueText'가 아닌 'styles.content' 사용 */}
                  <div className={styles.content}>{displayedText}</div>
                </div>
              );
            })()}
          </div>
        )}
        
        {/* 6. 선택지 (이 파일에는 없음) */}

        {/* 7. 팝업 (이 파일에는 없음) */}
        {current.popup && current.popup.type !== "text" && (
          <div className={styles.popupWrap}>
            {/* ... (InBus.jsx의 팝업 렌더링 로직) ... */}
          </div>
        )}
      </div>
    </div>
  );
}