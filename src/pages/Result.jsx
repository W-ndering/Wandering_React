import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import result1 from "../assets/obj/결과__추억만남.svg";
import result2 from "../assets/obj/결과_도전.svg";
import result3 from "../assets/obj/결과_소심방랑.svg";
import cookie from "../assets/bg/cookie.svg";
import cookie2 from "../assets/obj/cookie2.svg";
import end from "../assets/obj/The_end.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Result.module.css";

export default function Result() {
    const nickname = sessionStorage.getItem('NICKNAME') || '나';
    const playerid = sessionStorage.getItem("playerId") || "0";
    const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;

  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState({
    img: "",
    typeName: "",
    feedback: "",
  });
  const storyCuts = [
    {
      id: 1,
      bg: "#000000",
      popup: {
        type: "result"
      }
    },
    {
      id: 2,
      popup: {
        type: "cookie1",
        src: cookie
      },
    },
    {
      id: 3,
      speaker: nickname,
      text: "다녀왔습니다.",
      popup: {
        type: "cookie2",
        src: cookie,
      }
    },
    {
      id: 4,
      speaker: "부모님",
      text: "어서오렴, 배고프지?\n손 씻고 와서 밥먹자.",
      popup: {
        type: "cookie2",
        src: cookie,
      }
    },
 
    {
      id: 8,
      popup: {
        type: "end",
        src: end
      }
    },
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장
  const navigatedRef = useRef(false);

  const RESULT_IMAGE_MAPPING = { // typeName으로 결과창 이미지 구분
    "[머무른 시간 속에서 길을 찾으세요.]": result1,
    "[세상은 당신의 발걸음을 기다립니다.]": result2,
    "[스스로를 믿으세요.]": result3,
  };

  useEffect(() => { // 결과 api 연결
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`${BACKEND_KEY}/player/${playerid}/end`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`${res.status}`);

        const data = await res.json();

        const mappedImg =
          RESULT_IMAGE_MAPPING[data.typeName];

        if (mounted) {
          setResult({
            img: mappedImg,
            typeName: data.typeName.replace(/[\[\]]/g, ""),
            feedback: data.feedback.replace(/\.\s*/g, ".\n\n"),
          });
        }
      } catch (err) {
        if (mounted) {
          // 임시 결과 텍스트
          console.log("⚠️ mock 데이터로 대체:", err.message);
          setResult({
            img: result1,
            typeName: "머무른 시간 속에서 길을 찾으세요.",
            feedback:
              "당신은 추억과 만남을 소중히 여기는 사람입니다.\n\n머물렀던 시간은 분명 값진 경험으로 남아, 앞으로의 길에 힘이 되어줄 거예요.\n\n순간에 집중하고 타인과의 교감을 추구하는 당신은, 경험 속에서 답을 찾을 줄 아는 사람입니다.\n\n혹시 길을 잃은 듯 느껴질 때에는, 머무른 시간 속에서 길을 찾아보세요.",
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
    }, 75);

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
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      navigate("/credits"); //엔딩 크레딧으로 이동
      return;
    }

    setIdx(idx + 1);
  };

  // 스페이스바로 다음 컷으로 이동 (Enter에서 수정)
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
      if ([1].includes(current.id)) return; // 결과창에선 쿠키 버튼으로 다음 컷으로 이동

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

      {current.popup && ( // 결과창, 쿠키, END
        <>
          {current.popup.type === "result" && (
            <div className={styles.popupResultScroll}>
              <div className={styles.popupResultWrap}>

                {result.img && (
                  <img
                    src={result.img}
                    alt="결과창"
                    className={styles.popupResultImage}
                  />
                )}

                <div className={styles.cardText}>
                  {result.img === result1 && "행운의 카드 : 추억의 비눗방울"}
                  {result.img === result2 && "행운의 카드 : 열정의 모닥불"}
                  {result.img === result3 && "행운의 카드 : 고요의 등불"}
                </div>

                <div className={styles.typeNameText}>
                  {result.typeName}
                </div>

                <div className={styles.feedbackBox}>
                  <div className={styles.feedbackText}>
                    {result.feedback}
                  </div>
                </div>

                <div className={styles.btn1}>결과 공유하기</div>
                <div className={styles.btn2}>다시 여행하기</div>
                <div className={styles.btn3} onClick={handleNext}>
                  Want some Cookie?
                  <img
                    src={cookie2}
                    alt="쿠키아이콘"
                    className={styles.cookieIcon}
                  />
                </div>

              </div>
            </div>
          )}

          {current.popup.type === "cookie1" && ( // 정가운데 쿠키
            <div className={styles.popupCenterWrap}>
              <img
                src={current.popup.src}
                alt="쿠키"
                className={styles.popupCookieImage}
              />
            </div>
          )}

          {current.popup.type === "cookie2" && ( // 텍스트창 밑 쿠키
            <div className={styles.popupDownWrap}>
              <img
                src={current.popup.src}
                alt="쿠키"
                className={styles.popupCookieImage}
              />
            </div>
          )}

          {current.popup.type === "end" && (
            <div className={styles.popupCenterWrap}>
              <img
                src={current.popup.src}
                alt="끝"
                className={styles.popupEndImage}
              />
            </div>
          )}
        </>
      )}

    </div>

  );
}