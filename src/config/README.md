# 게임 설정 (Config)

이 폴더는 게임 전반의 설정 값을 관리합니다.

## 📁 파일 구조

### controls.js - 조작 키 설정

모든 게임 조작 키를 중앙에서 관리하는 파일입니다.

#### 사용 가능한 상수

```javascript
import {
  MOVEMENT_KEYS,
  JUMP_KEYS,
  INTERACTION_KEYS,
  isKeyPressed,
  isJumpKey,
  isInteractionKey
} from '../config/controls';
```

#### 현재 조작키 설정

| 기능 | 키 | 상수명 |
|------|-----|--------|
| 왼쪽 이동 | `←`, `A`, `a` | `MOVEMENT_KEYS.LEFT` |
| 오른쪽 이동 | `→`, `D`, `d` | `MOVEMENT_KEYS.RIGHT` |
| 점프 | `↑`, `W`, `w` | `JUMP_KEYS` |
| 상호작용/대화 진행 | `Space`, `Enter` | `INTERACTION_KEYS` |

---

## 🎮 사용 예제

### 1. 기본 사용법

```javascript
import { MOVEMENT_KEYS, JUMP_KEYS, INTERACTION_KEYS } from '../config/controls';

const handleKeyDown = (e) => {
  // 왼쪽 이동
  if (MOVEMENT_KEYS.LEFT.includes(e.key)) {
    moveLeft();
  }

  // 오른쪽 이동
  if (MOVEMENT_KEYS.RIGHT.includes(e.key)) {
    moveRight();
  }

  // 점프
  if (JUMP_KEYS.includes(e.key)) {
    jump();
  }

  // 상호작용
  if (INTERACTION_KEYS.includes(e.key)) {
    interact();
  }
};
```

### 2. 헬퍼 함수 사용

```javascript
import { isJumpKey, isInteractionKey, isKeyPressed, MOVEMENT_KEYS } from '../config/controls';

const handleKeyDown = (e) => {
  // 점프 키 확인
  if (isJumpKey(e)) {
    jump();
  }

  // 상호작용 키 확인
  if (isInteractionKey(e)) {
    interact();
  }

  // 왼쪽 이동 키 확인
  if (isKeyPressed(e, MOVEMENT_KEYS.LEFT)) {
    moveLeft();
  }
};
```

### 3. 연속 이동 방식 (Mountain, ClimbDown, Traveler 스타일)

```javascript
import { MOVEMENT_KEYS } from '../config/controls';

const keysRef = useRef({ left: false, right: false });

useEffect(() => {
  const handleKeyDown = (e) => {
    if (MOVEMENT_KEYS.LEFT.includes(e.key)) {
      if (!keysRef.current.left) keysRef.current.left = true;
    }
    if (MOVEMENT_KEYS.RIGHT.includes(e.key)) {
      if (!keysRef.current.right) keysRef.current.right = true;
    }
  };

  const handleKeyUp = (e) => {
    if (MOVEMENT_KEYS.LEFT.includes(e.key)) {
      keysRef.current.left = false;
    }
    if (MOVEMENT_KEYS.RIGHT.includes(e.key)) {
      keysRef.current.right = false;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);
```

### 4. 상호작용 키 (Space/Enter)

```javascript
import { isInteractionKey } from '../config/controls';

useEffect(() => {
  const handleKeyDown = (e) => {
    if (isInteractionKey(e)) {
      // 타이핑 중이면 스킵
      if (isTyping) {
        skipTyping();
        return;
      }
      // 다음 대화로
      nextDialogue();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isTyping]);
```

---

## 🔧 조작키 변경 방법

조작키를 변경하려면 `controls.js` 파일만 수정하면 됩니다.

### 예: 왼쪽 이동에 Q 키 추가

```javascript
// controls.js
export const MOVEMENT_KEYS = {
  LEFT: ['ArrowLeft', 'a', 'A', 'q', 'Q'],  // Q 키 추가
  RIGHT: ['ArrowRight', 'd', 'D'],
};
```

### 예: 점프에 스페이스바 추가

```javascript
// controls.js
export const JUMP_KEYS = ['ArrowUp', 'w', 'W', ' '];  // 스페이스바 추가
```

---

## ⚠️ 주의사항

1. **키 중복 방지**: 다른 기능에 같은 키를 할당하지 마세요.
2. **대소문자 구분**: 키는 대소문자를 구분합니다 (`'a'`와 `'A'`는 다름).
3. **특수 키**: Space는 `' '`, Enter는 `'Enter'`로 표기합니다.
4. **일관성 유지**: 모든 씬에서 이 파일의 설정을 사용하세요.

---

## 🚀 마이그레이션 가이드

기존 코드를 `controls.js`를 사용하도록 변경하기:

### Before (변경 전)
```javascript
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
  moveLeft();
}
```

### After (변경 후)
```javascript
import { MOVEMENT_KEYS } from '../config/controls';

if (MOVEMENT_KEYS.LEFT.includes(e.key)) {
  moveLeft();
}
```

또는 헬퍼 함수 사용:
```javascript
import { isKeyPressed, MOVEMENT_KEYS } from '../config/controls';

if (isKeyPressed(e, MOVEMENT_KEYS.LEFT)) {
  moveLeft();
}
```

---

## 📚 관련 문서

- [조작법 가이드](../../CONTROLS.md) - 플레이어용 조작 안내
- [Hook 문서](../hooks/README.md) - 이동/점프 훅 사용법
