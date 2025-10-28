import React from 'react';
import { Link } from 'react-router-dom';
import './Stage2.css'; // Stage2 전용 CSS 임포트

function Stage2() {
  return (
    <div className="stage2-container">
      <h1 className="stage2-title">
        Stage 2에 오신 것을 환영합니다!
      </h1>
      <p className="stage2-description">
        Stage 1에서 화면 우측 끝에 도달하여 이곳으로 내비게이팅되었습니다.
      </p>
      <Link to="/" className="stage2-link">
        Stage 1로 돌아가기
      </Link>
    </div>
  );
}

export default Stage2;
