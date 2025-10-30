import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import styles from './View.module.css'; // 공통 씬 CSS (신규)

// (애셋 임포트)
import infoBg from '../assets/bg/4_1_1번선택지_유명관광지.svg'; // 예시 경로

const DIALOGUES = [
    {
    speaker: null,
    dialogue: [{ type: 'normal', content: "관광지에 오니 여행 온 기분이 든다." }]
  }
  // (대사 끝 -> 다음 씬으로)
];

function View() {
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
      className={styles.scenecontainer} // 공통 CSS 사용
      style={{ backgroundImage: `url(${infoBg})` }}
      onClick={handleInteraction}
    >
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

export default View;
