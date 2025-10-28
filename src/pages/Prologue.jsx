import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import './Prologue.css'; // 프롤로그 전용 CSS

// --- 애셋 임포트 (Airport.jsx와 동일한 배경 사용 가정) ---
import homebg from '../assets/bg/1_프롤로그_집.svg';
// (캐릭터 애셋이 있다면 여기에 임포트)
import playerSprite from '../assets/char/편한옷_주인공1.svg';
import playerSprite2 from '../assets/char/기본_주인공1.svg';
import statusUI from '../assets/obj/상태창.svg';
import book from '../assets/obj/책.svg';
import ticket from '../assets/obj/티켓.svg';

const nickname = sessionStorage.getItem("NICKNAME") || "player";
// --- 대사 및 선택지 설정 ---
// (수정 1: undefined 문제) 각 문자열 앞의 보이지 않는 공백( )을 모두 제거했습니다.
const PROLOGUE_DIALOGUES = [
  `할 짓 없이 보내고 있는 ${nickname}.\n오늘도 할 짓 없이 잠에서 깬다. `,"잠에서 깨자 머리가 깨질 듯이 아프며\n하나의 목소리가 들린다.","찾아...","찾아!!!!","잘못 들었다고 생각하며\n대수롭지 않게 여기며\n다시 잠에 들려고 한다.","누구지?"
];

// --- 상수 ---

function Prologue() {
  const [sequenceStep, setSequenceStep] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeDialogue, setActiveDialogue] = useState(PROLOGUE_DIALOGUES[0]);
  const [isTyping, setIsTyping] = useState(false);

  const [objectStep, setObjectStep] = useState(0); // 0: 없음, 1: 책, 2: 티켓
  const [playerX, setPlayerX] = useState(0);
  const [canMove, setCanMove] = useState(false);
  // ⭐ 화면 너비 상태 추가
  const [gameAreaWidth, setGameAreaWidth] = useState(0); 

  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  // --- 책 → 티켓 → 이동 활성화 로직 ---
  const handleObjectSceneAdvance = useCallback(() => {
    if (canMove) return;

    if (objectStep === 1) {
      // 책 -> 티켓
      setObjectStep(2);
    } else if (objectStep === 2) {
      // 티켓 -> 이동 활성화
      setObjectStep(0); // 오브젝트 숨김
      setCanMove(true); // 이동 활성화
    }
  }, [objectStep, canMove]);

  // --- 대사 진행 (대화 단계에서만 사용) ---
  const handleDialogueAdvance = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    const nextIndex = dialogueIndex + 1;
    if (nextIndex < PROLOGUE_DIALOGUES.length) {
      setDialogueIndex(nextIndex);
      setActiveDialogue(PROLOGUE_DIALOGUES[nextIndex]);

      if (nextIndex === 4) setSequenceStep(1);
      if (nextIndex === 5) setSequenceStep(2);
    } else {
      // 마지막 대사 후
      setSequenceStep(3); // 오브젝트 단계로 전환 (대화 상자 숨김)
      setObjectStep(1); // 책 등장
    }
  }, [dialogueIndex, isTyping]);
    
  // --- 메인 상호작용 핸들러 (클릭, 스페이스바) ---
  const handleInteraction = useCallback(() => {
    if (sequenceStep < 3) {
      // 0, 1, 2 단계: 대화 진행
      handleDialogueAdvance();
    } else if (sequenceStep === 3) {
      // 3단계: 오브젝트 씬 진행
      handleObjectSceneAdvance();
    }
  }, [sequenceStep, handleDialogueAdvance, handleObjectSceneAdvance]);

  // --- 화면 너비 측정 (ResizeObserver) ---
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            setGameAreaWidth(entry.contentRect.width);
        }
    });

    observer.observe(gameArea);
    return () => {
        observer.unobserve(gameArea);
    };
  }, []);

  // --- 키보드 입력 ---
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    gameArea.focus();

    const handleKeyDown = (e) => {
      if (e.key === ' ' && !canMove) { // 이동 상태가 아닐 때만 스페이스바 상호작용
        e.preventDefault();
        handleInteraction(); 
      }

      // 이동
      if (canMove) {
          const step = 10;
          const maxMove = (gameAreaWidth - 100) - (gameAreaWidth * 0.1);

        if (e.key === 'ArrowRight') setPlayerX((x) => Math.min(x + step, maxMove));
        if (e.key === 'ArrowLeft') setPlayerX((x) => Math.max(x - step, 0)); // 최소 0 (중앙)
      }
    };

    gameArea.addEventListener('keydown', handleKeyDown);
    return () => gameArea.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction, canMove, gameAreaWidth]); // gameAreaWidth 의존성 추가

  // --- 이동 감지: 우측 끝 도달 ---
  useEffect(() => {
    // ⭐ 오른쪽 끝 도달 조건: threshold (gameAreaWidth / 2 - 100)
    const threshold = (gameAreaWidth - 100) - (gameAreaWidth * 0.1);
    
    if (canMove && gameAreaWidth > 0 && playerX >= threshold) {
      navigate('/airport');
    }
    // playerX가 0보다 작아지지 않도록 추가적인 제한
    if (playerX < 0) {
        setPlayerX(0);
    }
    
  }, [playerX, canMove, navigate, gameAreaWidth]);

  return (
    <div
      ref={gameAreaRef}
      tabIndex="0"
      className="prologue-container"
      data-sequence={sequenceStep}
      onClick={!canMove ? handleInteraction : undefined} 
    >
      {/* 배경 */}
      <div
        className="prologue-game-area"
        style={{
          backgroundImage: `url(${homebg})`,
          opacity: sequenceStep >= 1 ? 1 : 0,
          transition: 'opacity 1s ease'
        }}
      />

      {/* 검은 오버레이 */}
      <div
        className="prologue-black-overlay"
        style={{
          opacity: sequenceStep === 0 ? 1 : 0,
          transition: 'opacity 1s ease'
        }}
      />

      {/* 캐릭터 */}
      {sequenceStep >= 1 && (
        <div
          className="prologue-player-character"
          style={{
            backgroundImage: `url(${sequenceStep >= 2 ? playerSprite2 : playerSprite})`,
            bottom: '10px',
            // playerX가 0일 때 중앙, 양수일 때 오른쪽으로 이동
            left: `calc(10% + ${playerX}px)` 
          }}
        />
      )}

      {/* 대화 상자 */}
      {sequenceStep < 3 && activeDialogue && (
        <DialogueBox
          key={dialogueIndex}
          text={activeDialogue}
          isTyping={isTyping}
          onTypingStart={() => setIsTyping(true)}
          onTypingComplete={() => setIsTyping(false)}
        />
      )}

      {/* 오브젝트 + 상태창 */}
      {sequenceStep === 3 && objectStep > 0 && (
        <div className="prologue-object-scene"> 
          <div className="prologue-status-ui">
            <img src={statusUI} alt="status-ui" className="status-ui" />
            <img
              key={objectStep} 
              src={objectStep === 1 ? book : ticket}
              alt="object"
              className="prologue-object"
            />
            <div className="status-text">
              {objectStep === 1
                ? '낡은 일기장이다. 누군가의 기록이 남아있다...'
                : '이건... 항공 티켓? 어디로 가야 하는 거지?'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prologue;