import { useLocation, useNavigate } from 'react-router-dom';
// SuggestCustom에서 사용된 에셋과 동일한 경로를 사용
import styles from './SuggestDetail.module.css'; 
import suggestHeader from '../assets/obj/추천헤더.svg'; 
import suggestBody from '../assets/obj/추천바탕.svg'; 

// 💡 상세 API 응답 문자열에서 이름과 추천 이유를 파싱하는 함수
const parseDetailReason = (detailResponse) => {
    // detailResponse 형태: { "reply": "{\n \"name\": \"아이유 - 블루밍\",\n \"res\": \"당신은 감정적으로 복잡한 상황에서도 긍정적인 에너지를 찾는 경향이 있습니다...\"}\n" }
    const replyString = detailResponse?.reply || "";
    try {
        // reply 문자열 안에 있는 JSON을 추출
        const innerJsonMatch = replyString.match(/\{[\s\S]*\}/);
        if (!innerJsonMatch) return { name: "", reason: "" };

        // 이스케이프된 문자(\n, \") 처리 후 JSON 파싱
        const cleanJsonString = innerJsonMatch[0].replace(/\\n/g, '').replace(/\\"/g, '"');
        const innerJson = JSON.parse(cleanJsonString);
        
        // name과 res를 추출
        return {
            name: innerJson.name || "",
            reason: innerJson.res || ""
        };
    } catch (e) {
        console.error("상세 정보 파싱 오류:", e);
        return { name: "추천 이름 로딩 실패", reason: "상세 정보를 불러오는 데 문제가 발생했습니다." };
    }
};


export default function SuggestDetail() {
    const location = useLocation();
    const navigate = useNavigate(); // 뒤로가기 버튼 등을 위해 준비

    // SuggestCustom.jsx에서 navigate를 통해 전달받은 state
    const { 
        detail: detailData, 
        title, // 클릭된 추천 항목 이름 (예: 아이유 - 블루밍)
        backgroundImageUrl, // 전체 배경 이미지
        categoryIconUrl, // 카테고리 아이콘 이미지
        category
    } = location.state || {};
    
    // SuggestCustom에서 category를 전달하지 않았으므로, title에서 추출 시도
    const username = sessionStorage.getItem("USERNAME") || "USER NAME";

    // 상세 정보 파싱
    const { name: recommendedName, reason } = parseDetailReason(detailData);

    return (
        <div 
            className={styles.container} 
            style={{ 
                backgroundImage: `url(${backgroundImageUrl})`, // 전체 배경 적용
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }} 
        >
            {/* 1. 중앙의 흰색 바탕 박스 */}
            <div className={styles.mainBox} style={{ 
                backgroundImage: `url(${suggestBody})`, // 중앙 박스 배경 적용
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                
                {/* 2. 갈색 헤더 바 (텍스트가 이미지보다 앞에 오도록 CSS 설정) */}
                <div className={styles.headerBar}>
                    {/* 헤더 이미지 */}
                    <img 
                        src={suggestHeader} 
                        alt="추천 헤더 도형"
                        className={styles.shapeTwo} 
                    />
                    {/* 헤더 텍스트 */}
                    <span className={styles.headerText}>
                        {username}을 위한 {category}
                    </span>
                </div>

                {/* 3. 상세 내용 영역 */}
                <div className={styles.contentArea}>
                    
                    {/* 3-1. 아이콘 + 추천 이름 */}
                    <div className={styles.nameSection}>
                        <img 
                            src={categoryIconUrl} // 앞 페이지에서 전달받은 아이콘 사용
                            alt={`${category} 아이콘`}
                            className={styles.categoryIcon}
                        />
                        <h2 className={styles.recommendedName}>
                            {recommendedName}
                        </h2>
                    </div>

                    {/* 3-2. 추천 이유 */}
                    <div className={styles.reasonSection}>
                        <h3 className={styles.reasonTitle}>
                            추천 이유
                        </h3>
                        {/* 추천 이유 텍스트 */}
                        <p className={styles.reasonText}>
                            {reason}
                        </p>
                    </div>

                    {/* 3-3. 예시 버튼 (피그마 이미지 기반) */}
                    <div className={styles.exampleButtons}>
                        <button className={styles.exampleButton} onClick={() => window.open(`https://search.naver.com/search.naver?query=${title}`)}>#{title} 더 알아보기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}