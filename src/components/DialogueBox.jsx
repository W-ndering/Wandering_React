import React, { useState, useEffect, useRef } from 'react';
import './DialogueBox.css';
import textbox from '../assets/obj/text_box.svg';

const TYPING_SPEED = 50;

/**
 * DialogueBox 컴포넌트
 * @param {object} props
 * @param {Array<object>} props.dialogue - 대사 세그먼트 배열. 예: [{ type: 'normal', content: '안녕' }, { type: 'large', content: '!' }]
 * @param {string} [props.speaker] - (선택) 화자 이름. "주인공", "연인" 등. 없으면 독백.
 * @param {boolean} props.isTyping - 현재 타이핑 중인지 여부 (부모 컴포넌트에서 제어)
 * @param {Function} [props.onTypingStart] - (선택) 타이핑 시작 시 호출될 콜백
 * @param {Function} [props.onTypingComplete] - (선택) 타이핑 완료 시 호출될 콜백
 */
function DialogueBox({ dialogue, speaker, isTyping, onTypingStart, onTypingComplete }) {
  // 표시될 대사 세그먼트 배열
  const [displayedSegments, setDisplayedSegments] = useState([]);
  
  const intervalRef = useRef(null);
  const segmentIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  
  const TEXTBOX_IMAGE_URL = textbox;

  // 타이핑 로직
  useEffect(() => {
    // dialogue가 배열이 아니거나 비어있으면 실행 중지
    if (!Array.isArray(dialogue) || dialogue.length === 0) {
      setDisplayedSegments([]);
      return;
    }
    
    setDisplayedSegments([]);
    onTypingStart?.();

    segmentIndexRef.current = 0;
    charIndexRef.current = 0;

    intervalRef.current = setInterval(() => {
      let segIdx = segmentIndexRef.current;
      let charIdx = charIndexRef.current;
      const currentSegment = dialogue[segIdx];

      // 모든 세그먼트가 완료된 경우
      if (!currentSegment) {
        clearInterval(intervalRef.current);
        onTypingComplete?.();
        return;
      }

      const currentChar = currentSegment.content[charIdx];

      // 현재 문자를 기반으로 displayedSegments 상태 업데이트
      setDisplayedSegments((prevSegments) => {
        const newSegments = [...prevSegments];
        
        if (charIdx === 0) {
          // 새 세그먼트 시작
          newSegments.push({ type: currentSegment.type, content: currentChar });
        } else {
          // 기존 세그먼트에 문자 추가
          const lastSegment = newSegments[newSegments.length - 1];
          newSegments[newSegments.length - 1] = {
            ...lastSegment,
            content: lastSegment.content + currentChar,
          };
        }
        return newSegments;
      });

      // 다음 인덱스로 이동
      if (charIdx + 1 >= currentSegment.content.length) {
        // 다음 세그먼트로 이동
        segmentIndexRef.current += 1;
        charIndexRef.current = 0;
      } else {
        // 다음 문자로 이동
        charIndexRef.current += 1;
      }
    }, TYPING_SPEED);

    return () => clearInterval(intervalRef.current);
  // dialogue가 변경될 때마다 이 효과를 다시 실행
  }, [dialogue, onTypingStart, onTypingComplete]);

  // (타이핑 스킵 로직)
  useEffect(() => {
    if (!isTyping) {
      clearInterval(intervalRef.current);
      // dialogue가 유효한 배열인지 확인 후 전체 대사 설정
      setDisplayedSegments(Array.isArray(dialogue) ? dialogue : []);
      // 스킵 시에도 타이핑이 완료된 것으로 간주 (원본 로직 개선)
      onTypingComplete?.();
    }
  }, [isTyping, dialogue, onTypingComplete]);

  return (
    <div
      className="dialogue-box-container"
      style={{ backgroundImage: `url(${TEXTBOX_IMAGE_URL})` }}
    >
      {/* 화자 이름 박스 (speaker prop이 있을 때만 렌더링) */}
      {speaker && (
        <div className="speaker-name-box">
          {speaker}
        </div>
      )}

      <p className="dialogue-text">
        {/* displayedSegments 배열을 순회하며 각 세그먼트 렌더링 */}
        {displayedSegments.map((segment, index) => {
          const key = `${index}-${segment.type}`;
          switch (segment.type) {
            case 'small-color':
              return <span key={key} className="dialogue-effect-small">{segment.content}</span>;
            case 'large':
              return <span key={key} className="dialogue-effect-large">{segment.content}</span>;
            default: // 'normal' 또는 정의되지 않은 타입
              return <span key={key}>{segment.content}</span>;
          }
        })}
        
        {/* isTyping이 true일 때만 커서 표시 */}
        {isTyping && <span className="typing-cursor"></span>}
      </p>
    </div>
  );
}

export default DialogueBox;
