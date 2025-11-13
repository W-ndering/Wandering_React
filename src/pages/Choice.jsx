import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Choice.module.css";
import choicebox from "../assets/obj/선택지.svg";

export default function Choice() {
  const navigate = useNavigate();
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
  const playerid = sessionStorage.getItem("playerId") || "0";
  const SCENE_ID = 5; // 선택 결과 전송을 위한 SCENE_ID (씬에 맞게 수정)

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

  // 선택에 따른 네비게이팅 포함한 handleNext
  const handleNext = async (choiceIndex = null) => {
    // 마지막 컷 이후에 이동할 스토리 경로로 수정하기 (마지막 컷이 선택지인 경우에는 지우기)
    if (idx >= storyCuts.length - 1) {
      // navigate('/')
      return;
    }

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setDisplayedText("");
    setIsTyping(false);

    if (choiceIndex !== null) {
      const optionKey = choiceIndex + 1;

      postChoice({ sceneId: SCENE_ID, optionKey });

      // 선택지 2개 or 3개 중 필요한 부분만 살려서 사용
      // 선택지 2개일 때 네비게이팅
      if (choiceIndex === 0) {
        // navigate("/");
      } else {
        // navigate("/");
      }
      return;

      // 선택지 3개일 때 네비게이팅
      if (choiceIndex === 0) {
        // navigate("/");
      } else if (choiceIndex === 1) {
        // navigate("/");
      } else {
        // navigate("/");
      }
      return;
    }

    setIdx(idx + 1); // 마지막 컷이 아니면 다음 컷으로 이동
  };

  return (
    <div className={styles.viewport}>

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

    </div>
  );
}