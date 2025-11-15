# 🎮 게임 조작법

## 기본 조작키

| 기능 | 키 |
|------|-----|
| **왼쪽 이동** | `←` (왼쪽 화살표) 또는 `A` |
| **오른쪽 이동** | `→` (오른쪽 화살표) 또는 `D` |
| **점프** | `↑` (위쪽 화살표) 또는 `W` |
| **상호작용 / 대화 진행** | `Space` (스페이스바) 또는 `Enter` |
| **선택지 선택** | 마우스 클릭 |

---

## 개발자를 위한 정보

### 사용 가능한 훅

프로젝트에서는 다음 커스텀 훅을 제공합니다:

#### 1. **useMovement** - 캐릭터 좌우 이동 제어
```javascript
import { useMovement } from '../hooks/useMovement';

const { getVelocity } = useMovement({
  speed: 500,    // 이동 속도 (pixels/second)
  minX: 0,       // 왼쪽 경계
  maxX: 2160     // 오른쪽 경계
});
```

**지원 키**: `←`, `→`, `A`, `D`

#### 2. **useJump** - 캐릭터 점프 제어
```javascript
import { useJump } from '../hooks/useJump';

const { charY, jump } = useJump({
  groundLevel: 0,       // 지면 레벨
  gravity: 1500,        // 중력
  jumpVelocity: 600     // 점프 속도
});
```

**지원 키**: `↑`, `W`

---

## 상세 문서

- **[src/hooks/README.md](./src/hooks/README.md)** - 전체 API 문서 및 사용법
- **[src/hooks/EXAMPLES.md](./src/hooks/EXAMPLES.md)** - 실제 코드 예제 모음

---

## 빠른 시작

### 기본 이동 + 점프 구현

```javascript
import { useState, useEffect, useRef } from 'react';
import { useMovement } from '../hooks/useMovement';
import { useJump } from '../hooks/useJump';

function MyScene() {
  const [charX, setCharX] = useState(100);

  // 이동
  const { getVelocity } = useMovement({ speed: 500 });

  // 점프
  const { charY, jump } = useJump({ groundLevel: 0 });

  // 점프 키 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // 이동 루프 (생략 - EXAMPLES.md 참고)

  return (
    <div
      className={styles.character}
      style={{
        left: `${charX}px`,
        bottom: `${65 - charY}px`
      }}
    />
  );
}
```

---

## 기여하기

새로운 조작 기능을 추가하거나 수정할 때는:

1. `src/hooks/` 폴더에 새로운 훅 파일 생성
2. JSDoc 주석으로 상세한 설명 작성
3. `src/hooks/README.md`에 문서 추가
4. `src/hooks/EXAMPLES.md`에 사용 예제 추가
5. 이 파일(`CONTROLS.md`)에 조작키 정보 업데이트

---

**Made with ❤️ for Wandering Game**
