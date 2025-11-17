import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import result1 from "../assets/obj/결과__추억만남.svg";
import result2 from "../assets/obj/결과_도전.svg";
import result3 from "../assets/obj/결과_소심방랑.svg";
import result4 from "../assets/obj/결과_유니콘.svg";
import result5 from "../assets/obj/결과_나뭇잎.svg";
import saveImage1 from "../assets/obj/결과__추억만남.png";
import saveImage2 from "../assets/obj/결과_도전.png";
import saveImage3 from "../assets/obj/결과_소심방랑.png";
import saveImage4 from "../assets/obj/결과__이상상상.png";
import saveImage5 from "../assets/obj/결과__안정평온.png";
import cookie from "../assets/bg/cookie.svg";
import realcookie from "../assets/obj/cookie2.svg";
import end from "../assets/obj/The_end.svg";
import textbox from "../assets/obj/text_box.svg";
import styles from "./Result.module.css";

export default function Result() {
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const playerid = sessionStorage.getItem("playerId") || "0";
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;

  const [isTransitioning, setIsTransitioning] = useState(false); // 페이드 전환 상태
  const autoTransitionRef = useRef(null); // 자동 전환 타이머
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState({
    signal: "",
    typeName: "",
    feedback: ""
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
      }
    },
    {
      id: 3,
      speaker: "player",
      text: "다녀왔습니다.",
      popup: {
        type: "cookie2",
        src: cookie
      }
    },
    {
      id: 4,
      speaker: "부모님",
      text: "어서오렴, 배고프지?\n손 씻고 와서 밥먹자.",
      popup: {
        type: "cookie2",
        src: cookie
      }
    },
    {
      id: 5,
      popup: {
        type: "end",
        src: end
      }
    }
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
  });
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장

  const RESULT_IMAGE_MAPPING = { // signal로 결과창 이미지 맵핑
    "추억의 비눗방울": result1, // 추억만남
    "열정의 모닥불": result2, // 도전
    "고요의 등불": result3, // 소심방랑
    "상상 속 유니콘": result4, // 이상상상
    "평온의 나뭇잎": result5 // 안정평온
  };

  const FEEDBACK_FORMAT_MAPPING = { // 결과마다 줄바꿈 기준이 달라서 추가함
    "추억의 비눗방울": (text) => {
      return text.replace(/\.\s*/g, '.\n\n');
    },
    "열정의 모닥불": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.\n\n' +
        sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    },
    "고요의 등불": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.' + sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    },

    "상상 속 유니콘": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.' + sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    },
    "평온의 나뭇잎": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.' + sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    }
  };

  useEffect(() => { // 서버에서 분석 결과 받아오기
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`${BACKEND_KEY}/player/${playerid}/end`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error(`${res.status}`);

        const data = await res.json();

        const mappedImg =
          RESULT_IMAGE_MAPPING[data.signal];

        const formatFeedback = FEEDBACK_FORMAT_MAPPING[data.signal] || ((text) => text);

        if (mounted) {
          setResult({
            img: mappedImg,
            signal: data.signal,
            typeName: data.typeName.replace(/[\[\]]/g, ""),
            feedback: formatFeedback(data.feedback)
          });
        }
      } catch (err) {
        if (mounted) {
          console.log("임시 데이터로 대체: ", err.message);
          setResult({
            img: result1,
            signal: "추억의 비눗방울",
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

  const SAVE_IMAGE_MAPPING = { // signal로 저장용 이미지 맵핑
    "추억의 비눗방울": saveImage1, // 추억만남
    "열정의 모닥불": saveImage2, // 도전
    "고요의 등불": saveImage3, // 소심방랑
    "상상 속 유니콘": saveImage4, // 이상상상
    "평온의 나뭇잎": saveImage5 // 안정평온
  };

  // 결과 이미지 저장
  const handleSaveImage = () => {
    const saveImg = SAVE_IMAGE_MAPPING[result.signal];
    const link = document.createElement('a');
    link.href = saveImg;
    link.download = `결과_${result.signal.replace(/\s+/g, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


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
    const merged = {
      ...storyCuts[idx],
      bg: storyCuts[idx].bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg });

    if (merged.id === 4) {
      if (autoTransitionRef.current) {
        clearTimeout(autoTransitionRef.current);
      }
      autoTransitionRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setIdx(prev => Math.min(prev + 1, storyCuts.length - 1));
        }, 1800); // 페이드인, 페이드아웃 각각
        setTimeout(() => {
          setIsTransitioning(false);
        }, 3600); // 페이드아웃 시작 ~ 페이드인 완료
      }, 3000); // 페이드아웃 전 대기
    }

    return () => {
      if (autoTransitionRef.current) {
        clearTimeout(autoTransitionRef.current);
      }
    };
  }, [idx]);

  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      navigate("/credits"); // 크레딧으로 이동
      return;
    }

    setIdx(idx + 1);
  };

  // 스페이스바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
      if ([1, 4].includes(current.id)) return;

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

      {isTransitioning && <div className={styles.fadeOverlay} />}

      {current.bg.startsWith("#") // 배경
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경" className={styles.background} />
      }

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

      {current.popup && ( // 결과창, 쿠키, END
        <>
          {current.popup && ( // 결과 이미지
            <>
              {current.popup.type === "result" && (
                <div className={styles.popupResultScroll}>
                  <div className={styles.popupResultWrap}>

                    {result.img && (
                      <img
                        src={result.img}
                        alt="결과이미지"
                        className={styles.popupResultImage}
                      />
                    )}

                    <div className={styles.cardText}>
                      행운의 카드 : {result.signal}
                    </div>

                    <div className={styles.typeNameText}
                      style={result.signal === "평온의 나뭇잎" ? { fontSize: '32px' } : {}}
                    >
                      {result.typeName}
                    </div>

                    <div className={styles.feedbackBox}>
                      <div className={styles.feedbackText}>
                        {result.feedback}
                      </div>
                    </div>

                    <div className={styles.saveBtn} onClick={handleSaveImage}>결과 저장하기</div>
                    <div className={styles.saveBtnLine}></div>
                    <div className={styles.recommendBtn} onClick={() => navigate('/suggest')}>!내 성향에 맞는 콘텐츠 추천받기!</div>
                    <div className={styles.btn1}>결과 공유하기</div> {/* 아직 구현 X */}
                    <div className={styles.btn2} onClick={() => navigate('/')}>다시 여행하기</div> {/* 첫 화면으로 이동 */}
                    <div className={styles.btn3} onClick={() => handleNext()}> {/* 쿠키로 이동 */}
                      Want some Cookie?
                      <img
                        src={realcookie}
                        alt="쿠키아이콘"
                        className={styles.cookieIcon}
                      />
                    </div>
                  </div>
                </div>

              )}
            </>
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