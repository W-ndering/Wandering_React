import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import styles from'./Reminiscene.module.css'; // 공통 씬 CSS

// --- 대사 설정 ---
// (수정) 중간에 null을 넣어 텍스트박스가 없는 씬을 구현합니다.
const DIALOGUES = [
    /*{
    speaker: '???',
    dialogue: [{ type: 'normal', content: "자기는\n나랑 산에서 조난되면 어떨 것 같아?" }]
  },
    {
    speaker: null,
    dialogue: [{ type: 'normal', content: "글쎄. 아마 죽지 않을까?" }]
  },
    {
    speaker: '???',
    dialogue: [{ type: 'normal', content: "자기야...그런 무서운 대답 말고" }]
  },  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "하하, 장난이야." }]
  },
    {
    speaker: null,
    dialogue: [{ type: 'normal', content: "갑자기 이런 순간에\n이런 게 왜 떠오르는지." }]
  },
    {
    speaker: null,
    dialogue: [{ type: 'normal', content: "죽을 때가 되어서 주마등이 스치는 건가." }]
  },  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "6개월 전 헤어진 애인 생각이 난다." }]
  },  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "결혼 이야기가 오갔던 사이었지만,\n내 미래가 불안정했던 탓에\n이별을 고할 수 밖에 없었다." }]
  },  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "보고싶어" }]
  },*/
  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "스르륵 눈이 감긴다." }]
  },
    {
    speaker: null,
    dialogue: [{ type: 'normal', content: "..." }]
  },  
  {
    speaker: null,
    dialogue: [{ type: 'normal', content: "으음.. 맛있는 냄새 ..." }]
  }, {
    speaker: null,
    dialogue: [{ type: 'normal', content: "맛있는 냄새?" }]
  }, {
    speaker: null,
    dialogue: [{ type: 'normal', content: "난 방금 전까지 산에 조난되어\n곧 죽을 위기에 처해 있지 않았나?" }]
  }, {
    speaker: null,
    dialogue: [{ type: 'normal', content: "내가 천국에 온 건가?" }]
  }, {
    speaker: '어머니',
    dialogue: [{ type: 'normal', content: "아들! 얼른 일어나서 밥 먹어.\n학교 가야지!" }]
  }, {
    speaker: null,
    dialogue: [{ type: 'normal', content: "아 안 먹는다고 했잖아!!" }]
  },{
    speaker: null,
    dialogue: [{ type: 'normal', content: "혼자 밥을 먹으며 외로이 보냈던 터라,\n어머니가 해 주는 밥이\n무의식중에 그리웠던 것 같다." }]
  }, {
    speaker: null,
    dialogue: [{ type: 'normal', content: "어머니...\n며칠 전에 다리가 아프다고 하셨었는데.\n괜찮으시려나?" }]
  }, {
    speaker: null,
    dialogue: [{ type: 'normal', content: "돌아가면 찾아 뵈어야 겠다는 생각이 든다." }]
  }
];

function Reminiscene() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  // (수정) activeDialogue는 텍스트이거나 null일 수 있습니다.
  const [activeDialogue, setActiveDialogue] = useState(DIALOGUES[0]);
  const [isTyping, setIsTyping] = useState(false);
  
  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  const handleInteraction = useCallback(() => {
    // 텍스트가 타이핑 중이면 스킵
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    // 다음 대사로
    const nextIndex = dialogueIndex + 1;

    if (nextIndex < DIALOGUES.length) {
      const nextDialogue = DIALOGUES[nextIndex];
      
      // (수정) 텍스트가 null이 아니면 타이핑 시작
      if (nextDialogue !== null) {
        setIsTyping(true); 
      }
      
      setDialogueIndex(nextIndex);
      setActiveDialogue(nextDialogue);
    } else {
      // (수정) 모든 대사가 끝나면 내비게이팅
      navigate('/cabinindoor'); // 예시: 다음 스테이지로
    }
  }, [dialogueIndex, isTyping, navigate]);

  // 키보드 입력 (스페이스바) 및 화면 클릭
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
      className={styles.scenecontainer}
      // (수정) backgroundImage를 설정하지 않아 Scene.css의 기본 #000 배경색이 나옴
      onClick={handleInteraction}
    >
      {/* (수정) activeDialogue가 null이 아닐 때만 DialogueBox를 렌더링 */}
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

export default Reminiscene;
