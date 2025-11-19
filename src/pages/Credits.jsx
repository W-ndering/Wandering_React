import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterControl } from "../hooks/useCharacterControl";
import styles from "./Scene.module.css";

export default function Credits() {
  const nickname = sessionStorage.getItem('NICKNAME') || '나';
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  // 통합 조작 시스템 (상호작용 키만 사용)
  const { isInteractionKey } = useCharacterControl({
    enableMovement: false,
    enableJump: false,
  });

  const credits = [
    {
      id: 184,
      title: "DESIGNER",
      names: ["JI YEON JEON", "YOUNG WON KIM", "JU YOUNG KIM"]
    },
    {
      id: 185,
      title: "FRONTEND DEVELOPER",
      names: ["YOU SUNG DO", "DO KYUNG KIM", "CHAE YUN KIM"]
    },
    {
      id: 186,
      title: "BACKEND DEVELOPER",
      names: ["KYUNG HOON LEE"]
    },
    {
      id: 187,
      title: "SPECIAL THANKS TO",
      names: [nickname]
    }
  ];

  const current = credits[idx];

  // 자동 스크롤 (3초마다 다음 크레딧으로 이동)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (idx < credits.length - 1) {
        setIdx(idx + 1);
      } else {
        navigate("/");
      }
    }, 3000); // 3초 후 다음 화면

    return () => clearTimeout(timer);
  }, [idx, navigate]);

  return (
    <div className={styles.creditsViewport}>
      <div className={styles.creditsStage}>
        {/* TODO: Add polaroid images from assets/obj/ */}
        <div className={styles.creditsContent}>
          <div className={styles.creditsTitle}>{current.title}</div>
          <div className={styles.creditsNames}>
            {current.names.map((name, i) => (
              <div key={i} className={styles.creditsName}>{name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}