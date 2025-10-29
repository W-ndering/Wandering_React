import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import './Walk.css'; // 공통 씬 CSS

// (애셋 임포트)
import restBg from '../assets/bg/6_1_3번선택지_길거리.svg'; // 예시 경로
import mainChar from '../assets/char/기본_주인공2.svg';

const DIALOGUES = [
    {
    speaker: null,
    dialogue: [{ type: 'normal', content: "무작정 걸으니,\n아름다운 도시의 풍경이 눈에 들어온다." }]
  },
  // 5: 독백
  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "최근에 이렇게\n마음이 편했던 적이 있었나?" }]
  }
];
const GROUND_Y = 80;
const CHARACTER_WIDTH = 100;

function Walk() {
  const [charX, setCharX] = useState(0);
  const [sequenceStep, setSequenceStep] = useState(0); // 0: 이동, 1: 대사1, 2: 대사2
  
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeDialogue, setActiveDialogue] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  // (이 씬의 전용 이동 로직)
  const handleMove = (e) => {
    if (sequenceStep !== 0) return; // 이동 단계가 아니면 무시

    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      setCharX((prevX) => {
        const newX = prevX + 15;
        // (트리거 예시) 특정 X좌표 도달 시 대화 시작
        if (newX > 500) {
          setSequenceStep(1); // 대화 1단계로
          setActiveDialogue(DIALOGUES[0]);
          return 500; // 위치 고정
        }
        return newX;
      });
    }
    // ... (ArrowLeft)
  };

  const handleInteraction = useCallback(() => {
    if (sequenceStep === 0) return; // 이동 단계면 무시

    if (isTyping) {
      setIsTyping(false);
      return;
    }

    const nextIndex = dialogueIndex + 1;
    if (nextIndex < DIALOGUES.length) {
      setIsTyping(true);
      setDialogueIndex(nextIndex);
      setActiveDialogue(DIALOGUES[nextIndex]);
      setSequenceStep(2); // 대화 2단계로
    } else {
      // 대사 끝나면
      navigate('/next'); // 다음 스테이지
    }
  }, [dialogueIndex, isTyping, navigate, sequenceStep]);

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    gameArea.focus();

    const handleKeyDown = (e) => {
      handleMove(e); // 이동 처리
      if (e.key === ' ') {
        e.preventDefault();
        handleInteraction(); // 대화 처리
      }
    };
    gameArea.addEventListener('keydown', handleKeyDown);
    return () => gameArea.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction, handleMove]); // handleMove 추가

  return (
    <div
      ref={gameAreaRef}
      tabIndex="0"
      className="scene-container"
      style={{ backgroundImage: `url(${restBg})` }}
      onClick={handleInteraction}
    >
      <div
        className="player-character" // (공통 CSS 필요)
        style={{
          left: `${charX}px`,
          bottom: `${GROUND_Y}px`,
          width: `${CHARACTER_WIDTH}px`,
          backgroundImage: `url(${mainChar})`
        }}
      />
      
      {activeDialogue && (
        <DialogueBox
          key={dialogueIndex}
          // (수정!) 'text' prop 대신 'dialogue'와 'speaker' prop을 전달합니다.
          dialogue={activeDialogue.dialogue}
          speaker={activeDialogue.speaker}
          isTyping={isTyping}
          onTypingStart={() => setIsTyping(true)}
          onTypingComplete={() => setIsTyping(false)}
        />
      )}
    </div>
  );
}

export default Walk;
