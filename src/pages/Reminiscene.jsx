import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import textbox from "../assets/obj/text_box.svg";
import styles from'./Reminiscene.module.css';

export default function Reminiscene() {
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
      bg: "#000000",
      char: "none",
      text: "스르륵 눈이 감긴다."
    },
    {
      id: 2,
      char: "none",
      text: "..."
    },
    {
      id: 3,
      char: "none",
      text: "으음.. 맛있는 냄새 ..."
    },
    {
      id: 4,
      char: "none",
      text: "맛있는 냄새?"
    },
    {
      id: 5,
      char: "none",
      text: "난 방금 전까지 산에 조난되어\n곧 죽을 위기에 처해 있지 않았나?"
    },
    {
      id: 6,
      char: "none",
      text: "내가 천국에 온 건가?"
    },
    {
      id: 7,
      char: "none",
      speaker: "어머니",
      text: "아들! 얼른 일어나서 밥 먹어.\n학교 가야지!"
    },
    {
      id: 8,
      speaker: nickname,
      text: "아 안먹는다고 했잖아!!",
    },
    {
      id: 9,
      char: "none",
      text: "혼자 밥을 먹으며 외로이 보냈던 터라,\n어머니가 해 주는 밥이\n무의식중에 그리웠던 것 같다."
    },
    {
      id: 10,
      text: "어머니...\n며칠 전에 다리가 아프다고 하셨었는데.\n괜찮으시려나?"
    },
    {
      id: 11,
      text: "돌아가면 찾아 뵈어야 겠다는 생각이 든다."
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

  const SCENE_ID = 1;

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

    //if (storyCuts[idx].id === 2) {
    //  setCharX(500);
    //}
    //if (storyCuts[idx].id === 1) {
    //  setCharX(100);
    //}

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
      // 💡 ID 9 (선택지 컷)에서 클릭 시 다음 컷(ID 10)으로 바로 진행
      //if (current.id === 9) {
        // 서버 통신 및 네비게이션 없이 바로 다음 컷으로 진행 (idx 8 -> idx 9)
        //setIdx(idx + 1);
        //return;
      //}
      const optionKey = choiceIndex + 1;

      postChoice({ sceneId: SCENE_ID, optionKey });

      // 선택지 2개일 때 네비게이팅
      /*if (choiceIndex === 0) {
        navigate("/view");
      } else if(choiceIndex ===1) {
        navigate("/rest");
      } else {
        navigate("/walk");
      }
      return;
    }*/
    }
    
    // 💡 씬 종료 확인 및 다음 씬으로 내비게이션 로직 추가
    if (idx >= storyCuts.length - 1) { 
        navigate("/cabinindoor"); 
        return;
    }


    setIdx(idx + 1); // 다음 컷으로 이동
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
      //if ([9].includes(current.id)) return;

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
      {[3, 4, 5, 6].includes(current.id) && <div className={styles.bgDim} />}

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
                  !current.speaker ? styles.centerText : "",           // 기본 (화자 X)
                  current.speaker && !hasLineBreak ? styles.noLineBreak : "",  // 화자 O, 대사 줄바꿈 X
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
              onClick={() => handleNext(0)} 
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
    </div>
  );
}