import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import './Airport.css'; // Airport.css 임포트
import airportbg from '../assets/bg/2_1_공항.svg';
import airportRoadbg from '../assets/bg/3_1_공항앞길거리.svg';
import mainChar from '../assets/char/캐리어_주인공1.svg';

// --- 상수 정의 ---
const MOVE_SPEED = 15;
const GROUND_Y = 80; // 바닥 Y좌표 (px)
const CHARACTER_WIDTH = 100; // 캐릭터 너비 (실제 애셋 크기에 맞게 조절)

// --- 애셋 경로 ---
const ASSET_PATHS = {
  intro_bg: airportbg,     // 1. 인트로 배경
  airport_bg: airportRoadbg, // 2. 메인 배경
  character: mainChar,
};

const AIRPORT_DIALOGUES = [`맛집 간판, 관광 안내판, 번화가 거리.`,`장시간 비행과 이동으로 피곤하지만,\n여행 온 기분이 물씬 나는 거리이다.`,`무얼 먼저 할까?`];
const AIRPORT_CHOICES = [
  { id: 'view', text: "유명 관광지로 향해 사진을 남긴다." },
  { id: 'rest', text: "숙소로 가서 짐부터 둔다." },
  { id: 'walk', text: "길을 걸으며 이 도시를 느낀다." },
];

function Airport() {
  // --- 상태 관리 ---
  const [sequenceStep, setSequenceStep] = useState(0); // 0: 인트로, 1: 메인(이동), 2: 대사1, 3: 대사2, 4: 선택지
  const [charX, setCharX] = useState(0); // 캐릭터 위치
  
  // 대화 상태
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeDialogue, setActiveDialogue] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  // --- 훅 설정 ---
  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  // --- 1. 인트로 (2초 후 자동 전환) ---
  useEffect(() => {
    if (sequenceStep === 0) {
      const introTimer = setTimeout(() => {
        setSequenceStep(1); // 2초 뒤 메인 씬(이동 가능)으로 전환
      }, 2000);
      return () => clearTimeout(introTimer);
    }
  }, [sequenceStep]);

  // --- 2. 메인 상호작용 (스페이스바 / 클릭) ---
  const handleInteraction = useCallback(() => {
    // 타이핑 중이면 스킵
    if (isTyping) {
      setIsTyping(false);
      return;
    }
    
    // 선택지가 떴거나 인트로 중이면 상호작용 무시
    if (showChoices || sequenceStep === 0) return;

    const nextStep = sequenceStep + 1;
    setSequenceStep(nextStep);

    if (nextStep === 2) { // 대사 1
      setActiveDialogue(AIRPORT_DIALOGUES[0]);
    } else if (nextStep === 3) { // 대사 2
      setDialogueIndex(1);
      setActiveDialogue(AIRPORT_DIALOGUES[1]);
    } else if (nextStep === 4) { // 대사 3 + 선택지
      setDialogueIndex(2);
      setActiveDialogue(AIRPORT_DIALOGUES[2]);
      setShowChoices(true); // dim 처리 및 선택지 표시
    }
  }, [isTyping, sequenceStep, showChoices]);

  // --- 3. 키보드 입력 (이동 및 상호작용) ---
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    gameArea.focus();

    const handleKeyDown = (e) => {
      // 대화/선택지 중이 아닐 때(시퀀스 1)만 이동
      if (sequenceStep === 1) {
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
          setCharX((prevX) => {
            const newX = prevX + MOVE_SPEED;
            const gameWidth = gameArea.offsetWidth || 0;
            // 화면 우측 끝 도달 (캐릭터 너비만큼 빼줌)
            if (newX >= gameWidth - CHARACTER_WIDTH) {
              // navigate('/stage2'); // (주석 처리) 우측 끝 내비게이션 비활성화
              return gameWidth - CHARACTER_WIDTH;
            }
            return newX;
          });
        } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
          setCharX((prevX) => Math.max(0, prevX - MOVE_SPEED)); // 0 미만 방지
        }
      }

      // 스페이스바로 상호작용
      if (e.key === ' ') {
        e.preventDefault();
        handleInteraction();
      }
    };

    gameArea.addEventListener('keydown', handleKeyDown);
    return () => gameArea.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction, sequenceStep]); // sequenceStep 의존성 추가

  // --- 4. 선택지 클릭 핸들러 ---
  const handleChoiceClick = (choiceId) => {
    console.log("선택:", choiceId);
    
    // TODO: 여기에 내비게이팅 및 POST 로직을 구현합니다.
    if (choiceId === 'view') {
      navigate('/view');
      console.log("관광지");
    } else if (choiceId === 'rest') {
      navigate('/rest');
      console.log("호텔");
    } else if (choiceId === 'walk') {
      navigate('/walk');
      console.log("걷기");
    }
  };

  return (
    <div
      ref={gameAreaRef}
      tabIndex="0"
      className="game-area"
      // 배경은 시퀀스 0일 때 intro_bg, 그 외에는 airport_bg
      style={{
        backgroundImage: `url(${sequenceStep === 0 ? ASSET_PATHS.intro_bg : ASSET_PATHS.airport_bg})`,
      }}
      onClick={handleInteraction}
    >
      {/* Dim 오버레이 (인트로 또는 선택지 표시 시) */}
      <div 
        className="airport-dim-overlay"
        style={{
          opacity: (sequenceStep === 0 || showChoices) ? 1 : 0
        }}
      />

      {/* 인트로 텍스트 (시퀀스 0) */}
      {sequenceStep === 0 && (
        <div className="airport-intro-text">
          공항
        </div>
      )}

      {/* 캐릭터 렌더링 (시퀀스 1부터) */}
      {sequenceStep >= 1 && (
        <div
          className="player-character"
          style={{
            left: `${charX}px`,
            bottom: `${GROUND_Y}px`,
            width: `${CHARACTER_WIDTH}px`, // 너비 적용
            backgroundImage: `url(${ASSET_PATHS.character})` // 실제 이미지
          }}
        />
      )}

      {/* 대화 상자 (시퀀스 2, 3, 4) */}
      {activeDialogue && (
        <DialogueBox
          key={dialogueIndex} // index 변경 시 리셋
          text={activeDialogue}
          isTyping={isTyping}
          onTypingStart={() => setIsTyping(true)}
          onTypingComplete={() => setIsTyping(false)}
        />
      )}

      {/* 선택지 (시퀀스 4) */}
      {showChoices && (
        <div className="airport-choices-container">
          {AIRPORT_CHOICES.map((choice) => (
            <button
              key={choice.id}
              className="airport-choice-button"
              onClick={() => handleChoiceClick(choice.id)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Airport;