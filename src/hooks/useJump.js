import { useState, useEffect, useRef } from 'react';
import { JUMP_KEYS } from '../config/controls';

/**
 * 점프 기능 전용 훅
 *
 * @param {Object} options 설정 옵션
 * @param {number} options.gravity - 중력 (pixels/second², 기본값: 1500)
 * @param {number} options.jumpVelocity - 점프 초기 속도 (기본값: 600)
 * @param {number} options.groundLevel - 지면 레벨 (기본값: 0)
 * @param {boolean} options.enabled - 점프 기능 활성화 여부 (기본값: true)
 *
 * @returns {Object} 점프 관련 상태와 함수들
 */
export const useJump = ({
  gravity = 1500,
  jumpVelocity = 600,
  groundLevel = 0,
  enabled = true,
} = {}) => {
  const [charY, setCharY] = useState(groundLevel);
  const [isJumping, setIsJumping] = useState(false);
  const velocityRef = useRef(0);
  const animationRef = useRef(null);

  // 점프 함수
  const jump = () => {
    if (!enabled || isJumping) return;

    setIsJumping(true);
    velocityRef.current = jumpVelocity;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = 1 / 60; // 약 60 FPS

      velocityRef.current -= gravity * deltaTime;
      const newY = charY + velocityRef.current * deltaTime;

      if (newY <= groundLevel) {
        setCharY(groundLevel);
        setIsJumping(false);
        velocityRef.current = 0;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        setCharY(newY);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // 점프 초기화
  const resetJump = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setCharY(groundLevel);
    setIsJumping(false);
    velocityRef.current = 0;
  };

  // 키보드 이벤트 핸들러
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      if (JUMP_KEYS.includes(e.key)) {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isJumping]);

  return {
    charY,
    isJumping,
    jump,
    resetJump,
  };
};