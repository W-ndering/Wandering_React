# Custom Hooks 사용 가이드

프로젝트에서 사용할 수 있는 재사용 가능한 커스텀 훅 모음입니다.

## 📦 Available Hooks

### 1. useMovement - 캐릭터 이동 제어

캐릭터의 좌우 이동을 관리하는 훅입니다.

#### 지원 키

- **좌우 이동**
  - `←` (왼쪽 화살표) 또는 `A` 키 - 왼쪽 이동
  - `→` (오른쪽 화살표) 또는 `D` 키 - 오른쪽 이동

#### 기본 사용법

```javascript
import { useState, useEffect, useRef } from 'react';
import { useMovement } from '../hooks/useMovement';

function MyScene() {
  const [charX, setCharX] = useState(100);

  // 이동 훅 초기화
  const { getVelocity } = useMovement({
    speed: 500,    // 이동 속도 (pixels/second)
    minX: 0,       // 왼쪽 경계
    maxX: 2160     // 오른쪽 경계
  });

  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  // 이동 루프
  useEffect(() => {
    lastTimeRef.current = null;

    moveTimerRef.current = setInterval(() => {
      const now = performance.now();
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now;
        return;
      }

      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const velocity = getVelocity(dt);
      if (velocity !== 0) {
        setCharX(x => Math.max(0, Math.min(2160, x + velocity)));
      }
    }, 16); // ~60 FPS

    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
      }
    };
  }, [getVelocity]);

  return (
    <div className={styles.character} style={{ left: `${charX}px` }} />
  );
}
```

#### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `speed` | number | 500 | 이동 속도 (pixels/second) |
| `minX` | number | 0 | 최소 X 좌표 (왼쪽 경계) |
| `maxX` | number | 2560 | 최대 X 좌표 (오른쪽 경계) |
| `enabled` | boolean | true | 이동 활성화 여부 |

#### 반환값

| 속성 | 타입 | 설명 |
|------|------|------|
| `keysRef` | RefObject | 현재 눌린 키 상태 `{ left: boolean, right: boolean }` |
| `getMovementDirection` | Function | 현재 이동 방향 반환 (-1: 왼쪽, 0: 정지, 1: 오른쪽) |
| `getVelocity` | Function | deltaTime을 받아 이동 거리 계산 |
| `getClampedPosition` | Function | 경계를 고려한 새 좌표 계산 |
| `cleanup` | Function | 이벤트 리스너 정리 |

---

### 2. useJump - 캐릭터 점프 제어

캐릭터의 점프 기능을 관리하는 훅입니다.

#### 지원 키

- `↑` (위쪽 화살표) 또는 `W` 키 - 점프

#### 기본 사용법

```javascript
import { useState } from 'react';
import { useJump } from '../hooks/useJump';

function MyScene() {
  const [charX, setCharX] = useState(100);

  // 점프 훅 초기화
  const { charY, isJumping, jump } = useJump({
    groundLevel: 0,       // 지면 레벨
    gravity: 1500,        // 중력 (pixels/second²)
    jumpVelocity: 600     // 점프 초기 속도
  });

  // 키 입력 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div
      className={styles.character}
      style={{
        left: `${charX}px`,
        bottom: `${65 - charY}px`  // charY를 bottom에서 빼기
      }}
    />
  );
}
```

#### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `gravity` | number | 1500 | 중력 (pixels/second²) |
| `jumpVelocity` | number | 600 | 점프 초기 속도 (pixels/second) |
| `groundLevel` | number | 0 | 지면 레벨 (Y 좌표) |

#### 반환값

| 속성 | 타입 | 설명 |
|------|------|------|
| `charY` | number | 현재 Y 좌표 (지면으로부터의 높이) |
| `isJumping` | boolean | 점프 중인지 여부 |
| `jump` | Function | 점프 실행 함수 |
| `resetJump` | Function | 점프 상태 초기화 |

---

## 🎮 완전한 예제 (이동 + 점프)

