import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg/19-8_오두막집거실.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char1_walk1 from "../assets/char/기본_주인공2.svg";
import char1_walk2 from "../assets/char/기본_주인공3.svg";
import lady from "../assets/char/아줌마.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Scene.module.css";
import { useCharacterControl } from "../hooks/useCharacterControl";

export default function Hut() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [charX, setCharX] = useState(1294); // 50.55% of 2560 = 1294
  const navigatedRef = useRef(false);

  const DOOR_X = 1700; // 문 위치
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const storyCuts = [
    {
      id: 152,
      bg: bg,
      char: char1,
      npc: { src: lady, x: 668 },
      text: "축제를 즐기고 다시 아주머니 댁으로\n돌아와 짐을 챙겼다.",
      popup: { type: "text", src: textbox },
      textStyle: { textAlign: "center", width: "827px" },
      movable: false
    },
    {
      id: 153,
      bg: bg,
      speaker: "아주머니",
      text: "벌써 가려구? 조금 더 쉬다 가지.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px" },
      movable: false
    },
    {
      id: 154,
      bg: bg,
      speaker: nickname,
      text: "괜찮아요. 덕분에 축제도 즐기고\n재미있었어요.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px" },
      movable: false
    },
    {
      id: 155,
      speaker: "아주머니",
      text: "그래요. 잠깐이지만 만나서 반가웠어요.\n앞으로의 길에 행운이 있길 바랄게요.",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px" },
      movable: false
    },
    {
      id: 156,
      bg: bg,
      speaker: nickname,
      text: "감사해요 아주머니. 가보겠습니다!\n(문으로 이동하자.)",
      popup: { type: "text", src: textbox },
      dialogueStyle: { gap: "8px" },
      movable: true // 마지막 씬에서 이동 가능
    }
  ];

  // 통합 조작 시스템
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

  // 걷기 애니메이션 상태
  const [walkFrame, setWalkFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const walkAnimTimerRef = useRef(null);
  const [facingLeft, setFacingLeft] = useState(false);

  const [current, setCurrent] = useState(storyCuts[0]);
  const [lastVisual, setLastVisual] = useState({
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
    npc: storyCuts[0].npc ?? null,
  });
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

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

    if (cut.movable) {
      setCharX(1294); // 원하는 시작 x 값
    }
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      return;
    }

    setIdx(idx + 1);
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    if (current.movable) return;

    const onKey = (e) => {
      if (!isInteractionKey(e)) return;
      e.preventDefault();
      if ([8].includes(current.id)) return;

      // 타이핑 중이면 타이머를 멈추고 즉시 완성
      if (isTyping && current.text) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setDisplayedText(current.text);
        setIsTyping(false);
        return;
      }
      // 그 외엔 다음 컷
      handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTyping, current.id, current.text]);

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
    if (!current.movable) return;

    const lastTimeRef = { current: performance.now() };
    let animationId;

    const animate = () => {
      const now = performance.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const velocity = getVelocity(deltaTime);
      if (velocity !== 0) {
        setIsMoving(true);
        setFacingLeft(velocity < 0); // 음수면 왼쪽으로 이동 중 => 좌우반전
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

  // 마지막 컷에서 문에 도달 시 navigate
  useEffect(() => {
    if (current.id !== 156) return;
    if (!navigatedRef.current && charX >= DOOR_X) {
      navigatedRef.current = true;
      navigate("/cabinsunset");
    }
  }, [current.id, charX, navigate, DOOR_X]);

  return (
    <div className={styles.viewport}>

      {typeof current.bg === "string" && current.bg.startsWith("#")
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경" className={styles.background} />
      }

      {current.char && (
        <img
          src={isMoving ? (walkFrame === 0 ? char1_walk1 : char1_walk2) : char1} // 이동 중일 때 0이면 char2이고 1이면 char3, 멈췄을 땐 char1(정면)
          alt="캐릭터"
          className={styles.character}
          style={{
            position: "absolute",
            bottom: 65 + charY,
            left: `${charX}px`,
            transform: facingLeft && isMoving ? "scaleX(-1)" : "none" // 좌우반전 이미지 사용 대신, 왼쪽으로 이동할 때 scaleX(-1)로 반전시킴
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
            left: `${current.npc.x}px`,
          }}
        />
      )}

      {current.text && (
        <div className={styles.textboxWrap}>
          <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

          {(() => {
            const hasLineBreak = current.text.includes("\n"); // 대사 줄바꿈 유무
            const isBigText = current.id === null;

            return (
              <div
                className={[
                  styles.textboxContent, // 텍스트 박스 안에 있는 텍스트 위치 분기
                  !current.speaker ? styles.centerText : "",           // 기본 (화자 X)
                  current.speaker && !hasLineBreak ? styles.noLineBreak : "",  // 화자 O, 대사 줄바꿈 X
                  current.speaker && (hasLineBreak || isBigText) ? styles.yesLineBreak : "" // 화자 O, 대사 줄바꿈 O (줄바꿈은 없지만 대사 크기가 큰 경우도 포함)
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

    </div>
  );
}