import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/22-9_1번선택지.svg";
import charDance from "../assets/char/춤_주인공2.svg";
import npc1 from "../assets/char/마을축제_춤주는 행인1.svg";
import npc2 from "../assets/char/마을축제_춤추는 행인2.svg";
import npc3 from "../assets/char/마을축제_춤추는 행인3.svg";
import npc4 from "../assets/char/마을축제_춤추는 행인4.svg";
import npc5 from "../assets/char/마을축제_춤추는 행인5.svg";
import textbox from "../assets/obj/text_box.svg";
import { useCharacterControl } from "../hooks/useCharacterControl";
import styles from "./Scene.module.css";

export default function MarketChoice1() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // 통합 조작 시스템 (상호작용 키만 사용)
  const { isInteractionKey } = useCharacterControl({
    enableMovement: false,
    enableJump: false,
  });
  const storyCuts = [
    {
      id: 140,
      bg: bg,
      char: { src: charDance, left: 715, top: 990, width: 400, height: 400 },
      npc: [
        { src: npc1, left: 36, top: 990, width: 400, height: 400 },
        { src: npc5, left: 365, top: 990, width: 400, height: 400 },
        { src: npc3, left: 1180, top: 990, width: 400, height: 400 },
        { src: npc4, left: 1548, top: 990, width: 400, height: 400 },
        { src: npc2, left: 2000, top: 990, width: 400, height: 400 }
      ],
      text: "광장에서 마을 사람들이 춤을 추고 있다.\n다가가 함께 춤을 춘다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "1166px"}
    },
    {
      id: 141,
      bg: bg,
      char: { src: charDance, left: 715, top: 990, width: 400, height: 400 },
      npc: [
        { src: npc1, left: 36, top: 990, width: 400, height: 400 },
        { src: npc5, left: 365, top: 990, width: 400, height: 400 },
        { src: npc3, left: 1180, top: 990, width: 400, height: 400 },
        { src: npc4, left: 1548, top: 990, width: 400, height: 400 },
        { src: npc2, left: 2000, top: 990, width: 400, height: 400 }
      ],
      text: "자고로 축제는 노래와 춤이 있어야 한다고\n생각하는 주의이다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "797px" }
    },
    {
      id: 142,
      bg: bg,
      char: { src: charDance, left: 715, top: 990, width: 400, height: 400 },
      npc: [
        { src: npc1, left: 36, top: 990, width: 400, height: 400 },
        { src: npc5, left: 365, top: 990, width: 400, height: 400 },
        { src: npc3, left: 1180, top: 990, width: 400, height: 400 },
        { src: npc4, left: 1548, top: 990, width: 400, height: 400 },
        { src: npc2, left: 2000, top: 990, width: 400, height: 400 }
      ],
      text: "한참 노래를 부르며 춤을 춘다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "890px"}
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

  const bgStyle = typeof current.bg === "string" && current.bg.startsWith("#")
    ? { backgroundColor: current.bg }
    // ❗️ 수정 1: 배경 스타일 적용 방식을 'backgroundImage'에서 'img' 태그로 변경합니다.
    // CSS 파일과 일치시키기 위해 'bgStyle' 변수 사용을 제거합니다.
    : { /* 'bgStyle' 변수는 더 이상 사용하지 않습니다. */ };

  const renderChar = (char) => {
    if (!char) return null;
    // 이 컴포넌트의 'char' 데이터는 객체이므로, 객체 접근 방식(char.src)을 유지합니다.
    return (
      <img
        src={char.src}
        alt="character"
        className={styles.character}
        style={{
          position: "absolute",
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
        // ❗️ 수정 2: 'styles.npc' -> 'styles.charNPC'
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

  // 'renderObjects'는 이 파일에서 사용되지 않지만,
  // 향후 호환성을 위해 남겨둘 수 있습니다. (InBus.jsx 기반)
  const renderObjects = (objects) => {
    if (!objects) return null;
    return objects.map((obj, i) => (
      <img
        key={i}
        src={obj.src}
        alt="object"
        className={styles.object} // .object 클래스가 CSS에 정의되어 있어야 함
        style={{
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
        }}
      />
    ));
  };

  // ❗️ 수정 3: 'InBus.jsx'와 동일한 렌더링 구조로 변경
  return (
    <div className={styles.viewport}>
      {/* 🚨 참고: 'isFading' 관련 로직은 유지했으나,
        'styles.fadeOverlay'와 'styles.fadeOut' 클래스는
        제공해주신 'Scene.module.css' 파일에 없습니다.
        애니메이션이 작동하려면 이 클래스들을 CSS에 추가해야 합니다.
      */}
      {isFading && <div className={`${styles.fadeOverlay} ${styles.fadeOut}`} />}

      <div className={styles.stage}>
        {/* 1. 배경 (z-index: 0) */}
        {typeof current.bg === "string" && current.bg.startsWith("#")
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 2. 딤 (z-index: 4) */}
        {current.dim && (
          // 'styles.dim'이 아닌 'styles.bgDim' 사용
          <div className={styles.bgDim} style={{ background: current.dim }} />
        )}

        {/* 3. 타이틀 (z-index: 2) */}
        {current.title && (
          // 'styles.title'이 아닌 'styles.titleText' 사용
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
              
              // 이 파일은 스피커가 없으므로 'centerText'가 적용됩니다.
              const contentClasses = [
                styles.textboxContent,
                !current.speaker ? styles.centerText : "",
                current.speaker && !hasLineBreak ? styles.upText : "",
                current.speaker && hasLineBreak ? styles.upTextMulti : ""
              ].join(" ").trim();
              
              // 'Market.jsx'처럼 커스텀 스타일(textStyle)을 적용합니다.
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
        {/* 'InBus.jsx'의 선택지 로직이 여기에 올 수 있습니다. */}

        {/* 7. 팝업 (이 파일에는 없음) */}
        {/* 'InBus.jsx'의 팝업 로직 (state, inter, single)이 여기에 올 수 있습니다. */}
        {current.popup && current.popup.type !== "text" && (
          <div className={styles.popupWrap}>
            {/* ... (InBus.jsx의 팝업 렌더링 로직) ... */}
          </div>
        )}
      </div>
    </div>
  );
}