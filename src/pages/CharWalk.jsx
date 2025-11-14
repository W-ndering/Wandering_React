// 제가 맡은 기능은 아니지만 엮여있다 보니, 걷는 애니메이션뿐만 아니라 캐릭터 렌더링 및 이동도 포함돼있습니다. (css도 캐릭터 렌더링과 관련된 코드)
// 캐릭터 이미지는 정면 이미지를 char1(기본 세팅)으로 두고 그 이미지의 2와 3를 순서대로 char2, char3로 둔다는 가정 하에 구현하였습니다.

import { useState, useEffect, useRef } from "react";
import styles from "./CharWalk.module.css";

export default function CharWalk() {
  const [charX, setCharX] = useState(500); // 시작 x좌표(px) — 필요에 따라 조정
  const [walkFrame, setWalkFrame] = useState(0); // 0: char2, 1: char3
  const [isMoving, setIsMoving] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const walkAnimTimerRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });
  const SPEED = 600;
  const minX = 0;
  const maxX = 2160;
  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  // 캐릭터 걷는 모션 루프
  useEffect(() => {
    if (!isMoving) {
      if (walkAnimTimerRef.current) {
        clearInterval(walkAnimTimerRef.current);
        walkAnimTimerRef.current = null;
      }
      return;
    }

    walkAnimTimerRef.current = setInterval(() => {
      setWalkFrame(prev => (prev === 0 ? 1 : 0)); // 현재 0이면 1로, 1이면 0으로 변경
    }, 150);

    return () => {
      if (walkAnimTimerRef.current) {
        clearInterval(walkAnimTimerRef.current);
        walkAnimTimerRef.current = null;
      }
    };
  }, [isMoving]);

  // 키 입력 등록
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

  // 캐릭터 이동
  useEffect(() => {
    lastTimeRef.current = null;
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }

    moveTimerRef.current = setInterval(() => {
      if (!current.char) return;

      const now = performance.now();
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now;
        return;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const { left, right } = keysRef.current;
      const dir = (left ? -1 : 0) + (right ? 1 : 0);

      if (dir !== 0) {
        setIsMoving(true);
        setFacingLeft(dir < 0);
        setCharX(x => Math.max(minX, Math.min(maxX, x + dir * SPEED * dt)));
      } else {
        setIsMoving(false);
      }
    }, 16);

    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
        moveTimerRef.current = null;
      }
    };
  }, [current.char, SPEED, minX, maxX]);

  return (
    <div className={styles.viewport}>

      {current.char && (
        <img
          src={isMoving ? (walkFrame === 0 ? char2 : char3) : char1} // 이동 중일 때 0이면 char2이고 1이면 char3, 멈췄을 땐 char1(정면)
          alt="캐릭터"
          className={styles.character}
          style={{
            position: "absolute",
            bottom: 75,
            left: `${charX}px`,
            transform: facingLeft && isMoving ? "scaleX(-1)" : "none" // 좌우반전 이미지 사용 대신, 왼쪽으로 이동할 때 scaleX(-1)로 반전시킴
          }}
        />
      )}

    </div>
  );
}