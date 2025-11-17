// API helper for sending player choices to the server
const BACKEND_KEY = import.meta.env.VITE_BACKEND_DOMAIN_KEY;

export async function postChoice({ sceneId, optionKey }) {
  try {
    // TODO: Replace 'playerId' with actual player ID from session/context
    const playerid = sessionStorage.getItem("playerId") || "0"; // Placeholder - should come from auth context

    const res = await fetch(`${BACKEND_KEY}/player/${playerid}/choice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sceneId, optionKey }),
    });

    if (res.ok) {
      console.log(`✅ 서버 전송 성공 : 선택한 선택지 번호: ${optionKey}`);
      return true;
    } else {
      console.warn(`⚠️ 서버 응답 오류 (${res.status})`);
      return false;
    }
  } catch (err) {
    console.error("❌ 서버 연결 실패:", err);
    return false;
  }
}