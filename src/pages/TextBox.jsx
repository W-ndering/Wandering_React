import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TextBox.module.css";
import textbox from "../assets/obj/text_box.svg";

export default function TextBox() {
  const navigate = useNavigate();
  const nickname = sessionStorage.getItem('NICKNAME') || '나';

  const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
  const typingTimerRef = useRef(null); // 타이핑 interval 저장
  const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트


  // 선택지에 따른 네비게이팅이 포함된 handleNext는 선택지 파일에 구현 예정
  const handleNext = async () => {
    if (idx >= storyCuts.length - 1) {
      navigate('/text-box') // 마지막 컷 이후에 이동할 스토리 경로로 수정하기
      return;
    }

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setDisplayedText("");
    setIsTyping(false);

    setIdx(idx + 1); // 마지막 컷이 아니면 다음 컷으로 이동
  };

  // 텍스트 타이핑 효과
  useEffect(() => {
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

  // 스페이스바로 다음 컷으로 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;

      // 스페이스바 막아야 하는 컷의 id를 배열에 넣기 (ex. 선택지가 여러 개일 때)
      if ([].includes(current.id)) return;

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
      // 그 외엔 다음 컷으로 이동
      handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTyping, current.id, current.text]);

  return (
    <div className={styles.viewport}>

      {/* 배경 dim 필요한 컷의 id를 배열에 넣기 */}
      {[2, 3].includes(current.id) && <div className={styles.bgDim} />}

      {current.text && (
        <div className={styles.textboxWrap}>
          <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

          {(() => {
            const hasLineBreak = current.text.includes("\n"); // 대사 줄바꿈 유무
            const isBigText = current.id === 3; // 해당 설명은 "화자와 대사 출력" 설명에 포함했습니다

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
                {/* 커스텀이 필요 없는 씬에서는 커스텀 관련 코드들을 지우고 사용해주세요 */}
                {/* current.id에 커스텀이 필요한 컷 id를 넣어주세요 */}
                {/* css 파일에서 각 컷에 맞는 커스텀 스타일로 수정하여 사용해주세요 */}
                {/* 프롤로그에 대사 커스텀이 2가지가 필요하길래 일단 2개를 만들어놨습니다 */}
                {/* 다만 "화자가 있는데 대사 크기가 큰 경우"(ex. 프롤로그)에는 상위 div에 yesLineBreak를 적용해야 합니다.
                    따라서, 이 경우에만 "isBigText"에 해당 컷 id를 넣어주세요 */}
                {current.speaker && (
                  <div className={`${styles.speaker} ${current.id === 1 ? styles.speakerCustom : ""}`}>{current.speaker}</div>
                )}
                <div className={`${styles.content} ${current.id === 2 ? styles.contentCustom1 : ""} ${current.id === 3 ? styles.contentCustom2 : ""}`}>{displayedText}</div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
}