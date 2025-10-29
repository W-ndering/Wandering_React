import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import result1 from "./assets/obj/결과_추억만남.svg";
// import result2 from "./assets/obj/결과_도전.svg";
// import result3 from "./assets/obj/결과_소심방랑.svg";
// import cookie from "./assets/bg/cookie.svg";
// import end from "./assets/obj/The_end.svg";
import textbox from "./assets/obj/text_box.svg";
import styles from "./Result.module.css";

export default function Result() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const storyCuts = [
    {
      id: 1,
      bg: "#000000",
      // 결과창
    },
    {
      id: 2,
      // cookie 이미지 2개
    },
    {
      id: 3,
      speaker: "player",
      text: "다녀왔습니다."
      // cookie 이미지 1개
    },
    {
      id: 4,
      speaker: "부모님",
      text: "어서오렴, 배고프지?",
      // cookie 이미지 1개
    },
    {
      id: 5,
    },
    {
      id: 6,
      text: "잘 지냈어?"
    },
    {
      id: 7,
      text: "우리... 만날까?"
    },
    {
      id: 8,
      // end 이미지
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
  const navigatedRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });

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
    if (idx >= storyCuts.length - 1) {
        navigate("/ending"); //엔딩 크레딧으로 이동
        return;
    }
    setIdx(idx + 1);
  };

  // 스페이스바로 다음 컷으로 이동 (Enter에서 수정)
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
    //   if ([1].includes(current.id)) return; // 나중에 주석 풀어야됨!!!!!!!

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

  // 키 입력 등록 (a/d 삭제)
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

  return (
    <div className={styles.viewport}>

      <div className={styles.stage}>
        {current.bg.startsWith("#") // 배경
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

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
          </div>
        )}
      </div>
    </div>
  );
}