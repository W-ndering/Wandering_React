import { useState, useEffect, useRef } from "react";
import styles from "./EnterField.module.css";

export default function EnterField() {
  const [isTransitioning, setIsTransitioning] = useState(false); // 페이드 전환 상태
  const autoTransitionRef = useRef(null); // 자동 전환 타이머
  const [idx, setIdx] = useState(0);
  const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
  const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
    bg: storyCuts[0].bg,
  });

  useEffect(() => {
    const merged = {
      ...storyCuts[idx],
      bg: storyCuts[idx].bg ?? lastVisual.bg,
    };

    if (current.id === 1) {
      if (autoTransitionRef.current) {
        clearTimeout(autoTransitionRef.current);
      }
      autoTransitionRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setIdx(1);
          setCurrent({ ...storyCuts[1], bg: storyCuts[1].bg ?? lastVisual.bg });
          setLastVisual({ bg: storyCuts[1].bg ?? lastVisual.bg });
        }, 800);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      }, 2200);
    }

    return () => {
      if (autoTransitionRef.current) {
        clearTimeout(autoTransitionRef.current);
      }
    };
  }, [idx, isTransitioning]);

  return (
    <div className={styles.viewport}>

      {isTransitioning && current.id === 2 && (
        <div className={styles.fadeFromDark} />
      )}

      {current.bg.startsWith("#") // 배경
        ? <div className={`${styles.background} ${isTransitioning ? `${styles.bgTransition} ${styles.fadeOut}` : ''}`}
          style={{ backgroundColor: current.bg }} />
        : <img src={current.bg} alt="배경"
          className={`${styles.background} ${isTransitioning ? `${styles.bgTransition} ${styles.fadeOut}` : ''}`} />
      }

      {/* 특정 장면에서 배경 dim */}
      {[1].includes(current.id) && <div className={styles.bgDim} />}

      {current.title && ( // 새로운 스토리 도입 시 제목
        <div className={styles.titleText}>{current.title}</div>
      )}

    </div>
  );
}