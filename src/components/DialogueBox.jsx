import React, { useState, useEffect, useRef } from 'react';
import './DialogueBox.css';
import textbox from '../assets/obj/text_box.svg';

const TYPING_SPEED = 50;

function DialogueBox({ text, isTyping, onTypingStart, onTypingComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef(null);
  const TEXTBOX_IMAGE_URL = textbox;

  useEffect(() => {
    if (!text) return; // undefined 방지
    setDisplayedText('');
    onTypingStart?.(); // (선택적 호출) 부모가 함수 넘긴 경우만

    let charIndex = 0;
    intervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText((prev) => prev + text[charIndex]);
        charIndex++;
      } else {
        clearInterval(intervalRef.current);
        onTypingComplete?.();
      }
    }, TYPING_SPEED);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  // (타이핑 스킵 로직)
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
