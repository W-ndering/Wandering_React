import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import './Airport.css'; // Stage1 전용 CSS 임포트
import airportbg from '../assets/bg/2_1_공항.svg';
import airportRoadbg from '../assets/bg/3_1_공항앞길거리.svg'

// --- 상수 정의 ---
const MOVE_SPEED = 15;
const GROUND_Y = 80; // 바닥 Y좌표 (px)
const CHARACTER_WIDTH = 60;
const NPC_WIDTH = 60;

// --- 애셋 경로 (실제 애셋으로 교체) ---
const ASSET_PATHS = {
    intro_bg: airportbg,
  airport_bg: airportRoadbg,
  character: 'https://placehold.co/60x100/3498db/ffffff?text=Player',
  npc1: 'https://placehold.co/60x100/2ecc71/ffffff?text=NPC+A',
  exclamation: 'https://placehold.co/40x40/f1c40f/000000?text=!', // 느낌표 이미지
};

// --- NPC 설정 ---
const NPC_CONFIG = {
  npc1: {
    id: 'npc1',
    x: 800, // NPC의 x 좌표 (px)
    triggerRange: 100, // 이 거리(px) 안으로 오면 트리거
    image: ASSET_PATHS.npc1,
    dialogue: [
      "어, 안녕?",
      "여기까지 오다니 대단하네.",
      "오른쪽 끝으로 가면 다음 스테이지로 갈 수 있어.",
    ],
  },
};



function Airport() {
  // --- 상태 관리 ---
  const [charX, setCharX] = useState(0); // (1) 캐릭터 위치
  const [showExclamation, setShowExclamation] = useState(null); // (3) 느낌표
  const [activeDialogue, setActiveDialogue] = useState(null); // (4, 5) 대화
  const [isTyping, setIsTyping] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true); // (NEW) 인트로 오버레이 표시
  const [introOpacity, setIntroOpacity] = useState(1); // (NEW) 인트로 오버레이 투명도

  // --- 훅 설정 ---
  const gameAreaRef = useRef(null);
  const navigate = useNavigate(); // (6) 페이지 이동 훅

  // (5) 상호작용 핸들러 (스페이스바 및 클릭)
  const handleInteraction = useCallback(() => {
    if (!activeDialogue) return;
    if (isTyping) {
      setIsTyping(false); // 타이핑 스킵
    } else {
      const nextIndex = activeDialogue.index + 1;
      if (nextIndex < activeDialogue.lines.length) {
        setActiveDialogue((prev) => ({ ...prev, index: nextIndex }));
      } else {
        setActiveDialogue(null); // 대화 종료
      }
    }
  }, [activeDialogue, isTyping]);

  // (1, 6) 키보드 입력 (이동 및 내비게이션)
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    gameArea.focus();

    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        handleInteraction();
        return;
      }
      if (activeDialogue) return; // 대화 중에는 이동 불가

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        setCharX((prevX) => {
          const newX = prevX + MOVE_SPEED;
          const gameWidth = gameArea.offsetWidth || 0;
          if (newX >= gameWidth - CHARACTER_WIDTH) {
            navigate('/stage2'); // (6) 화면 우측 끝 도달
            return gameWidth - CHARACTER_WIDTH;
          }
          return newX;
        });
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        setCharX((prevX) => Math.max(0, prevX - MOVE_SPEED));
      }
    };

    gameArea.addEventListener('keydown', handleKeyDown);
    return () => gameArea.removeEventListener('keydown', handleKeyDown);
  }, [navigate, handleInteraction, activeDialogue]); // activeDialogue 추가

    useEffect(() => {
    // A short delay before starting the fade, e.g., 500ms
    // 페이드아웃 시작 전 잠시 대기 (예: 500ms)
    const fadeTimer = setTimeout(() => {
      setIntroOpacity(0); // 페이드아웃 트리거
    }, 500);

    // Time to remove from DOM: 500ms (delay) + 2000ms (fade duration from CSS)
    // DOM에서 제거 타이밍: 500ms (대기) + 2000ms (페이드 지속시간)
    const removeTimer = setTimeout(() => {
      setIsIntroVisible(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // (2, 3) NPC 상호작용 트리거
  useEffect(() => {
    if (activeDialogue || showExclamation) return;

    for (const npcId in NPC_CONFIG) {
      const npc = NPC_CONFIG[npcId];
      // 캐릭터와 NPC 중심점 사이의 거리 계산
      const distance = Math.abs(
        (charX + CHARACTER_WIDTH / 2) - (npc.x + NPC_WIDTH / 2)
      );

      if (distance < npc.triggerRange) {
        // (3) 느낌표 1초간 표시
        setShowExclamation(npc.id);
        setTimeout(() => {
          setShowExclamation(null);
          // (4) 대화 시작
          setActiveDialogue({
            lines: npc.dialogue,
            index: 0,
            npcId: npc.id,
          });
        }, 1000); // 1초 후
        break;
      }
    }
  }, [charX, activeDialogue, showExclamation]);

  return (
    <div
      ref={gameAreaRef}
      tabIndex="0"
      onClick={handleInteraction} // (5) 화면 빈 곳 클릭
      className="game-area"
      style={{ backgroundImage: `url(${ASSET_PATHS.airport_bg})` }}
    >

        {isIntroVisible && (
        <div
          className="intro-fade-overlay" // Airport.css에 정의 필요
          style={{
            backgroundImage: `url(${ASSET_PATHS.intro_bg})`,
            opacity: introOpacity,
          }}
        />
      )}
      {/* 1. 캐릭터 렌더링 */}
      <div
        className="player-character"
        style={{
          left: `${charX}px`,
          bottom: `${GROUND_Y}px`,
          // backgroundImage: `url(${ASSET_PATHS.character})` // 실제 이미지
        }}
      >
        <span className="player-label">Player</span>
      </div>

      {/* NPC 렌더링 */}
      {Object.values(NPC_CONFIG).map((npc) => (
        <div key={npc.id} className="npc-container">
          {/* NPC 본체 */}
          <div
            className="npc-character"
            style={{
              left: `${npc.x}px`,
              bottom: `${GROUND_Y}px`,
              // backgroundImage: `url(${npc.image})` // 실제 이미지
            }}
          >
            <span className="npc-label">NPC</span>
          </div>

          {/* (3) 느낌표 렌더링 */}
          {showExclamation === npc.id && (
            <div
              className="exclamation-mark"
              style={{
                left: `${npc.x - 50}px`, // NPC 좌측
                bottom: `${GROUND_Y + 100}px`, // NPC 머리 위
                // backgroundImage: `url(${ASSET_PATHS.exclamation})` // 실제 이미지
              }}
            >
              !
            </div>
          )}
        </div>
      ))}

      {/* 4, 5. 대화창 렌더링 */}
      {activeDialogue && (
        <DialogueBox
          key={activeDialogue.index} // index 변경 시 컴포넌트 리셋 (타이핑 새로 시작)
          text={activeDialogue.lines[activeDialogue.index]}
          isTyping={isTyping}
          onTypingStart={() => setIsTyping(true)}
          onTypingComplete={() => setIsTyping(false)}
        />
      )}
    </div>
  );
}

export default Airport;
