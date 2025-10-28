import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "./assets/bg/13-5_산입구.svg";
import bg2 from "./assets/bg/14-5_산중턱.svg";
import char1 from "./assets/char/기본_주인공1.svg";
import char2 from "./assets/char/힘든_주인공2.svg";
import textbox from "./assets/obj/text_box.svg";
import choicebox from "./assets/obj/선택지.svg";
import intericon from "./assets/obj/interaction.svg";

import styles from "./Mountain.module.css";

export default function Mountain() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
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
      speaker: "player",
      text: "산이라... 산에서 뭘 해야 하지?",
      popup: intericon
    },
    {
      id: 3,
      text: "버스에서 내려 무작정 발걸음을 옮긴다.",
      popup: intericon
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
      char: char2, //(다음컷엔 중간으로 초기위치 이동)
      text: "계단은 점점 흙길로 이어지고,\n오를수록 길은 험난해진다.",
    },
    {
      id: 7,
      text: "계단은 점점 흙길로 이어지고,\n오를수록 길은 험난해진다.",
      choice: {
        src: choicebox,
        text: ["힘드니 내려간다.", "계속 올라간다."]
      }
    },
  ];
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
    char: storyCuts[0].char,
  });
  const isEnterLocked = [4, 7].includes(current?.id); // Enter로 못 넘어가는 컷 설정

  useEffect(() => {
    const cut = storyCuts[idx];
    const merged = {
      ...cut,
      bg: cut.bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
      char:
        cut.char === "none" // 캐릭터 사용 안 하는 경우
          ? null
          : cut.char ?? lastVisual.char, // char 입력 없으면 이전 char 유지
    };
    setCurrent(merged); // 현재 보여줄 컷으로 설정
    setLastVisual({ bg: merged.bg, char: merged.char });
  }, [idx]);

  const handleNext = () => {
    if (current?.id === 7) {
      if (choiceIndex === 0) {
        navigate("/climbdown"); // 힘드니 내려간다 선택
      } else {
        navigate("/traveler"); // 계속 올라간다 선택
      }
      return;
    }
    setIdx(idx + 1);
  };

  // Enter키로 다음 컷으로 이동 --------인터랙트, 복수선택지 있는 스토리는 수정 필요
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        if (isEnterLocked) return;
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isEnterLocked, idx]);

  const handleClick = () => { // 인터랙션 클릭하여 다음 컷으로 이동
    setIdx(idx + 1);
  };

  return (
    <div className={styles.viewport}>

      <div className={styles.stage}>
        {current.bg.startsWith("#") // 배경
          ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
          : <img src={current.bg} alt="배경" className={styles.background} />
        }

        {/* 특정 장면에서 배경 dim */}
        {[1, 5, 7].includes(current.id) && <div className={styles.bgDim} />}

        {current.title && ( // 새로운 스토리 도입 시 제목
          <div className={styles.titleText}>{current.title}</div>
        )}

        {current.char && ( // 캐릭터
          <img src={current.char} alt="캐릭터" className={styles.character} />
        )}

        {current.text && ( // 텍스트창
          <div className={styles.textboxWrap}>
            <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

            <div // 화자 없으면 가운데정렬 (기본은 왼쪽정렬), 있으면 약간 위로 옮기기
              className={`${styles.textboxContent}
                ${!current.speaker ? styles.centerText : ""} 
                ${current.speaker ? styles.upText : ""}`} >
              {current.speaker && (
                <div className={styles.speaker}>{current.speaker}</div>
              )}
              <div className={styles.content}>{current.text}</div>
            </div>
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
                    onClick={() => handleClick(i)}
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
                tabIndex={0}
                onClick={() => handleClick(0)}
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


        {current.popup && ( // 팝업창(아이템)
          <div className={styles.popupWrap}>
            <div className={styles.circle}></div>

            {current.popup && (
              <img src={current.popup} alt="인터랙션아이콘"
                className={styles.popupInterImage}
                onClick={handleClick}
              />
            )}
          </div>
        )}
      </div>

    </div>
  );
}