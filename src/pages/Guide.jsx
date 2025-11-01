import { useNavigate } from "react-router-dom";
import BackgroundImage from '../assets/obj/플레이_가이드.png';
import styles from './Guide.module.css';

const Guide = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
    navigate('/prologue');
  };

return (
    // 'full-screen-container' 클래스는 배경 이미지를 전체 화면으로 채우는 역할을 합니다.
    // 인라인 스타일로도 배경 이미지를 설정할 수 있습니다.
    <div 
      className={styles.fullscreencontainer} 
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
        <button onClick={handleNavigate} className={styles.navbutton}>PLAY
        </button>
    </div>
  );
};

export default Guide;