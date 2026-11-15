/* =========================================================================
   FEI · HEL 인간환경연구실 — 구성원 소개 데이터
   =========================================================================
   각 구성원은 자기 객체 하나만 고치면 됩니다. 다른 사람의 항목은 건드리지 마세요.

   1) 아래 LAB_MEMBERS 배열에서 자기 이름이 있는 객체를 찾습니다.
   2) "bioKo" 에 국문 소개글을 씁니다. (2~4문장 권장, 빈 줄로 문단 구분)
   3) "headline" 에 카드에 보일 한 줄 소개를 씁니다. (비우면 bioKo 첫 부분이 나옵니다)
   4) "interests"(연구 관심사), "keywords"(키워드), "links"(링크), "email"을 채웁니다.
      - interests / keywords 는 ["산림치유", "열환경"] 처럼 큰따옴표로 감싼 목록입니다.
      - links 는 [{ "label": "Google Scholar", "href": "https://..." }] 형태입니다.
   5) 사진을 넣으려면 assets/members/ 에 정사각형 이미지를 넣고
      "photo": "assets/members/내이름.jpg" 한 줄을 추가합니다.
      (아직 사진이 없을 때 이니셜 대신 보여 줄 그림을 쓰려면
       "avatar": "assets/members/꽃.jpg" 를 씁니다. 사진이 있으면 사진이 먼저 나옵니다.)
   6) 저장하고 커밋하면 사이트 카드에 바로 반영됩니다.

   잘 모르겠으면 사이트의 「내 소개글 작성하기」를 쓰세요.
   입력한 내용이 이 파일에 그대로 붙일 수 있는 형식으로 만들어집니다.

   ※ name / program / id 는 명단 관리용입니다. 바꾸지 마세요.
   ※ "pending": true 는 아직 소개글을 받지 않은 상태입니다.
     이름과 과정만 표시되고, 소개글 자리와 버튼은 나오지 않습니다.
   ========================================================================= */

