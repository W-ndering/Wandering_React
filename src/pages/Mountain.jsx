import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/13-5_산입구.svg";
import bg2 from "../assets/bg/14-5_산중턱.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char2 from "../assets/char/힘든_주인공2.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import intericon from "../assets/obj/interaction.svg";
import styles from "./Mountain.module.css";

export default function Mountain() {
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const nickname = sessionStorage.getItem('NICKNAME') || 'player';
  const playerid = sessionStorage.getItem("playerId") || "0";
  const [isTransitioning, setIsTransitioning] = useState(false); // 페이드 전환 상태
  const autoTransitionRef = useRef(null); // 자동 전환 타이머
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      char: "none",
      title: "산"
    },
    {
      id: 2,
      char: char1,
      speaker: nickname,
      text: "산이라... 산에서 뭘 해야 하지?"
    },
    {
      id: 3,
      text: "버스에서 내려 무작정 발걸음을 옮긴다."
    },
    {
      id: 4,
      popup: intericon
    },
    {
      id: 5,
      text: "산으로 향하는 계단이다.",
      choice: {
        src: choicebox,
        text: "계단을 오른다."
      }
    },
    {
      id: 6,
      bg: bg2,
      char: char2,
      text: "계단은 점점 흙길로 이어지고,\n오를수록 길은 험난해진다."
    },
    {
      id: 7,
      text: "계단은 점점 흙길로 이어지고,\n오를수록 길은 험난해진다.",
      choice: {
        src: choicebox,
        text: ["힘드니 내려간다.", "계속 올라간다."]
      }
    }
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const [charX, setCharX] = useState(2040); // 시작 x좌표(px) — 필요에 따라 조정

  const SCENE_ID = 5;

  // 선택 결과 서버에 전송
  async function postChoice({ sceneId, optionKey }) {
    try {
      const res = await fetch(`${BACKEND_KEY}/player/${playerid}/choice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneId, optionKey }),
      });

      if (res.ok) {
        console.log(`✅ 서버 전송 성공 : 선택한 선택지 번호: ${optionKey}`);
      } else {
        console.warn(`⚠️ 서버 응답 오류 (${res.status})`);
      }
    } catch (err) {
      console.error("❌ 서버 연결 실패:", err);
    }
  }

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
    const merged = {
      ...storyCuts[idx],
      bg: storyCuts[idx].bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
      char:
        storyCuts[idx].char === "none" // 캐릭터 사용 안 하는 경우
          ? null
          : storyCuts[idx].char ?? lastVisual.char, // char 입력 없으면 이전 char 유지
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char });

    if (current.id === 1) {
      if (autoTransitionRef.current) {
        clearTimeout(autoTransitionRef.current);
      }
      autoTransitionRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setIdx(1);
          setCurrent({ ...storyCuts[1], bg: storyCuts[1].bg ?? lastVisual.bg });
          setLastVisual({ bg: storyCuts[1].bg ?? lastVisual.bg });
        }, 800);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      }, 2200);
    }

    if (storyCuts[idx].id === 6) {
      setCharX(100);
    }
    if (storyCuts[idx].id === 7) {
      setCharX(1000);
    }

    return () => {
      if (autoTransitionRef.current) {
        clearTimeout(autoTransitionRef.current);
      }
    };
  }, [idx, isTransitioning]);

  // 선택에 따른 네비게이팅 포함한 handleNext
  const handleNext = async (choiceIndex = null) => {

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);

    if (choiceIndex !== null) {
      const optionKey = choiceIndex + 1;

      postChoice({ sceneId: SCENE_ID, optionKey });

      // 선택지 2개일 때 네비게이팅
      if (choiceIndex === 0) {
        navigate("/climbdown");
      } else {
        navigate("/traveler");
      }
      return;
    }

    setIdx(idx + 1); // 마지막 컷이 아니면 다음 컷으로 이동
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
      if ([1, 4, 7].includes(current.id)) return;

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

  return (
    <div className={styles.viewport}>

      {isTransitioning && current.id === 2 && (
        <div className={styles.fadeFromDark} />
      )}

      {current.bg.startsWith("#") // 배경
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경" className={styles.background} />
      }

      {/* 특정 장면에서 배경 dim */}
      {[1, 5, 7].includes(current.id) && <div className={styles.bgDim} />}

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

                {/* 화자와 대사 출력 */}
                {current.speaker && (
                  <div className={styles.speaker}>{current.speaker}</div>
                )}
                <div className={styles.content}>{displayedText}</div>
              </div>
            );
          })()}

        </div>
      )}


      {current.choice && ( // 선택지
        <div className={`${styles.choiceWrap} ${Array.isArray(current.choice.text)
          ? current.choice.text.length === 2
            ? styles.choiceWrapDouble // 선택지가 2개
            : styles.choiceWrapTriple // 선택지가 3개
          : styles.choiceWrapSingle // 선택지가 1개
          }`}>
          {Array.isArray(current.choice.text) ? ( // 선택지가 2개 or 3개
            <div className={styles.choiceList}>
              {current.choice.text.map((label, i) => (
                <div
                  key={i}
                  className={styles.choiceItem}
                  onClick={() => handleNext(i)}
                >
                  <img
                    src={choicebox}
                    alt="선택지박스"
                    className={styles.choiceImage}
                  />
                  <div className={styles.choiceText}>{label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div // 선택지가 1개
              className={styles.choiceItem}
              onClick={() => handleNext()}
            >
              <img
                src={choicebox}
                alt="선택지박스"
                className={styles.choiceImage}
              />
              <div className={styles.choiceText}>{current.choice.text}</div>
            </div>
          )}
        </div>
      )}

      {current.popup && ( // 팝업창(아이템)
        <div className={styles.popupWrap}>
          <div className={styles.circle}></div>

          {current.popup && (
            <img src={current.popup} alt="인터랙션아이콘"
              className={styles.popupInterImage}
              onClick={() => handleNext()}
            />
          )}
        </div>
      )}

    </div>
  );
}