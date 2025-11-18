import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/25-10_오두막집앞.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char1_walk1 from "../assets/char/기본_주인공2.svg";
import char1_walk2 from "../assets/char/기본_주인공3.svg";
import char3 from "../assets/char/아저씨.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./CabinSunset.module.css";
import { useCharacterControl } from "../hooks/useCharacterControl";

export default function CabinSunset() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      char: char1,
      npc: { src: char3, x: 1845 }, // 아저씨
      speaker: nickname,
      text: "아저씨, 저 가 볼게요.\n축제 너무 재미있었어요."
    },
    {
      id: 2,
      speaker: "아저씨",
      text: "그래. 이젠 어디로 갈 생각인가?",
    },
    {
      id: 3,
      speaker: nickname,
      text: "마을 앞의 바다로 가 보려구요.",
    },
    {
      id: 4,
      speaker: "아저씨",
      text: "정말 아름다운 곳이지. 행운을 비네!",
    },
    {
      id: 5,
      speaker: nickname,
      text: "감사해요, 아저씨. 안녕히 계세요!\n(오른쪽으로 이동하자.)", // 주인공이 우측에 다다르면 다음컷으로 이동
    },
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

  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
    npc: storyCuts[0].npc ?? null,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const [charX, setCharX] = useState(680); // 시작 x좌표(px) — 필요에 따라 조정
  const navigatedRef = useRef(false);
  const SPEED = 500;
  const minX = 0;
  const maxX = 2160;
  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => { // 텍스트 타이핑 효과
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
      bg: cut.bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
      char:
        cut.char === "none" // 캐릭터 사용 안 하는 경우
          ? null
          : (cut.char ?? lastVisual.char), // char 입력 없으면 이전 char 유지
      npc: cut.npc === "none" ? null : (cut.npc ?? lastVisual.npc)
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char, npc: merged.npc });

    navigatedRef.current = false;

    if (cut.id === 10) {
      setCharX(1300);
    }
  }, [idx]);

  const handleNext = async () => {
    setIdx(idx + 1);
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (!isInteractionKey(e)) return;
      e.preventDefault();
      if ([5].includes(current.id)) return;

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

  // 마지막 컷에서 우측 끝 도달 시 다음 페이지로 이동
  useEffect(() => {
    if (current.id !== 5) return;
    const EDGE = maxX - 5;
    if (!navigatedRef.current && charX >= EDGE) {
      navigatedRef.current = true;
      navigate("/beach"); // 바닷가 스토리로 이동
    }
  }, [current.id, charX, maxX, navigate]);

  return (
    <div className={styles.viewport}>

      {current.bg.startsWith("#") // 배경
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경" className={styles.background} />
      }

      {/* 캐릭터 */}
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

      {/* NPC */}
      {current.npc?.src && (
        <img
          src={current.npc.src}
          alt="npc"
          className={styles.charNPC}
          style={{
            position: "absolute",
            bottom: 65,
            left: `${current.npc.x ?? 1400}px`,
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