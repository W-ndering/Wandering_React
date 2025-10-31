import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/25-10_오두막집앞.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char2 from "../assets/char/기본_주인공3.svg";
import char3 from "../assets/char/아저씨.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./CabinSunset.module.css";

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
      char: char2,
      speaker: nickname,
      text: "감사해요, 아저씨. 안녕히 계세요!", // 주인공이 우측에 다다르면 다음컷으로 이동
    },
  ];
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
  const keysRef = useRef({ left: false, right: false });
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

  const handleNext = async (choiceIndex = null) => {
    setIdx(idx + 1);
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
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

  // 키 입력 등록
  useEffect(() => {
    const down = (e) => {
      if (e.key === "ArrowLeft") {
        if (!keysRef.current.left) keysRef.current.left = true;
      }
      if (e.key === "ArrowRight") {
        if (!keysRef.current.right) keysRef.current.right = true;
      }
    };
    const up = (e) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // 이동 루프
  useEffect(() => {
    // 루프 시작 시 초기화
    lastTimeRef.current = null;
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }

    moveTimerRef.current = setInterval(() => {
      if (!current.char) return;

      const now = performance.now();
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now; // 첫 틱은 이동하지 않음 (초반 튐 방지)
        return;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const { left, right } = keysRef.current;
      const dir = (left ? -1 : 0) + (right ? 1 : 0);
      if (dir !== 0) {
        setCharX(x => Math.max(minX, Math.min(maxX, x + dir * SPEED * dt)));
      }
    }, 16);

    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
        moveTimerRef.current = null;
      }
    };
  }, [current.char, SPEED, minX, maxX]);


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

      <div className={styles.stage}>
        {current.bg.startsWith("#") // 배경
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 특정 장면에서 배경 dim */}
        {/* {[5, 8, 10].includes(current.id) && <div className={styles.bgDim} />} */}

        {current.title && ( // 새로운 스토리 도입 시 제목
          <div className={styles.titleText}>{current.title}</div>
        )}

        {/* 캐릭터 */}
        {current.char && (
          <img
            src={current.char}
            alt="캐릭터"
            className={styles.character}
            style={{
              position: "absolute",
              bottom: 65,
              left: `${charX}px`,
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

        {current.text && ( // 텍스트창
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            {(() => {
              const hasLineBreak = current.text.includes("\n"); // 텍스트 줄바꿈 유무

              return (
                <div
                  className={[
                    styles.textboxContent,
                    !current.speaker ? styles.centerText : "",           // 화자 없으면 가운데정렬
                    current.speaker && !hasLineBreak ? styles.upText : "",  // 화자 O, 줄바꿈 X
                    current.speaker && hasLineBreak ? styles.upTextMulti : "" // 화자 O, 줄바꿈 O
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



        {current.choice && ( // 선택지창
          <div className={`${styles.choiceWrap} ${Array.isArray(current.choice.text)
            ? styles.choiceWrap  // 선택지가 여러 개인 경우 (위치 조절)
            : styles.choiceWrapSingle // 하나인 경우
            }`}>
            {Array.isArray(current.choice.text) ? ( // 선택지가 여러 개인 경우
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
              <div // 하나인 경우
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
            {current.popup.type === "state" && ( // 팝업이 상태창일 때
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
                    {current.id === 5
                      ? current.popup.text.split("\n").map((line, i) => (
                        <div
                          key={i}
                          className={i === 1 ? styles.popupLineSmall : ""}
                        >
                          {line}
                        </div>
                      ))
                      : current.popup.text}
                  </div>
                )}
              </>
            )}

            {current.popup.type === "inter" && ( // 팝업이 인터랙션일 때
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
          </div>
        )}
      </div>
    </div>
  );
}