import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/15-6_산정상.svg";
import char1 from "../assets/char/기본_주인공1.svg";
import char2 from "../assets/char/여행자.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import statebox from "../assets/obj/상태창.svg";
import intericon from "../assets/obj/interaction.svg";
import tea from "../assets/obj/차.svg";
import styles from "./Traveler.module.css";

export default function Traveler() {
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const playerid = sessionStorage.getItem("playerId") || "0";
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 1,
      bg: bg1,
      char: char1,
      text: "정상을 향해 발걸음을 옮길수록,\n과연 이 여정의 끝에는 무엇이 있을지\n의문만 짙어진다."
    },
    {
      id: 2,
      char: char1,
      npc: { src: char2, x: 1845 },
      text: "날씨는 점점 거칠어지고,\n숨 막히는 등반 끝에\n마침내 정상에 다다른다.",
      popup: {
        type: "inter",
        src: intericon,
      }
    },
    {
      id: 3,
      popup: {
        type: "inter",
        src: intericon,
      }
    },
    {
      id: 4,
      speaker: "여행자",
      text: "풍경이 참 멋지지요?"
    },
    {
      id: 5,
      popup: {
        type: "state",
        src: statebox,
        obj: tea,
        text: "따뜻한 차\n속까지 따뜻해지는 차이다."
      }
    },
    {
      id: 6,
      speaker: nickname,
      text: "네. 이런 곳이 있는 줄 몰랐어요."
    },
    {
      id: 7,
      speaker: "여행자",
      text: "그런데,\n당신은 왜 이 길을 오르셨습니까?"
    },
    {
      id: 8,
      speaker: "여행자",
      text: "그런데,\n당신은 왜 이 길을 오르셨습니까?",
      choice: {
        src: choicebox,
        text: ["그냥 걷다보니 이곳에 닿았습니다.", "이 길에서 누군가를 만날 수 있을 거라 생각했어요.", "스스로를 시험해보고 싶었습니다."]
      }
    },
    {
      id: 9,
      speaker: "여행자",
      text: "그렇군요.\n잠시 앉으시겠습니까?"
    },
    {
      id: 10,
      npc: { src: char2, x: 1960 },
      text: "당신은 여행자와 앉아 풍경을 바라본다.",
      choice: {
        src: choicebox,
        text: "일어난다."
      }
    },
    {
      id: 11,
      speaker: "여행자",
      text: "벌써 가시는군요.\n부디 즐거운 여정이 되시길 바랍니다.",
    },
    {
      id: 12,
      speaker: nickname,
      text: "감사합니다. 그럼 이만.",
      choice: {
        src: choicebox,
        text: "산을 내려가자"
      }
    }
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

  const [charX, setCharX] = useState(100); // 시작 x좌표(px) — 필요에 따라 조정
  const navigatedRef = useRef(false);

  const SCENE_ID = 6;

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
          : (storyCuts[idx].char ?? lastVisual.char), // char 입력 없으면 이전 char 유지
      npc: storyCuts[idx].npc === "none" ? null : (storyCuts[idx].npc ?? lastVisual.npc)
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char, npc: merged.npc });

    navigatedRef.current = false;

    if (storyCuts[idx].id === 10) {
      setCharX(1300);
    }
  }, [idx]);

  // 선택에 따른 네비게이팅 포함한 handleNext
  const handleNext = async (choiceIndex = null) => {
    if (idx >= storyCuts.length - 1) {
      navigate('/climbdown');
      return;
    }

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);

    if (choiceIndex !== null) {
      const optionKey = choiceIndex + 1;

      postChoice({ sceneId: SCENE_ID, optionKey });
    }

    setIdx(idx + 1); // 마지막 컷이 아니면 다음 컷으로 이동
  };

  // Space바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;

      // 💡 수정: id: 11을 예외 목록에서 제거했습니다.
      // id 3은 상호작용 아이콘으로, id 8은 선택지 팝업으로 다음 컷 진행을 제어합니다.
      if ([3, 8].includes(current.id)) return;

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

      {current.bg.startsWith("#") // 배경
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경" className={styles.background} />
      }

      {/* 특정 장면에서 배경 dim */}
      {[5, 8, 10].includes(current.id) && <div className={styles.bgDim} />}

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
            left: `${current.npc.x ?? 1650}px`,
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
                  onClick={() => handleNext()}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}