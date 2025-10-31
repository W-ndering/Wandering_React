import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg/26-10_바다가는길.svg";
import bg2 from "../assets/bg/27-10_바닷가.svg";
// import char1 from "./assets/char/기본_주인공3.svg";
import textbox from "../assets/obj/text_box.svg";
import choicebox from "../assets/obj/선택지.svg";
import bag from "../assets/obj/가방.svg";
import diary from "../assets/obj/다이어리.svg";
import styles from "./Beach.module.css";

export default function Beach() {
    const navigate = useNavigate();
    const [idx, setIdx] = useState(0);
    const nickname = sessionStorage.getItem('NICKNAME') || '나';
    const storyCuts = [
        {
            id: 1,
            bg: bg1,
            text: "축제를 즐겼던 시장을 지나\n해안가로 향한다."
        },
        {
            id: 2,
            text: "시간은 느즈막한 오후.\n슬슬 노을이 지고 있다.",
        },
        {
            id: 3,
            bg: bg2,
            text: "무작정 해안선을 따라 걸었다.",
        },
        {
            id: 4,
            text: "걷다 보니 문득 생각이 들었다.",
            dim: "#00000033"
        },
        {
            id: 5,
            text: "내가 뭘 찾고 있었지?",
            dim: "#00000066"
        },
        {
            id: 6,
            text: "귀찮게 하던\n알 수 없는 목소리도 들리지 않고,",
            dim: "#00000099"
        },
        {
            id: 7,
            text: "무언가를 찾으러\n떠났다는 것조차 잊고 있었다.",
            dim: "#000000CC"
        },
        {
            id: 8,
            text: "무얼 찾고 있었더라?",
            choice: {
                src: choicebox,
                text: "가방을 열어본다."
            },
            dim: "#000000CC"
        },
        {
            id: 9,
            popup: {
                type: "single",
                src: bag
            },
            dim: "#000000CC"
        },
        {
            id: 10,
            popup: {
                type: "single",
                src: diary
            },
            dim: "#000000CC"
        },
        {
            id: 11,
            speaker: nickname,
            text: "찾았다.",
            popup: {
                type: "single",
                src: diary,
            },
            ddim: "#000000bb"
        },
        {
            id: 12,
            speaker: nickname,
            text: "찾았다.",
            popup: {
                type: "single",
                src: diary,
            },
            choice: {
                src: choicebox,
                text: "다이어리를 넘겨본다."
            },
            ddim: "#000000cf",
        }
    ];
    const [current, setCurrent] = useState(storyCuts[0]); // 현재 보여지는 컷
    const [lastVisual, setLastVisual] = useState({ // 이전 컷의 배경/캐릭터 (유지를 위해서)
        bg: storyCuts[0].bg,
        char: storyCuts[0].char,
        npc: storyCuts[0].npc ?? null,
    });
    const [displayedText, setDisplayedText] = useState(""); // 현재 화면에 찍힌 텍스트
    const [isTyping, setIsTyping] = useState(false); // 타이핑 진행 중 여부
    const typingTimerRef = useRef(null); // 타이핑 interval 저장

    const [charX, setCharX] = useState(100); // 시작 x좌표(px) — 필요에 따라 조정
    const navigatedRef = useRef(false);
    const keysRef = useRef({ left: false, right: false });
    const SPEED = 500;
    const minX = 0;
    const maxX = 2160;
    const moveTimerRef = useRef(null);
    const lastTimeRef = useRef(null);

    const SCENE_ID = 5;

    // 선택 결과 서버에 전송
    async function postChoice({ sceneId, optionKey }) {
        try {
            const res = await fetch(`https://leekhoon.store/player/${playerId}/choice`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sceneId, optionKey }),
            });

            if (res.ok) {
                console.log(`✅ 서버 전송 성공 : 선택한 선택지 번호: ${optionKey}`);
            } else {
                console.warn(`⚠️ 서버 응답 오류 (${res.status})`);
            }
        } catch (err) {
            console.error("❌ 서버 연결 실패:", err);
        }
    }

    useEffect(() => { // 텍스트 타이핑 효과
        const text = current.text;

        if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
        }

        if (!text) { setDisplayedText(""); setIsTyping(false); return; }
        setDisplayedText(""); setIsTyping(true);

        let i = 0;
        typingTimerRef.current = setInterval(() => {
            i++;
            setDisplayedText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(typingTimerRef.current);
                typingTimerRef.current = null;
                setIsTyping(false);
            }
        }, 50);

        return () => {
            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
                typingTimerRef.current = null;
            }
        };
    }, [current.text]);

    useEffect(() => {
        const cut = storyCuts[idx];
        const merged = {
            ...cut,
            bg: cut.bg ?? lastVisual.bg, // bg 입력 없으면 이전 bg 유지
            char:
                cut.char === "none" // 캐릭터 사용 안 하는 경우
                    ? null
                    : (cut.char ?? lastVisual.char), // char 입력 없으면 이전 char 유지
            npc: cut.npc === "none" ? null : (cut.npc ?? lastVisual.npc)
        };
        setCurrent(merged); // 현재 보여줄 컷으로 설정
        setLastVisual({ bg: merged.bg, char: merged.char, npc: merged.npc });

        navigatedRef.current = false;
    }, [idx]);

    const handleNext = async (choiceIndex = null) => {
        if (idx >= storyCuts.length - 1) {
            navigate("/result");
            return;
        }

        setIdx(idx + 1);
    };

    // Space바로 다음 컷으로 이동
    useEffect(() => {
        const onKey = (e) => {
            if (e.code !== "Space") return;

            // 타이핑 중이면 타이머를 멈추고 즉시 완성
            if (isTyping && current.text) {
                if (typingTimerRef.current) {
                    clearInterval(typingTimerRef.current);
                    typingTimerRef.current = null;
                }
                setDisplayedText(current.text);
                setIsTyping(false);
                return;
            }
            // 그 외엔 다음 컷
            handleNext();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isTyping, current.id, current.text]);

    // 키 입력 등록
    useEffect(() => {
        const down = (e) => {
            if (e.key === "ArrowLeft") {
                if (!keysRef.current.left) keysRef.current.left = true;
            }
            if (e.key === "ArrowRight") {
                if (!keysRef.current.right) keysRef.current.right = true;
            }
        };
        const up = (e) => {
            if (e.key === "ArrowLeft") keysRef.current.left = false;
            if (e.key === "ArrowRight") keysRef.current.right = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, []);

    // 이동 루프
    useEffect(() => {
        // 루프 시작 시 초기화
        lastTimeRef.current = null;
        if (moveTimerRef.current) {
            clearInterval(moveTimerRef.current);
            moveTimerRef.current = null;
        }

        moveTimerRef.current = setInterval(() => {
            if (!current.char) return;

            const now = performance.now();
            if (lastTimeRef.current == null) {
                lastTimeRef.current = now; // 첫 틱은 이동하지 않음 (초반 튐 방지)
                return;
            }
            const dt = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            const { left, right } = keysRef.current;
            const dir = (left ? -1 : 0) + (right ? 1 : 0);
            if (dir !== 0) {
                setCharX(x => Math.max(minX, Math.min(maxX, x + dir * SPEED * dt)));
            }
        }, 16);

        return () => {
            if (moveTimerRef.current) {
                clearInterval(moveTimerRef.current);
                moveTimerRef.current = null;
            }
        };
    }, [current.char, SPEED, minX, maxX]);


    // 마지막 컷에서 우측 끝 도달 시 다음 페이지로 이동
    useEffect(() => {
        if (current.id !== 11) return;
        const EDGE = maxX - 5;
        if (!navigatedRef.current && charX >= EDGE) {
            navigatedRef.current = true;
            navigate("/climbdown");
        }
    }, [current.id, charX, maxX, navigate]);

    return (
        <div className={styles.viewport}>

            <div className={styles.stage}>
                {current.bg.startsWith("#") // 배경
                    ? <div className={styles.background} style={{ backgroundColor: current.bg }} />
                    : <img src={current.bg} alt="배경" className={styles.background} />
                }

                {/* 특정 장면에서 배경 dim */}
                {/* {[5, 8, 10].includes(current.id) && <div className={styles.bgDim} />} */}

                {current.dim && ( // 컷마다 dim 세기 다르게 (팝업 아래에 깔림)
                    <div className={styles.bgDim} style={{ background: current.dim }} />
                )}

                {current.ddim && ( // 컷마다 dim 세기 다르게 (팝업 위로 깔림)
                    <div className={styles.ddim} style={{ background: current.ddim }} />
                )}

                {current.title && ( // 새로운 스토리 도입 시 제목
                    <div className={styles.titleText}>{current.title}</div>
                )}

                {/* 캐릭터 */}
                {current.char && (
                    <img
                        src={current.char}
                        alt="캐릭터"
                        className={styles.character}
                        style={{
                            position: "absolute",
                            bottom: 65,
                            left: `${charX}px`,
                        }}
                    />
                )}

                {/* NPC */}
                {current.npc?.src && (
                    <img
                        src={current.npc.src}
                        alt="npc"
                        className={styles.charNPC}
                        style={{
                            position: "absolute",
                            bottom: 65,
                            left: `${current.npc.x ?? 1650}px`,
                        }}
                    />
                )}

                {current.text && ( // 텍스트창
                    <div className={styles.textboxWrap}>
                        <img src={textbox} alt="텍스트박스" className={styles.textboxImage} />

                        {(() => {
                            const hasLineBreak = current.text.includes("\n"); // 텍스트 줄바꿈 유무

                            return (
                                <div
                                    className={[
                                        styles.textboxContent,
                                        !current.speaker ? styles.centerText : "",           // 화자 없으면 가운데정렬
                                        current.speaker && !hasLineBreak ? styles.upText : "",  // 화자 O, 줄바꿈 X
                                        current.speaker && hasLineBreak ? styles.upTextMulti : "" // 화자 O, 줄바꿈 O
                                    ].join(" ").trim()}
                                >
                                    {current.speaker && (
                                        <div className={styles.speaker}>{current.speaker}</div>
                                    )}
                                    <div className={styles.content}>{displayedText}</div>
                                </div>
                            );
                        })()}
                    </div>
                )}



                {current.choice && ( // 선택지창
                    <div className={`${styles.choiceWrap} ${Array.isArray(current.choice.text)
                        ? styles.choiceWrap  // 선택지가 여러 개인 경우 (위치 조절)
                        : styles.choiceWrapSingle // 하나인 경우
                        }`}>
                        {Array.isArray(current.choice.text) ? ( // 선택지가 여러 개인 경우
                            <div className={styles.choiceList}>
                                {current.choice.text.map((label, i) => (
                                    <div
                                        key={i}
                                        className={styles.choiceItem}
                                        onClick={() => handleNext(i)}
                                    >
                                        <img
                                            src={current.choice.src}
                                            alt={`선택지박스 ${i + 1}`}
                                            className={styles.choiceImage}
                                        />
                                        <div className={styles.choiceText}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div // 하나인 경우
                                className={styles.choiceItem}
                                onClick={() => handleNext(0)}
                            >
                                <img
                                    src={current.choice.src}
                                    alt="선택지박스"
                                    className={styles.choiceImage}
                                />
                                <div className={styles.choiceText}>{current.choice.text}</div>
                            </div>
                        )}
                    </div>
                )}

                {current.popup && (
                    <div className={styles.popupWrap}>
                        {current.popup.type === "state" && ( // 팝업이 상태창일 때
                            <>
                                <img
                                    src={current.popup.src}
                                    alt="상태창"
                                    className={styles.popupImage}
                                />

                                {current.popup.obj && (
                                    <img
                                        src={current.popup.obj}
                                        alt="상태창오브젝트"
                                        className={styles.popupObjImage}
                                    />
                                )}

                                {current.popup.text && (
                                    <div className={styles.popupText}>
                                        {current.id === 5
                                            ? current.popup.text.split("\n").map((line, i) => (
                                                <div
                                                    key={i}
                                                    className={i === 1 ? styles.popupLineSmall : ""}
                                                >
                                                    {line}
                                                </div>
                                            ))
                                            : current.popup.text}
                                    </div>
                                )}
                            </>
                        )}

                        {current.popup.type === "inter" && ( // 팝업이 인터랙션일 때
                            <div className={styles.popupWrap}>
                                <div className={styles.circle}></div>

                                {current.popup && (
                                    <img src={current.popup.src} alt="인터랙션아이콘"
                                        className={styles.popupInterImage}
                                        onClick={handleNext}
                                    />
                                )}
                            </div>
                        )}

                        {current.popup.type === "single" && ( // 팝업이 단독 아이템일 때
                            <img src={current.popup.src}
                                alt="단독아이템"
                                className={styles.popupSingleImage}
                                onClick={handleNext}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}