window.LAB_MEMBERS = [
  {
    "id": "geonwoo-kim",
    "name": "김건우",
    "nameEn": "Geonwoo Kim",
    "program": "pi",
    "tag": "PI",
    "headline": "숲의 환경과 사람의 건강을 데이터로 연결합니다",
    "bioKo": "산림치유와 산림환경 데이터를 연결하는 연구를 수행해 왔습니다. 국립산림과학원에서 산림복지와 산림치유 연구를 거쳐 2024년부터 경상국립대학교에서 인간환경연구실을 이끌고 있으며, GPS 활동 기록과 보건의료 데이터, 산림구조·미기상 정보를 결합해 근거 기반 산림치유의 조건을 규명하는 데 집중하고 있습니다.",
    "bioEn": "Assistant Professor at the Department of Forest Environmental Resources, Gyeongsang National University, leading research at the intersection of forest medicine, environmental health, and applied AI.",
    "interests": ["산림치유", "자연기반 사회적 처방", "산림환경 공간분석", "가명정보 결합 연구"],
    "keywords": ["NVOC", "미기상", "가명결합", "산림복지"],
    "email": "bkim5020@gnu.ac.kr",
    "links": [
      { "label": "Google Scholar", "href": "https://scholar.google.com/citations?hl=en&user=WHwl92YAAAAJ" },
      { "label": "ORCID", "href": "https://orcid.org/0000-0002-7099-2223" }
    ]
  },
  {
    "id": "doyun-song",
    "name": "송도윤",
    "nameEn": "Song Doyun",
    "avatar": "assets/members/flower-doyun-song.jpg",
    "program": "phd",
    "tag": "박사과정",
    "pending": true,
    "headline": "",
    "bioKo": "",
    "bioEn": "",
    "interests": [],
    "keywords": [],
    "email": "doyun2512@gnu.ac.kr",
    "links": []
  },
  {
    "id": "seoyeong-cho",
    "name": "조서영",
    "nameEn": "Cho Seoyeong",
    "photo": "assets/members/seoyeong-cho.jpg",
    "program": "phd",
    "tag": "박사과정",
    "headline": "도시숲의 구조와 열환경을 공간 데이터로 분석합니다",
    "bioKo": "i-Tree와 CFD(전산유체역학), GIS를 함께 활용해 도시숲의 구조와 바람·열 환경을 분석합니다. 수종과 배치가 실제 미기후와 체감 열환경에 어떤 차이를 만드는지 시뮬레이션으로 살피고, 그 결과를 숲 조성과 관리 방안으로 옮기는 연구를 합니다.",
    "bioEn": "",
    "interests": ["도시숲 구조 분석", "열·바람 환경 시뮬레이션", "GIS 공간분석"],
    "keywords": ["i-Tree", "CFD", "GIS"],
    "email": "whtjdud010@gnu.ac.kr",
    "links": []
  },
  {
    "id": "jonghye-park",
    "name": "박종혜",
    "nameEn": "Park Jonghye",
    "avatar": "assets/members/flower-jonghye-park.jpg",
    "program": "phd",
    "tag": "박사과정",
    "pending": true,
    "headline": "",
    "bioKo": "",
    "bioEn": "",
    "interests": [],
    "keywords": [],
    "email": "",
    "links": []
  },
  {
    "id": "gaeun-kwon",
    "name": "권가은",
    "nameEn": "Kwon Gaeun",
    "photo": "assets/members/gaeun-kwon.jpg",
    "program": "ms",
    "tag": "석사과정",
    "headline": "산림·환경 정책을 데이터로 검증합니다",
    "bioKo": "산림·환경 정책이 실제 이용자에게 어떻게 닿는지를 데이터로 확인하는 연구를 합니다. 공공 통계와 이용 기록을 분석해 산림복지 서비스의 수요와 격차를 드러내고, 정책 대안과 평가 지표를 함께 제안합니다.",
    "bioEn": "",
    "interests": ["산림복지 정책", "환경 정책 평가", "공공데이터 분석"],
    "keywords": ["빅데이터", "정책연구", "산림복지"],
    "email": "rkdms04@gnu.ac.kr",
    "links": []
  },
  {
    "id": "sieon-kim",
    "name": "김시언",
    "nameEn": "Kim Sieon",
    "photo": "assets/members/sieon-kim.jpg",
    "program": "ms",
    "tag": "석사과정 · 랩 매니저",
    "manager": true,
    "headline": "숲의 VOC를 측정하고 데이터로 관리합니다",
    "bioKo": "산림 대기 중 VOC(휘발성유기화합물)와 NVOC 농도가 기상과 임분 조건에 따라 어떻게 달라지는지를 측정하고 분석합니다. 관측 자료와 공개 데이터를 결합해 피톤치드 노출을 예측하는 모델을 다루며, 연구실의 데이터 수집과 관리 체계를 맡고 있습니다.",
    "bioEn": "",
    "interests": ["NVOC 측정·예측", "대기환경 데이터", "연구 데이터 관리"],
    "keywords": ["VOC", "NVOC", "빅데이터"],
    "email": "chieon@gnu.ac.kr",
    "links": []
  },
  {
    "id": "minseo-park",
    "name": "박민서",
    "nameEn": "Park Minseo",
    "photo": "assets/members/minseo-park.jpg",
    "program": "ms",
    "tag": "석사과정",
    "headline": "경관을 보는 사람의 인지와 회복을 연구합니다",
    "bioKo": "숲과 경관을 바라볼 때 사람의 시각적 인지와 정서 반응이 어떻게 달라지는지를 연구합니다. 설문과 실험 데이터, 공개 데이터를 함께 분석해 경관 요소와 회복감의 관계를 정리하고, 산림치유 공간의 설계 근거를 만듭니다.",
    "bioEn": "",
    "interests": ["경관 시각인지", "회복감 평가", "빅데이터 분석"],
    "keywords": ["시각인지", "경관", "빅데이터"],
    "email": "environment@gnu.ac.kr",
    "links": []
  },
  {
    "id": "jeongmin-jo",
    "name": "조정민",
    "nameEn": "Jo Jeongmin",
    "photo": "assets/members/jeongmin-jo.jpg",
    "program": "ms",
    "tag": "석사과정",
    "headline": "산림 공간을 3차원으로 모델링합니다",
    "bioKo": "GIS와 Rhino 3D를 이용해 산림 공간을 모델링하고, 지형과 시설 배치가 이용자의 동선과 체험에 미치는 영향을 분석합니다. 공간정보를 3차원으로 재구성해 치유의 숲 계획과 시설 설계를 검토하는 작업을 합니다.",
    "bioEn": "",
    "interests": ["공간정보 모델링", "3D 공간 설계", "GIS 분석"],
    "keywords": ["GIS", "Rhino 3D", "공간모델링"],
    "email": "wh8508@gnu.ac.kr",
    "links": []
  }
];
