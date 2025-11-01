import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import styles from './Prologue.module.css'; // 프롤로그 전용 CSS

// --- 애셋 임포트 (Airport.jsx와 동일한 배경 사용 가정) ---
import homebg from '../assets/bg/1_프롤로그_집.svg';
// (캐릭터 애셋이 있다면 여기에 임포트)
import playerSprite from '../assets/char/편한옷_주인공1.svg';
import playerSprite2 from '../assets/char/기본_주인공1.svg';
import statusUI from '../assets/obj/상태창.svg';
import book from '../assets/obj/책.svg';
import ticket from '../assets/obj/티켓.svg';



// --- 상수 ---

function Prologue() {
  const nickname = sessionStorage.getItem("NICKNAME") || "player";
  const PROLOGUE_DIALOGUES = [
  // 0
  {
    speaker: null,
    overlay: true,
    dialogue: [{ type: 'normal', content: `할 짓 없이 보내고 있는 ${nickname}.\n오늘도 할 짓 없이 잠에서 깬다. ` }]
  },
  // 1
  {
    speaker: null,
    overlay: true,
    dialogue: [{ type: 'normal', content: "잠에서 깨자 머리가 깨질 듯이 아프며\n하나의 목소리가 들린다." }]
  },
  // 2
  {
    speaker: null,
    overlay: true,
    dialogue: [{ type: 'small-color', content: "찾아..." }]
  },
  // 3 (잘못~~) — 밝게 (오버레이 해제)
  {
    speaker: null,
    overlay: false,   // <-- 여기: 밝게
    dialogue: [{ type: 'normal', content: "잘못 들었다고 생각하며\n대수롭지 않게 여기며\n다시 잠에 들려고 한다." }]
  },
  // 4 (목소리: 찾아!!!!) — 어둡게
  {
    speaker: '목소리',
    overlay: true,    // <-- 여기: 어둡게
    dialogue: [{ type: 'large', content: "찾아!!!!" }]
  },
  // 5 (누구지?) — 밝게
  {
    speaker: null,
    overlay: false,   // <-- 여기: 밝게
    dialogue: [{ type: 'normal', content: "누구지?" }]
  }
];

  const [sequenceStep, setSequenceStep] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  //const [activeDialogue, setActiveDialogue] = useState(PROLOGUE_DIALOGUES[0]);
  const currentDialogue = PROLOGUE_DIALOGUES[dialogueIndex];
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

    // ⭐ [수정] 배경(sequenceStep: 1)을 대화 시작(index 1)과 함께 켠다.
    //    오버레이가 걷힐 때(index 3) 배경이 보이도록.
    if (nextIndex === 1) setSequenceStep(1); 
    
    // ⭐ [수정] 캐릭터 교체(sequenceStep: 2)는 index 5에서 수행
    if (nextIndex === 5) setSequenceStep(2);

    // [제거] 아래 두 줄은 위 로직으로 대체되었으므로 제거합니다.
    // if (nextIndex === 4) setSequenceStep(1);
    // if (nextIndex === 5) setSequenceStep(2);
  } else {
    setSequenceStep(3);
    setObjectStep(1);
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
    const threshold = (gameAreaWidth - 100) - (gameAreaWidth * 0.1)-200;

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
      className={styles.prologuecontainer}
      data-sequence={sequenceStep}
      onClick={!canMove ? handleInteraction : undefined}
    >
      {/* 배경 */}
      <div
        className={styles.prologuegamearea}
        style={{
          backgroundImage: `url(${homebg})`,
          opacity: sequenceStep >= 1 ? 1 : 0,
          transition: 'opacity 1s ease'
        }}
      />

<div
  className={styles.prologueblackoverlay}
  style={{
    // ⭐ [수정] 복잡한 삼항 연산자 대신, 
    // PROLOGUE_DIALOGUES에 정의된 overlay 값을 직접 사용합니다.
    opacity: currentDialogue.overlay ? 1 : 0,
    transition: 'none',
  }}
/>

      {/* 캐릭터 */}
      {sequenceStep >= 1 && (
        <div
          className={styles.prologueplayercharacter}
          style={{
            backgroundImage: `url(${sequenceStep >= 2 ? playerSprite2 : playerSprite})`,
            bottom: '10px',
            // playerX가 0일 때 중앙, 양수일 때 오른쪽으로 이동
            left: `calc(10% + ${playerX}px)`
          }}
        />
      )}

{/* 대화 상자 */}
{sequenceStep < 3 && currentDialogue && (
  <DialogueBox
    key={dialogueIndex}
    dialogue={currentDialogue.dialogue}
    speaker={currentDialogue.speaker}
    isTyping={isTyping}
    onTypingStart={() => setIsTyping(true)}
    onTypingComplete={() => setIsTyping(false)}
  />
)}

      {/* 오브젝트 + 상태창 */}
      {sequenceStep === 3 && objectStep > 0 && (
        <div className={styles.prologueobjectscene}>
          <div className={styles.prologuestatusui}>
            <img src={statusUI} alt="status-ui" className={styles.statusui} />
            {/* (수정) 래퍼 div 추가: 오브젝트와 텍스트를 감싸서 absolute 위치 지정 */}
            <div>
              <img
                key={objectStep}
                src={objectStep === 1 ? book : ticket}
                alt="object"
                className={styles.prologueobject}
              />
              {/* (추가) 오브젝트 이름 텍스트 */}
              <div className={styles.statusobjectname}>
                {objectStep === 1 ? '낯선 책' : '비행기 티켓'}
              </div>
              <div className={styles.statustext}>
                {objectStep === 1
                  ? '책에 무언가가 끼워져있다.'
                  : '책에 끼워져 있었다.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prologue;

