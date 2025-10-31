import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/18-8_오두막집.svg";
import bg2 from "../assets/bg/19-8_오두막집거실.svg";
import char1 from "../assets/char/산데굴_주인공1.svg";
import char2 from "../assets/char/산데굴_주인공2.svg";
import char3 from "../assets/char/기본_주인공1.svg";
import char4 from "../assets/char/아줌마.svg";
import char5 from "../assets/char/아저씨.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import statebox from "../assets/obj/상태창.svg";
import food from "../assets/obj/음식.svg";
import styles from "./CabinIndoor.module.css"

export default function CabinIndoor() {
    const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const navigate = useNavigate();
  const NEXT_ROUTE = "/market"; // 다음 스토리 (오두막집앞)
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      text: "그나저나. 여긴 어디지?",
      choice: {
        src: choicebox,
        text: "주위를 둘러본다."
      }
    },
    {
      id: 2,
      char: char1,
      text: "누가 날 구해준 건가?"

    },
    {
      id: 3,
      char: char2,
      npc1: { src: char4, x: 1250 },
      speaker: nickname,
      text: "누구...세요?"
    },
    {
      id: 4,
      speaker: "아주머니",
      text: "우리 집사람이 산에 뭐 좀 캐러 갔다가,\n학생이 쓰러져 있는 걸 집에 데려온 거야."
    },
    {
      id: 5,
      speaker: "아주머니",
      text: "그나저나 학생은\n왜 거기 쓰러져 있었던 거야?"
    },
    {
      id: 6,
      speaker: nickname,
      text: "그게...\n산에서 내려오는 길에 발을 헛디뎌서...",
    },
    {
      id: 7,
      speaker: "아주머니",
      text: "거기 위험한 산인데 어쩌다 올라갔담.\n얼른 나와서 밥 먹어요. 먹어야 낫지."
    },
    {
      id: 8,
      speaker: nickname,
      text: "감사합니다..", // 문에 가면 다음 컷
    },
    {
      id: 9,
      char: "none",
      npc1: "none",
      bg: "#282828"
    },
    {
      id: 10,
      bg: bg2
    },
    {
      id: 11,
      popup: {
        type: "state",
        src: statebox,
        obj: food,
        text: "카레라이스\n호불호가 갈리지 않을 듯한 최상의 카레이다."
      }
    },
    {
      id: 12,
      char: char3,
      npc1: { src: char4, x: 1250 },
      text: "아주머니와 함께 카레라이스를 먹으니 어머니 생각이 나 눈물이 맺힌다."
    },
    {
      id: 13,
      speaker: "아주머니",
      text: "어머, 왜 울어요."
    },
    {
      id: 14,
      speaker: nickname,
      text: "어머니 생각이 나서요. 이렇게 보살펴 주셔서 정말 감사합니다."
    },
    {
      id: 15,
      speaker: "아주머니",
      text: "에이구... 울지 말고,\n이것도 좀 먹어봐요. 갓 캐온 나물이야."
    },
    {
      id: 16,
      text: "누군가 들어온다."
    },
    {
      id: 17,
      speaker: "아주머니",
      text: "여보, 왔어요? 이 학생 일어났어.", //할아버지 등장
      npc2: { src: char5, x: 1800 }
    },
    {
      id: 18,
      speaker: "아저씨",
      text: "그랬구만. 학생, 다리는 좀 괜찮나?"
    },
    {
      id: 19,
      speaker: nickname,
      text: "네.\n구해주셔서 정말 감사합니다..."
    },
    {
      id: 20,
      speaker: "아저씨",
      text: "밥 다 먹고 밖으로 나와 보게나."
    },
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
    npc1: storyCuts[0].npc1 ?? null,
    npc2: storyCuts[0].npc2 ?? null
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const [charX, setCharX] = useState(100); // 시작 x좌표(px) — 필요에 따라 조정
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
      npc1: cut.npc1 === "none" ? null : (cut.npc1 ?? lastVisual.npc1),
      npc2: cut.npc2 === "none" ? null : (cut.npc2 ?? lastVisual.npc2),
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char, npc1: merged.npc1, npc2: merged.npc2 });

    navigatedRef.current = false;

    if (cut.id === 3) {
      setCharX(280);
    }

    if (cut.id === 12) {
      setCharX(150);
    }
  }, [idx]);

  const handleNext = async () => {
    if (idx < storyCuts.length - 1) setIdx(idx + 1);
    else (
      navigate(NEXT_ROUTE)
    )
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
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

  // 특정 컷에서 문에 도달 시 다음 페이지로 이동
  useEffect(() => {
    if (current.id !== 8) return;
    const EDGE = maxX - 550;
    if (!navigatedRef.current && charX >= EDGE) {
      navigatedRef.current = true;
      handleNext();
    }
  }, [current.id, charX, maxX, navigate]);

  return (
    <div className={styles.viewport}>

      {current.bg.startsWith("#") // 배경
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경" className={styles.background} />
      }

      {/* 특정 장면에서 배경 dim */}
      {[1, 11].includes(current.id) && <div className={styles.bgDim} />}

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
            bottom: -270,
            left: `${charX}px`,
          }}
        />
      )}

      {/* NPC */}
      {current.npc1?.src && (
        <img
          src={current.npc1.src}
          alt="npc"
          className={styles.charNPC}
          style={{
            position: "absolute",
            bottom: -270,
            left: `${current.npc1.x}px`,
          }}
        />
      )}

      {current.npc2?.src && (
        <img
          src={current.npc2.src}
          alt="npc"
          className={styles.charNPC}
          style={{
            position: "absolute",
            bottom: -270,
            left: `${current.npc2.x}px`,
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
                  {current.id === 11
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
  );
}