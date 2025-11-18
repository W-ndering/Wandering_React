/**
 * 게임 조작 키 설정
 *
 * 이 파일에서 모든 조작 키를 중앙에서 관리합니다.
 * 키를 변경하려면 이 파일만 수정하면 됩니다.
 */

// 이동 관련 키
export const MOVEMENT_KEYS = {
  LEFT: ['ArrowLeft', 'a', 'A'],
  RIGHT: ['ArrowRight', 'd', 'D'],
};

// 점프 관련 키
export const JUMP_KEYS = ['ArrowUp', 'w', 'W'];

// 상호작용 관련 키 (대화 진행, 텍스트 넘기기 등)
export const INTERACTION_KEYS = [' ', 'Enter'];

// 선택지 관련 (현재는 마우스 클릭만)
export const CHOICE_KEYS = {
  // 추후 필요 시 키보드 선택 추가 가능
  // UP: ['ArrowUp', 'w', 'W'],
  // DOWN: ['ArrowDown', 's', 'S'],
  // SELECT: ['Enter', ' '],
};

/**
 * 키가 눌렸는지 확인하는 헬퍼 함수
 */
export const isKeyPressed = (event, keyList) => {
  return keyList.includes(event.key) || keyList.includes(event.code);
};

/**
 * 이동 방향 확인
 */
export const getMovementDirection = (event) => {
  if (isKeyPressed(event, MOVEMENT_KEYS.LEFT)) return -1;
  if (isKeyPressed(event, MOVEMENT_KEYS.RIGHT)) return 1;
  return 0;
};

/**
 * 점프 키 확인
 */
export const isJumpKey = (event) => {
  return isKeyPressed(event, JUMP_KEYS);
};

/**
 * 상호작용 키 확인
 */
export const isInteractionKey = (event) => {
  return isKeyPressed(event, INTERACTION_KEYS);
};

// 사용 예제:
// import { MOVEMENT_KEYS, isKeyPressed } from '../config/controls';
//
// const handleKeyDown = (e) => {
//   if (isKeyPressed(e, MOVEMENT_KEYS.LEFT)) {
//     // 왼쪽 이동
//   }
// };