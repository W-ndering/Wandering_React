import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import './Rest.css'; // 공통 씬 CSS (신규)

// (애셋 임포트)
import infoBg from '../assets/bg/5_1_2번선택지_호텔.svg'; // 예시 경로

const DIALOGUES = [
  "관광지에 오니 여행 온 기분이 든다.",
  // (대사 끝 -> 다음 씬으로)
];

function Rest() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeDialogue, setActiveDialogue] = useState(DIALOGUES[0]);
  const [isTyping, setIsTyping] = useState(false);
  
  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  const handleInteraction = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    const nextIndex = dialogueIndex + 1;
    if (nextIndex < DIALOGUES.length) {
      setIsTyping(true);
      setDialogueIndex(nextIndex);
      setActiveDialogue(DIALOGUES[nextIndex]);
    } else {
      // 대사가 끝나면 다음 씬으로 이동
      navigate('/next'); // 예시: 다음 스테이지
    }
  }, [dialogueIndex, isTyping, navigate]);

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    gameArea.focus();

    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        handleInteraction();
      }
    };
    gameArea.addEventListener('keydown', handleKeyDown);
    return () => gameArea.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction]);

  return (
    <div
      ref={gameAreaRef}
      tabIndex="0"
      className="scene-container" // 공통 CSS 사용
      style={{ backgroundImage: `url(${infoBg})` }}
      onClick={handleInteraction}
    >
      {activeDialogue && (
        <DialogueBox
          key={dialogueIndex}
          text={activeDialogue}
          isTyping={isTyping}
          onTypingStart={() => setIsTyping(true)}
          onTypingComplete={() => setIsTyping(false)}
        />
      )}
    </div>
  );
}

export default Rest;
