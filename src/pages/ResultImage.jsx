// popup: {
//   type: "result"
// }
// storyCuts에서 이런 형태로 불러온다고 가정했습니다.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import result1 from "../assets/obj/결과__추억만남.svg";
import result2 from "../assets/obj/결과_도전.svg";
import result3 from "../assets/obj/결과_소심방랑.svg";
import result4 from "../assets/obj/결과_유니콘.svg";
import result5 from "../assets/obj/결과_나뭇잎.svg";
import saveImage1 from "../assets/obj/결과__추억만남.png";
import saveImage2 from "../assets/obj/결과_도전.png";
import saveImage3 from "../assets/obj/결과_소심방랑.png";
import saveImage4 from "../assets/obj/결과__이상상상.png";
import saveImage5 from "../assets/obj/결과__안정평온.png";
import realcookie from "../assets/obj/cookie2.svg";
import styles from "./ResultImage.module.css";

export default function ResultImage() {
  const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;
  const playerid = sessionStorage.getItem("playerId") || "0";
  const navigate = useNavigate();

  const [result, setResult] = useState({
    signal: "",
    typeName: "",
    feedback: ""
  });

  const RESULT_IMAGE_MAPPING = { // signal로 결과창 이미지 맵핑
    "추억의 비눗방울": result1, // 추억만남
    "열정의 모닥불": result2, // 도전
    "고요의 등불": result3, // 소심방랑
    "상상 속 유니콘": result4, // 이상상상
    "평온의 나뭇잎": result5 // 안정평온
  };

  const FEEDBACK_FORMAT_MAPPING = { // 결과마다 줄바꿈 기준이 달라서 추가함
    "추억의 비눗방울": (text) => {
      return text.replace(/\.\s*/g, '.\n\n');
    },
    "열정의 모닥불": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.\n\n' +
        sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    },
    "고요의 등불": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.' + sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    },

    "상상 속 유니콘": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.' + sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    },
    "평온의 나뭇잎": (text) => {
      const sentences = text.split('.').filter(s => s.trim());
      return sentences[0] + '.\n\n' +
        sentences[1] + '.' + sentences[2] + '.\n\n' +
        sentences.slice(3).join('.') + '.';
    }
  };

  useEffect(() => { // 서버에서 분석 결과 받아오기
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`${BACKEND_KEY}/player/${playerid}/end`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error(`${res.status}`);

        const data = await res.json();

        const mappedImg =
          RESULT_IMAGE_MAPPING[data.signal];

        const formatFeedback = FEEDBACK_FORMAT_MAPPING[data.signal] || ((text) => text);

        if (mounted) {
          setResult({
            img: mappedImg,
            signal: data.signal,
            typeName: data.typeName.replace(/[\[\]]/g, ""),
            feedback: formatFeedback(data.feedback)
          });
        }
      } catch (err) {
        if (mounted) {
          console.log("임시 데이터로 대체: ", err.message);
          setResult({
            img: result1,
            signal: "추억의 비눗방울",
            typeName: "머무른 시간 속에서 길을 찾으세요.",
            feedback:
              "당신은 추억과 만남을 소중히 여기는 사람입니다.\n\n머물렀던 시간은 분명 값진 경험으로 남아, 앞으로의 길에 힘이 되어줄 거예요.\n\n순간에 집중하고 타인과의 교감을 추구하는 당신은, 경험 속에서 답을 찾을 줄 아는 사람입니다.\n\n혹시 길을 잃은 듯 느껴질 때에는, 머무른 시간 속에서 길을 찾아보세요.",
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const SAVE_IMAGE_MAPPING = { // signal로 저장용 이미지 맵핑
    "추억의 비눗방울": saveImage1, // 추억만남
    "열정의 모닥불": saveImage2, // 도전
    "고요의 등불": saveImage3, // 소심방랑
    "상상 속 유니콘": saveImage4, // 이상상상
    "평온의 나뭇잎": saveImage5 // 안정평온
  };

  // 결과 이미지 저장
  const handleSaveImage = () => {
    const saveImg = SAVE_IMAGE_MAPPING[result.signal];
    const link = document.createElement('a');
    link.href = saveImg;
    link.download = `결과_${result.signal.replace(/\s+/g, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.viewport}>

      {current.popup && ( // 결과 이미지
        <>
          {current.popup.type === "result" && (
            <div className={styles.popupResultScroll}>
              <div className={styles.popupResultWrap}>

                {result.img && (
                  <img
                    src={result.img}
                    alt="결과이미지"
                    className={styles.popupResultImage}
                  />
                )}

                <div className={styles.cardText}>
                  행운의 카드 : {result.signal}
                </div>

                <div className={styles.typeNameText}
                  style={result.signal === "평온의 나뭇잎" ? { fontSize: '32px' } : {}}
                >
                  {result.typeName}
                </div>

                <div className={styles.feedbackBox}>
                  <div className={styles.feedbackText}>
                    {result.feedback}
                  </div>
                </div>

                <div className={styles.saveBtn} onClick={handleSaveImage}>결과 저장하기</div>
                <div className={styles.saveBtnLine}></div>
                <div className={styles.recommendBtn} onClick={() => navigate('/suggest')}>!내 성향에 맞는 콘텐츠 추천받기!</div>
                <div className={styles.btn1}>결과 공유하기</div> {/* 아직 구현 X */}
                <div className={styles.btn2} onClick={() => navigate('/')}>다시 여행하기</div> {/* 첫 화면으로 이동 */}
                <div className={styles.btn3} onClick={() => navigate('/cookie')}> {/* 쿠키로 이동 */}
                  Want some Cookie?
                  <img
                    src={realcookie}
                    alt="쿠키아이콘"
                    className={styles.cookieIcon}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}