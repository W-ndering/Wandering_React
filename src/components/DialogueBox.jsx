import React, { useState, useEffect, useRef } from 'react';
import './DialogueBox.css'; // DialogueBox 전용 CSS 임포트
import textbox from '../assets/obj/text_box.svg';

const TYPING_SPEED = 50;

function DialogueBox({ text, isTyping, onTypingStart, onTypingComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef(null);

  // 실제 텍스트박스 이미지 경로 (준비된 asset으로 교체)
  const TEXTBOX_IMAGE_URL = textbox;

  useEffect(() => {
    onTypingStart();
    setDisplayedText('');

    let charIndex = 0;

    intervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText((prev) => prev + text[charIndex]);
        charIndex++;
      } else {
        clearInterval(intervalRef.current);
        onTypingComplete();
      }
    }, TYPING_SPEED);

    return () => clearInterval(intervalRef.current);
  }, [text, onTypingStart, onTypingComplete]);

  // (5) 스페이스바/클릭으로 인한 타이핑 스킵 로직
  useEffect(() => {
    if (!isTyping) {
      clearInterval(intervalRef.current);
      setDisplayedText(text);
    }
  }, [isTyping, text]);

  return (
    <div
      className="dialogue-box-container"
      style={{ backgroundImage: `url(${TEXTBOX_IMAGE_URL})` }}
    >
      <p className="dialogue-text">
        {displayedText}
        {isTyping && <span className="typing-cursor"></span>}
      </p>
    </div>
  );
}

export default DialogueBox;
