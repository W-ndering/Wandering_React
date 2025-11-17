import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/11-4_버스_출발.svg";
import bg2 from "../assets/bg/12-5_버스_도착.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char1_walk1 from "../assets/char/기본_주인공2.svg"; // 걷기 애니메이션
import char1_walk2 from "../assets/char/기본_주인공3.svg"; // 걷기 애니메이션
import busDriver from "../assets/char/버스기사.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import { postChoice } from "../lib/api";
import { useCharacterControl } from "../hooks/useCharacterControl";
import styles from "./Scene.module.css";

export default function InBus() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  // 통합 조작 시스템 (이동, 점프, 상호작용 모두 사용)
  const {
    keysRef,
    getVelocity,
    charY,
    jump,
    isInteractionKey
  } = useCharacterControl({
    enableMovement: true,
    enableJump: true,
    speed: 500,
    minX: 0,
    maxX: 2160,
    gravity: 1500,
    jumpVelocity: 600,
    groundLevel: 0,
  });
  const storyCuts = [
    {
      id: 0,
      bg:bg1,
      dim: "rgba(0, 0, 0, 0.4)",
      title: "버스 안"
    },
    {
      id: 1,
      bg:bg1,
      char: char1,
      text: "버스에 올라탔다. 무얼 할까?",
      choice: {
        src: choicebox,
        text: "요금을 낸다"
      }
    },
    {
      id: 2,
      bg:bg1,
      char: char1,
      npc: { src: busDriver, x: 1650 },
      speaker: "버스기사",
      text: "하차 하실 때 요금을 내세요.",
    },
    {
      id: 3,
      char: char1,
      npc: { src: busDriver, x: 1650 },
      text: "이 동네는\n하차할 때 요금을 내는 것 같다.",
    },
    {
      id: 4,
      char: char1,
      npc: "none",
      text: "다시 지갑을 가방에 넣고\n창 밖을 구경한다.",
    },
        {
      id: 5,
      bg:"#000000",
      char: "none",
      text: "잦은 이동에 피곤한 나머지\n눈이 감긴다.",
    },
        {
      id: 6,
      bg:bg2,
      char: char1,
      text: "\" 이번 정류장은\n산 입구입니다. \"",
    },
        {
      id: 7,
      char: char1,
      text: "어...? 언제 잠들었지?\n이제 내릴 때가 되었다.",
    },
        {
      id: 8,
      char: char1,
      text: "가방에서 지갑을 꺼내려고 보니,\n지갑을 넣어 둔 자리에는 아무 것도 없다.",
    },
        {
      id: 9,
      char: char1,
      text: "이제 내려야 하는데 어떡하지.\n걱정에 휩싸인다.",
    },
        {
      id: 10,
      char: char1,
      dim: "#00000066",
      text: "이제 내려야 하는데 어떡하지.\n걱정에 휩싸인다.",
            choice: {
        src: choicebox,
        text: [
          "기사님께 우물쭈물 상황을 설명한다.",
          "버스에 승차해 있는 사람에게 도움을 요청한다.",
          "기사님께 \"죄송합니다!\" 라고 외친 뒤 잽싸게 튄다."
        ]
      }
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

  const [charX, setCharX] = useState(100);
  const navigatedRef = useRef(false);

  // 걷기 애니메이션 상태
  const [walkFrame, setWalkFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const walkAnimTimerRef = useRef(null);

  const SCENE_ID = 2;

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
    if (current.id === 10 && choiceIndex !== null) {
      const optionKey = choiceIndex + 1;

      // postChoice helper already handles errors internally
      await postChoice({ sceneId: SCENE_ID, optionKey });

      if (choiceIndex === 0) {
        navigate("/bus-choice-1");
      } else if (choiceIndex === 1) {
        navigate("/bus-choice-2");
      } else {
        navigate("/bus-choice-3");
      }
      return;
    }

    if (idx >= storyCuts.length - 1) {
      navigate("/mountain");
      return;
    }

    setIdx(idx + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!isInteractionKey(e)) return;
      e.preventDefault();
      if ([10].includes(current.id)) return;

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
  }, [isTyping, current.id, current.text, isInteractionKey]);

  // 걷기 애니메이션 프레임 전환
  useEffect(() => {
    if (!isMoving) {
      if (walkAnimTimerRef.current) {
        clearInterval(walkAnimTimerRef.current);
        walkAnimTimerRef.current = null;
      }
      setWalkFrame(0);
      return;
    }

    walkAnimTimerRef.current = setInterval(() => {
      setWalkFrame(prev => (prev === 0 ? 1 : 0));
    }, 150);

    return () => {
      if (walkAnimTimerRef.current) {
        clearInterval(walkAnimTimerRef.current);
        walkAnimTimerRef.current = null;
      }
    };
  }, [isMoving]);

  // 키 입력 등록 (useCharacterControl의 keysRef 사용)
  useEffect(() => {
    const down = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        jump();
      }
    };
    const up = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [keysRef, jump]);

  // 이동 루프 (useCharacterControl의 getVelocity 사용)
  useEffect(() => {
    if (!current.char) return;

    const lastTimeRef = { current: performance.now() };
    let animationId;

    const animate = () => {
      const now = performance.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const velocity = getVelocity(deltaTime);
      if (velocity !== 0) {
        setIsMoving(true);
        setCharX(x => Math.max(0, Math.min(2160, x + velocity)));
      } else {
        setIsMoving(false);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [current.char, getVelocity]);

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
            src={
              isMoving
                ? (walkFrame === 0 ? char1_walk1 : char1_walk2)
                : current.char
            }
            alt="캐릭터"
            className={styles.character}
            style={{
              position: "absolute",
              bottom: `${65 - charY}px`,
              left: `${charX}px`,
            }}
          />
        )}

        {current.npc?.src && (
          <img
            src={current.npc.src}
            alt="npc"
            className={styles.charNPC}
            style={{
              position: "absolute",
              bottom: 65,
              left: `${current.npc.x ?? 1650}px`,
            }}
          />
        )}

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