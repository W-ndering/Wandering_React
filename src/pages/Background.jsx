// storyCuts 형태의 배열을 사용한다는 가정 하에 작성하였습니다.
// handleNext와 스페이스바 기능은 타이핑 여부와 엮여 있으므로 TextBox.jsx에서 구현할 예정입니다.


import { useState, useEffect } from "react";
import styles from "./Background.module.css";

export default function Background() {
  const [idx, setIdx] = useState(0); // 현재 컷 인덱스
  const [current, setCurrent] = useState(storyCuts[idx]); // 현재 컷 정보
  const [lastVisual, setLastVisual] = useState({ bg: storyCuts[idx].bg }); // 가장 마지막에 선언된 배경

  // 다른 배경이 선언되기 전까지는 가장 마지막에 선언된 배경으로 유지
  // ex. 컷 1~3이 모두 bg1이라면, 컷 2, 3에서 bg를 또 적지 않아도 됨
  useEffect(() => {
    const merged = {
      ...storyCuts[idx],
      bg: storyCuts[idx].bg ?? lastVisual.bg,
    };
    setCurrent(merged);
    setLastVisual({ bg: merged.bg });
  }, [idx]);

  return (
    <div className={styles.viewport}>
      {current.bg.startsWith("#") // 배경이 단색(색상 코드)인 경우와 이미지인 경우 분기
        ? <div className={styles.background} style={{ backgroundColor: current.bg }} /> // 단색일 때
        : <img src={current.bg} alt="배경" className={styles.background} /> // 이미지일 때
      }
    </div>
  );
}