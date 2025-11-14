import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SuggestCustom.module.css';
import suggestHeader from '../assets/obj/추천헤더.svg';
import suggestBody from '../assets/obj/추천바탕.svg';

// 💡 API 응답 문자열에서 추천 항목을 파싱하는 함수 (이전에 정의되었다고 가정)
const parseRecommendations = (replyString) => {
    // 예시 API 응답 형태: {"reply": "{\n \"name1\": \"아이유 - 블루밍\",\n \"name2\": \"방탄소년단 - 다이너마이트\",\n \"name3\": \"사무엘 - 잔소리\"\n}"}
    try {
        // reply 문자열 안에 있는 JSON을 다시 파싱
        const innerJsonMatch = replyString.match(/\{[\s\S]*\}/);
        if (!innerJsonMatch) return [];

        const innerJson = JSON.parse(innerJsonMatch[0].replace(/\\n/g, '').replace(/\\"/g, '"'));
        
        // name1, name2, name3 값을 배열로 추출
        return [
            innerJson.name1,
            innerJson.name2,
            innerJson.name3
        ].filter(name => name); // 유효한 이름만 필터링
    } catch (e) {
        console.error("추천 파싱 오류:", e);
        return [];
    }
};


export default function SuggestCustom() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { apiResponse, category, backgroundImageUrl,categoryIconUrl } = location.state || {};
  const playerid = sessionStorage.getItem("playerId") || "0";
  // 임시 사용자 이름 설정
  const username = sessionStorage.getItem("USERNAME") || "USER NAME"; 
  
  const replyString = apiResponse?.reply || "";
  const recommendationList = parseRecommendations(replyString);
  
  const handleRecommendationClick = async (recommendationValue) => {
    const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
    const DETAIL_NEXT_PAGE_PATH = '/detail-info'; 
    
    const requestBody = {
      message: recommendationValue,
      category: category,
    };

    try {
      const response = await fetch(`${BACKEND_KEY}/openai/${playerid}/reason`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody), 
      });

      if (!response.ok) {
        throw new Error(`상세 API 요청 실패 (Status: ${response.status})`);
      }
      
      const detailData = await response.json(); 

      navigate(DETAIL_NEXT_PAGE_PATH, { 
        state: { 
          detail: detailData, 
          title: recommendationValue,
          backgroundImageUrl: backgroundImageUrl
        } 
      });

    } catch (error) {
      console.error('상세 정보 API 요청 오류:', error);
      alert(`상세 정보 로딩 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // 추천 항목이 3개가 아닐 경우 빈 배열로 처리하여 렌더링 에러 방지
  const items = recommendationList.length === 3 ? recommendationList : ["...", "...", "..."];


  return (
    <div 
      className={styles.container} 
      style={{ 
        backgroundImage: `url(${backgroundImageUrl})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} 
    >
      {/* 1. 중앙의 흰색 바탕 박스 */}
      <div className={styles.mainBox} style={{ 
            backgroundImage: `url(${suggestBody})`, // 💡 SVG 경로 적용
            backgroundSize: 'cover', // 도형 크기에 맞게 이미지 채우기
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // z-index를 10으로 유지 (styles.shapeOne에서 설정되어 있을 경우)
          }}>
        
        {/* 2. 갈색 헤더 바 (이미지의 'USERNAME을 위한 여행지' 부분) */}
        <div className={styles.headerBar}>
          <img 
                    src={suggestHeader} 
                    alt="추천 헤더 도형"
                    className={styles.shapeTwo} 
                  />
          <span className={styles.headerText}>
            {username}을 위한 {category}
          </span>
        </div>

        {/* 3. 추천 항목 리스트 (IMG + 텍스트) */}
        <div className={styles.recommendationList}>
          {items.map((itemTitle, index) => (
            <div 
                key={index} 
                className={styles.itemWrapper}
                onClick={() => handleRecommendationClick(itemTitle)} // 클릭 이벤트 추가
            >
                {/* IMG Placeholder */}
                <div 
                    className={styles.imagePlaceholder}
                    style={{
                        backgroundImage: `url(${categoryIconUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                </div>
                {/* 추천 항목 텍스트 */}
                <div className={styles.itemTitle}>
                    {itemTitle.substring(0, 15)} 
                    {itemTitle.length > 15 ? '...' : ''}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}