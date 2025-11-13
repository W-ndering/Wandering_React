// src/components/Suggest.jsx (수정된 코드)

import { useNavigate } from 'react-router-dom';
import styles from './Suggest.module.css';
import suggestHeader from '../assets/obj/추천헤더.svg';
import suggestBody from '../assets/obj/추천바탕.svg';
import tripIcon from '../assets/obj/여행지.svg';
import musicIcon from '../assets/obj/음악.svg';
import bookIcon from '../assets/obj/도서.svg';
import hobbyIcon from '../assets/obj/취미.svg';
import ottIcon from '../assets/obj/OTT.svg';

const CategoryBackgrounds = {
  '여행지' : '../assets/bg/여행지_배경.svg',
  '음악' : '../assets/bg/음악_배경.svg',
  '도서' : '../assets/bg/도서_배경.svg',
  '취미' : '../assets/bg/취미_배경.svg',
  'OTT' : '../assets/bg/OTT_배경.svg',
}

const Buttons = [
  { name: '여행지', value: '여행지', icon: tripIcon },
  { name: '음악', value: '음악', icon: musicIcon },
  { name: '도서', value: '도서' , icon: bookIcon },
  { name: '취미', value: '취미' , icon: hobbyIcon },
  { name: 'OTT', value: 'OTT' , icon: ottIcon },
];

export default function Suggest() {
  const playerid = sessionStorage.getItem("playerId") || "7";
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
  const navigate = useNavigate();

  const handleButtonClick = async (buttonValue) => {
    const backgroundImageUrl = CategoryBackgrounds[buttonValue] || ''; 
    const requestBody = {
      message: buttonValue,
    };

    try {
      const response = await fetch(`${BACKEND_KEY}/openai/${playerid}/main`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), 
      });

      if (!response.ok) {
        const errorDetail = await response.text(); 
        throw new Error(`API 요청 실패 (Status: ${response.status}): ${errorDetail.substring(0, 100)}...`);
      }
      
      // 응답 데이터를 JSON으로 파싱
      const data = await response.json(); 
      console.log('API 응답 수신:', data);

      // 다음 페이지로 응답 데이터를 state로 전달
      navigate('suggestCustom', { 
        state: { 
          apiResponse: data, 
          category: buttonValue,
          backgroundImageUrl: backgroundImageUrl 
        } 
      });
      
    } catch (error) {
      console.error('API 요청 오류:', error);
      alert(`요청 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* 🚀 중앙 정렬 컨테이너 (relative 기준) */}
      <div className={styles.mainContent}>
        
        {/* 1️⃣ 첫 번째 도형 */}
        <div className={styles.shapeOne} style={{ 
            backgroundImage: `url(${suggestBody})`, // 💡 SVG 경로 적용
            backgroundSize: 'cover', // 도형 크기에 맞게 이미지 채우기
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // z-index를 10으로 유지 (styles.shapeOne에서 설정되어 있을 경우)
          }}></div>
        
        {/* 2️⃣ 두 번째 도형 (겹치기) */}
        <img 
          src={suggestHeader} 
          alt="추천 헤더 도형"
          className={styles.shapeTwo} 
        />

        {/* 3️⃣ 버튼 그룹 컨테이너 (세로 중심 일치) */}
        <div className={styles.buttonGroupContainer}>
          
          {/* 4️⃣ 가로로 배치된 버튼들 */}
          <div className={styles.buttonList}>
            {Buttons.map((button) => (
              <button
                key={button.value}
                onClick={() => handleButtonClick(button.value)}
                className={styles.button}
              >
                <img 
                  src={button.icon} 
                  alt={button.name} 
                  className={styles.buttonImage} 
                />
                <span className={styles.buttonText}>
                  {button.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}