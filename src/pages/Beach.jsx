import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/26-10_바다가는길.svg";
import bg2 from "../assets/bg/27-10_바닷가.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import bag from "../assets/obj/가방.svg";
import diary from "../assets/obj/다이어리.svg";
import styles from "./Beach.module.css";

export default function Beach() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      text: "축제를 즐겼던 시장을 지나\n해안가로 향한다."
    },
    {
      id: 2,
      text: "시간은 느즈막한 오후.\n슬슬 노을이 지고 있다."
    },
    {
      id: 3,
      bg: bg2,
      text: "무작정 해안선을 따라 걸었다."
    },
    {
      id: 4,
      text: "걷다 보니 문득 생각이 들었다.",
      dim: "#00000033"
    },
    {
      id: 5,
      text: "내가 뭘 찾고 있었지?",
      dim: "#00000066"
    },
    {
      id: 6,
      text: "귀찮게 하던\n알 수 없는 목소리도 들리지 않고,",
      dim: "#00000099"
    },
    {
      id: 7,
      text: "무언가를 찾으러\n떠났다는 것조차 잊고 있었다.",
      dim: "#000000CC"
    },
    {
      id: 8,
      text: "무얼 찾고 있었더라?",
      choice: {
        src: choicebox,
        text: "가방을 열어본다."
      },
      dim: "#000000CC"
    },
    {
      id: 9,
      popup: {
        type: "single",
        src: bag
      },
      dim: "#000000CC"
    },
    {
      id: 10,
      popup: {
        type: "single",
        src: diary
      },
      dim: "#000000CC"
    },
    {
      id: 11,
      speaker: nickname,
      text: "찾았다.",
      popup: {
        type: "single",
        src: diary
      },
      ddim: "#000000bb"
    },
    {
      id: 12,
      speaker: nickname,
      text: "찾았다.",
      popup: {
        type: "single",
        src: diary
      },
      choice: {
        src: choicebox,
        text: "다이어리를 넘겨본다."
      },
      ddim: "#000000cf"
    }
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const navigatedRef = useRef(false);

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
      bg: storyCuts[idx].bg ?? lastVisual.bg // bg 입력 없으면 이전 bg 유지
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg });

    navigatedRef.current = false;
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      navigate("/result");
      return;
    }

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);

    setIdx(idx + 1);
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;

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

      <div className={styles.stage}>
        {current.bg.startsWith("#") // 배경
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {current.dim && ( // 컷마다 dim 세기 다르게 (팝업 아래에 깔림)
          <div className={styles.bgDim} style={{ background: current.dim }} />
        )}

        {current.ddim && ( // 컷마다 dim 세기 다르게 (팝업 위로 깔림)
          <div className={styles.ddim} style={{ background: current.ddim }} />
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

        {current.popup && (
          <div className={styles.popupWrap}>
            {current.popup.type === "single" && ( // 팝업이 단독 아이템일 때
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