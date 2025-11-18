import { useState, useEffect, useRef } from 'react';
import { MOVEMENT_KEYS, JUMP_KEYS, INTERACTION_KEYS } from '../config/controls';

/**
 * 캐릭터 조작 통합 훅
 * 이동, 점프, 상호작용(대화 진행) 기능을 모두 제공
 *
 * @param {Object} options 설정 옵션
 * @param {number} options.speed - 이동 속도 (pixels/second, 기본값: 500)
 * @param {number} options.minX - 최소 X 좌표 (기본값: 0)
 * @param {number} options.maxX - 최대 X 좌표 (기본값: 2160)
 * @param {number} options.gravity - 중력 (pixels/second², 기본값: 1500)
 * @param {number} options.jumpVelocity - 점프 초기 속도 (기본값: 600)
 * @param {number} options.groundLevel - 지면 레벨 (기본값: 0)
 * @param {boolean} options.enableMovement - 이동 기능 활성화 (기본값: true)
 * @param {boolean} options.enableJump - 점프 기능 활성화 (기본값: true)
 *
 * @returns {Object} 캐릭터 조작 관련 상태와 함수들
 */
export const useCharacterControl = ({
  speed = 500,
  minX = 0,
  maxX = 2160,
  gravity = 1500,
  jumpVelocity = 600,
  groundLevel = 0,
  enableMovement = true,
  enableJump = true,
} = {}) => {
  // 이동 상태
  const keysRef = useRef({ left: false, right: false });

  // 점프 상태
  const [charY, setCharY] = useState(groundLevel);
  const [isJumping, setIsJumping] = useState(false);
  const velocityRef = useRef(0);
  const jumpAnimationRef = useRef(null);

  // 점프 함수
  const jump = () => {
    if (!enableJump || isJumping) return;

    setIsJumping(true);
    velocityRef.current = jumpVelocity;

    const startY = charY; // 점프 시작 시의 Y 위치 저장
    let currentY = startY;

    const animate = () => {
      const deltaTime = 1 / 60; // 약 60 FPS

      velocityRef.current -= gravity * deltaTime;
      currentY += velocityRef.current * deltaTime;

      if (currentY <= groundLevel) {
        setCharY(groundLevel);
        setIsJumping(false);
        velocityRef.current = 0;
        if (jumpAnimationRef.current) {
          cancelAnimationFrame(jumpAnimationRef.current);
          jumpAnimationRef.current = null;
        }
      } else {
        setCharY(currentY);
        jumpAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    jumpAnimationRef.current = requestAnimationFrame(animate);
  };

  // 점프 초기화
  const resetJump = () => {
    if (jumpAnimationRef.current) {
      cancelAnimationFrame(jumpAnimationRef.current);
      jumpAnimationRef.current = null;
    }
    setCharY(groundLevel);
    setIsJumping(false);
    velocityRef.current = 0;
  };

  // 이동 방향 계산
  const getMovementDirection = () => {
    if (!enableMovement) return 0;
    const { left, right } = keysRef.current;
    return (left ? -1 : 0) + (right ? 1 : 0);
  };

  // 속도 계산 (deltaTime 기반)
  const getVelocity = (deltaTime) => {
    const direction = getMovementDirection();
    return direction * speed * deltaTime;
  };

  // 경계를 고려한 새 좌표 계산
  const getClampedPosition = (currentX, velocity) => {
    const newX = currentX + velocity;
    return Math.max(minX, Math.min(maxX, newX));
  };

  // 키보드 이벤트 핸들러 설정
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 이동 키
      if (enableMovement) {
        if (MOVEMENT_KEYS.LEFT.includes(e.key)) {
          keysRef.current.left = true;
        }
        if (MOVEMENT_KEYS.RIGHT.includes(e.key)) {
          keysRef.current.right = true;
        }
      }

      // 점프 키
      if (enableJump && JUMP_KEYS.includes(e.key)) {
        jump();
      }
    };

    const handleKeyUp = (e) => {
      if (enableMovement) {
        if (MOVEMENT_KEYS.LEFT.includes(e.key)) {
          keysRef.current.left = false;
        }
        if (MOVEMENT_KEYS.RIGHT.includes(e.key)) {
          keysRef.current.right = false;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (jumpAnimationRef.current) {
        cancelAnimationFrame(jumpAnimationRef.current);
      }
    };
  }, [enableMovement, enableJump]);

  return {
    // 이동 관련
    keysRef,
    getMovementDirection,
    getVelocity,
    getClampedPosition,

    // 점프 관련
    charY,
    isJumping,
    jump,
    resetJump,

    // 상호작용 키 헬퍼
    isInteractionKey: (event) => INTERACTION_KEYS.includes(event.key) || INTERACTION_KEYS.includes(event.code),
  };
};