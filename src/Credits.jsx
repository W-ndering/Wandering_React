import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Scene.module.css";

export default function Credits() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  const credits = [
    {
      id: 184,
      title: "DESIGNER",
      names: ["JI YEON JEON", "영문 이름 입력해주세요", "영문 이름 입력해주세요"]
    },
    {
      id: 185,
      title: "FRONTEND DEVELOPER",
      names: ["영문 이름 입력해주세요", "영문 이름 입력해주세요", "영문 이름 입력해주세요"]
    },
    {
      id: 186,
      title: "BACKEND DEVELOPER",
      names: ["영문 이름 입력해주세요"]
    },
    {
      id: 187,
      title: "SPECIAL THANKS TO",
      names: ["YOU"]
    }
  ];

  const current = credits[idx];

  useEffect(() => {
    const onClick = () => {
      if (idx < credits.length - 1) {
        setIdx(idx + 1);
      } else {
        navigate("/");
      }
    };

    const onKey = (e) => {
      if (e.key === " " || e.key === "Enter") {
        onClick();
      }
    };

    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
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
