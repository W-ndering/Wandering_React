import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

//main.jsx는 엔트리포인트로 사용합니다.
//라우터 추가 및 랜더링은 App.jsx와 Router.jsx를 통해 진행합니다.