```javascript
import { useState, useEffect, useRef } from 'react';
import { useMovement } from '../hooks/useMovement';
import { useJump } from '../hooks/useJump';
import styles from './MyScene.module.css';

function MyScene() {
  const [charX, setCharX] = useState(100);

  // 이동 제어
  const { getVelocity } = useMovement({
    speed: 500,
    minX: 0,
    maxX: 2160
  });

  // 점프 제어
  const { charY, jump } = useJump({ groundLevel: 0 });

  const moveTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  // 점프 키 입력
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // 이동 루프
  useEffect(() => {
    lastTimeRef.current = null;

    moveTimerRef.current = setInterval(() => {
      const now = performance.now();
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now;
        return;
      }

      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const velocity = getVelocity(dt);
      if (velocity !== 0) {
        setCharX(x => Math.max(0, Math.min(2160, x + velocity)));
      }
    }, 16);

    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
      }
    };
  }, [getVelocity]);

  return (
    <div className={styles.viewport}>
      <div className={styles.stage}>
        <div
          className={styles.character}
          style={{
            position: 'absolute',
            left: `${charX}px`,
            bottom: `${65 - charY}px`
          }}
        />
      </div>
    </div>
  );
}

export default MyScene;
```

---

## 🔧 고급 사용법

### 특정 조건에서만 이동 활성화

```javascript
function MyScene() {
  const [isDialogueActive, setIsDialogueActive] = useState(false);
  const [charX, setCharX] = useState(100);

  // 대화 중에는 이동 비활성화
  const { getVelocity } = useMovement({
    speed: 500,
    enabled: !isDialogueActive  // 대화 중이 아닐 때만 이동 가능
  });

  // ... 이동 로직
}
```

### 커스텀 경계 처리

```javascript
function MyScene() {
  const [charX, setCharX] = useState(100);
  const { getClampedPosition, getVelocity } = useMovement({
    speed: 500,
    minX: 50,    // 커스텀 왼쪽 경계
    maxX: 2000   // 커스텀 오른쪽 경계
  });

  useEffect(() => {
    const moveTimer = setInterval(() => {
      const dt = 0.016; // 약 60 FPS
      const velocity = getVelocity(dt);

      if (velocity !== 0) {
        setCharX(x => getClampedPosition(x, velocity));
      }
    }, 16);

    return () => clearInterval(moveTimer);
  }, [getVelocity, getClampedPosition]);

  // ... 렌더링
}
```

---

## 📝 주요 조작키 정리

| 기능 | 키 |
|------|-----|
| 왼쪽 이동 | `←` 또는 `A` |
| 오른쪽 이동 | `→` 또는 `D` |
| 점프 | `↑` 또는 `W` |
| 상호작용/대화 진행 | `Space` 또는 `Enter` |

---

## 💡 팁

1. **이동 속도 조정**: `speed` 값을 변경하여 캐릭터 이동 속도를 조절할 수 있습니다.
2. **점프 높이 조정**: `jumpVelocity`를 높이면 더 높이 점프합니다.
3. **중력 조정**: `gravity` 값을 낮추면 느리게 떨어집니다.
4. **경계 설정**: `minX`, `maxX`로 캐릭터가 이동할 수 있는 범위를 제한할 수 있습니다.

---

## 🐛 문제 해결

### 이동이 작동하지 않을 때
- `enabled` 옵션이 `true`인지 확인
- 다른 컴포넌트에서 같은 키 이벤트를 가로채고 있지 않은지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 점프가 작동하지 않을 때
- `jump()` 함수가 키 이벤트 핸들러에 제대로 연결되어 있는지 확인
- `charY` 값이 렌더링에 제대로 반영되고 있는지 확인
- `bottom` 스타일에서 `charY`를 빼는 것을 잊지 마세요 (`bottom: ${65 - charY}px`)

---

## 📚 추가 자료

- [React Hooks 공식 문서](https://react.dev/reference/react)
- [requestAnimationFrame MDN](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Keyboard Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
