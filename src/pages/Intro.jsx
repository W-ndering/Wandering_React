import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Intro.module.css'; // 인트로 전용 CSS

// --- 애셋 임포트 ---

// 1. 순환할 배경 이미지 3개
import introBg1 from '../assets/bg/14_5_산중턱.svg';
import introBg2 from '../assets/bg/3_1_공항앞길거리.svg';
import introBg3 from '../assets/bg/4_1_1번선택지_유명관광지.svg';

// 2. 중앙에 배치될 요소 1개
// 닉네임 입력창 배경 SVG는 CSS로 대체되어 제거되었습니다.
import startButtonImage from '../assets/obj/Start.svg'; // 시작 버튼 SVG
//import clicked from '../assets/obj/Start_pressed.svg';

const backgroundImages = [introBg1, introBg2, introBg3];
const BACKGROUND_INTERVAL = 2000; // 2초
const NICKNAME_STORAGE_KEY = 'NICKNAME';

function Intro() {
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
        // 세션 저장소에서 초기 닉네임을 불러오는 함수
    const getInitialNickname = () => {
        // 'NICKNAME' 키로 저장된 값이 있으면 반환, 없으면 빈 문자열 반환
        return sessionStorage.getItem(NICKNAME_STORAGE_KEY) || '';
    };
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [nickname, setNickname] = useState(getInitialNickname);
  const navigate = useNavigate();

  // 1. 배경 이미지 2초마다 순환
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, BACKGROUND_INTERVAL);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  // 닉네임 입력 처리
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  // 시작 버튼 클릭 처리
  const handleStartGame = async () => {
    try {
    const response = await fetch(`${BACKEND_KEY}/game/start`, {
      method: 'POST', // 💡 요청 메서드
      headers: {
        // Content-Type 헤더는 서버가 요구할 때만 추가합니다.
        // 빈 바디 요청이므로 생략해도 되지만, 서버 사양에 따라 포함할 수도 있습니다.
        // 'Content-Type': 'application/json', 
      },
      // body 속성을 완전히 생략하여 빈 바디를 전송합니다.
    });

    if (!response.ok) {
      // 서버에서 200번대가 아닌 응답이 오면 오류 처리
      console.error('❌ 게임 시작 이벤트 서버 요청 실패:', response.status);
    } else {
      console.log('✅ 게임 시작 이벤트 서버 요청 성공!');
      const data = await response.json();
      // 응답 객체에서 'id' 값을 추출하여 sessionStorage에 저장
      if (data && data.id) {
        sessionStorage.setItem('playerId', data.id);
        console.log(`🔑 Player ID 저장 성공: ${data.id}`); 
      } else {
        console.warn('⚠️ 서버 응답에 ID 필드가 없습니다.');
      }
      // 서버의 응답이 있다면 여기서 처리 (ex: await response.json())
    }
  } catch (error) {
    console.error('❌ 네트워크 오류 발생:', error);
  }
    // 닉네임 유효성 검사 또는 저장이 필요하면 여기에 추가
    sessionStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
    console.log('게임 시작! 닉네임:', nickname);
    // Airport.jsx (Stage1) 페이지로 이동 (경로는 Router.jsx 설정에 맞게)
    navigate('/guide');
  };

  return (
    <div className={styles.introcontainer}>
      {/* 1. 순환하는 배경 이미지 래퍼 */}
      <div className={styles.introbackgroundwrapper}>
        {backgroundImages.map((imgSrc, index) => (
          <div
            key={index}
            className={styles.introbackgroundimage}
            style={{
              backgroundImage: `url(${imgSrc})`,
              // 현재 인덱스에 해당하는 이미지만 불투명하게
              opacity: index === currentBgIndex ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* 2. Dim 처리 오버레이 */}
      <div className={styles.introdimoverlay}></div>

      {/* 3. 중앙 컨텐츠 (타이틀, 입력창, 버튼) */}
      <div className={styles.introcontent}>
        {/* 타이틀 이미지 (이 부분은 이전 코드에 없었으나, 구조 유지를 위해 남겨둡니다) */}
        {/* <img src={titleImage} alt="Title" className="intro-title" /> */}
        <p style={{ fontSize: '100px', color: 'white', textShadow : '8px 8px 0px #000000' }}>w@ndering</p>

        {/* 닉네임 입력창 (CSS 배경을 가진 래퍼) */}
        {/* style 속성 제거 */}
        <div
          className={styles.introinputwrapper}
          // style={{ backgroundImage: `url(${nicknameInputBg})` }} <- 이 부분이 제거됨
        >
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력하세요"
            className={styles.intronicknameinput}
          />
        </div>

        {/* 시작 버튼 이미지 */}
        <img
          src={startButtonImage}
          alt="Start Game"
          className={styles.introstartbutton}
          onClick={handleStartGame}
          role="button"
        />
      </div>
    </div>
  );
}

export default Intro;