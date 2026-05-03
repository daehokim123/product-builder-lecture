const modeToggle = document.getElementById("modeToggle");
const contactForm = document.getElementById("contactForm");
const dailyDateSelector = document.getElementById("dailyDateSelector");
const weeklyDateSelector = document.getElementById("weeklyDateSelector");
const dailyContent = document.getElementById("dailyContent");
const weeklyContent = document.getElementById("weeklyContent");
const btcPriceDisplay = document.getElementById("btcPriceDisplay");
const xrpPriceDisplay = document.getElementById("xrpPriceDisplay");

// --- 업비트 실시간 시세 가져오기 (BTC & XRP) ---
async function fetchUpbitPrice() {
  try {
    const response = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-XRP");
    const data = await response.json();
    
    // 비트코인 처리
    const btc = data.find(item => item.market === "KRW-BTC");
    if (btc) {
      const btcPrice = btc.trade_price.toLocaleString();
      const btcChange = (btc.signed_change_rate * 100).toFixed(2);
      const btcRise = btc.change === "RISE";
      btcPriceDisplay.textContent = `₩${btcPrice} (${btcRise ? '+' : ''}${btcChange}%)`;
      btcPriceDisplay.className = btcRise ? "up" : "down";
    }

    // 리플 처리
    const xrp = data.find(item => item.market === "KRW-XRP");
    if (xrp) {
      const xrpPrice = xrp.trade_price.toLocaleString();
      const xrpChange = (xrp.signed_change_rate * 100).toFixed(2);
      const xrpRise = xrp.change === "RISE";
      xrpPriceDisplay.textContent = `₩${xrpPrice} (${xrpRise ? '+' : ''}${xrpChange}%)`;
      xrpPriceDisplay.className = xrpRise ? "up" : "down";
    }
  } catch (error) {
    console.error("Upbit API 호출 에러:", error);
  }
}

// 10초마다 시세 업데이트
setInterval(fetchUpbitPrice, 10000);

// --- 데이터 저장소 (예시 데이터 포함) ---
const archives = {
  daily: [
    {
      date: "2026-05-03",
      global: [
        { 
          title: "미국 소비자물가지수(CPI) 발표", 
          text: "예상치를 하회하는 결과로 금리 인하 기대감 확산.", 
          ai: "인플레이션 둔화 추세가 고착화될 경우 연내 2회 이상의 금리 인하 가능성이 높아짐." 
        },
        { 
          title: "중국 경기 부양책 효과", 
          text: "상해 증시 반등 및 소비 지표 개선 조짐.", 
          ai: "내수 회복 강도가 관건이며, 원자재 가격 상승 압력으로 작용할 수 있음." 
        },
        { 
          title: "엔화 가치 변동성 확대", 
          text: "일본은행(BOJ)의 정책 변화 가능성에 따른 시장 민감도 증가.", 
          ai: "엔-캐리 트레이드 청산 리스크에 대비한 포트폴리오 조정 필요." 
        }
      ],
      korea: [
        { 
          title: "반도체 수출 호조 지속", 
          text: "메모리 반도체 단가 상승 및 AI 서버 수요 증가.", 
          ai: "하반기 경상수지 흑자 폭 확대의 핵심 동력으로 작용할 전망." 
        },
        { 
          title: "가계부채 및 부동산 대출 추이", 
          text: "정부의 스트레스 DSR 도입 영향 분석.", 
          ai: "금리 인하 시점과 맞물려 가계 부채 관리 역량이 금융 안정의 핵심." 
        }
      ]
    },
    {
      date: "2026-05-02",
      global: [
        { 
          title: "빅테크 실적 발표 시즌 종료", 
          text: "주요 기업들의 AI 투자 확대 계획 발표.", 
          ai: "AI 수익화 단계에 대한 시장의 의구심을 해소하는 것이 향후 주가의 핵심." 
        }
      ],
      korea: [
        { 
          title: "K-푸드 수출 역대 최고치", 
          text: "라면, 김 등 가공식품의 글로벌 수요 폭증.", 
          ai: "내수 부진을 타개할 새로운 수출 효자 품목으로 부상 중." 
        }
      ]
    }
  ],
  weekly: [
    {
      date: "2026-05-W1",
      global: "미국 물가 지표 안정이 시장 전반의 투심을 개선시켰으나, 중동 지정학적 불안은 상존함.",
      korea: "수출 주도형 성장 회복세가 뚜렷하며, 기업 밸류업 프로그램에 대한 시장 기대감 지속.",
      nextWeek: "주요 기업 실적 발표 및 소비자 신뢰지수 결과에 따라 변동성 확대 가능성."
    },
    {
      date: "2026-04-W4",
      global: "연준 위원들의 매파적 발언으로 금리 인하 시점이 지연되는 모습.",
      korea: "환율 변동성 확대에 따른 외환 당국의 구두 개입 및 시장 안정화 조치.",
      nextWeek: "FOMC 정례 회의 결과 및 파월 의장의 기자회견 주목."
    }
  ]
};

// --- 다크 모드 로직 ---
function initDarkMode() {
  const isDark = localStorage.getItem("darkMode") === "true" || 
                 (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  if (isDark) {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "🌙";
  }
}

modeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark);
  modeToggle.textContent = isDark ? "🌙" : "☀️";
});

// --- 아카이브 렌더링 로직 ---

function populateSelectors() {
  // 데일리 셀렉터 채우기
  archives.daily.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.date;
    dailyDateSelector.appendChild(option);
  });

  // 위클리 셀렉터 채우기
  archives.weekly.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.date;
    weeklyDateSelector.appendChild(option);
  });
}

function renderDaily(index) {
  const data = archives.daily[index];
  if (!data) return;

  dailyContent.innerHTML = `
    <div class="issue-group">
      <h3>🌍 글로벌 이슈 (${data.date})</h3>
      <div class="card-grid">
        ${data.global.map(item => `
          <div class="data-card">
            <h4>${item.title}</h4>
            <p>${item.text}</p>
            <div class="ai-analysis">
              <strong>🤖 AI 분석:</strong> ${item.ai}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="issue-group" style="margin-top: 32px;">
      <h3>🇰🇷 한국 이슈</h3>
      <div class="card-grid">
        ${data.korea.map(item => `
          <div class="data-card">
            <h4>${item.title}</h4>
            <p>${item.text}</p>
            <div class="ai-analysis">
              <strong>🤖 AI 분석:</strong> ${item.ai}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderWeekly(index) {
  const data = archives.weekly[index];
  if (!data) return;

  weeklyContent.innerHTML = `
    <div class="summary-box">
      <div class="summary-row">
        <strong>🌍 글로벌 종합 (${data.date}):</strong> ${data.global}
      </div>
      <div class="summary-row">
        <strong>🇰🇷 한국 종합:</strong> ${data.korea}
      </div>
      <div class="summary-row accent">
        <strong>🎯 다음주 전망:</strong> ${data.nextWeek}
      </div>
    </div>
  `;
}

// 셀렉터 이벤트 리스너
dailyDateSelector.addEventListener("change", (e) => {
  const idx = e.target.value === "latest" ? 0 : parseInt(e.target.value);
  renderDaily(idx);
});

weeklyDateSelector.addEventListener("change", (e) => {
  const idx = e.target.value === "latest" ? 0 : parseInt(e.target.value);
  renderWeekly(idx);
});

// 초기 실행
initDarkMode();
populateSelectors();
renderDaily(0); // 최신 데일리 렌더링
renderWeekly(0); // 최신 위클리 렌더링
fetchUpbitPrice(); // 비트코인 시세 즉시 실행
