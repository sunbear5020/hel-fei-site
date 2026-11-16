# FEI · HEL — 인간환경연구실 (Human & Environmental Lab)

경상국립대학교 환경산림과학부 산림환경자원학과 인간환경연구실의 공식 홈페이지입니다.
**Formula for Environmental Intelligence (FEI) · Human & Environmental Lab (HEL)**

- 산림치유 & 건강영향 · 산림환경·미기상·임상도 공간분석 · 가명정보 기반 맞춤 처방 · 대국민 산림복지 서비스

## 사이트

정적 사이트입니다. 빌드 과정이 없으며, `index.html`을 열면 바로 동작합니다.

```
index.html            페이지 마크업
style.css             디자인 시스템과 반응형 레이아웃
app.js                내비게이션, 스크롤 리빌, 논문·연구과제 연도 필터, 구성원 카드,
                      소개글 작성기, 사진첩과 라이트박스 (의존성 없음)
data/members.js       구성원 소개 데이터 (아래 '내 소개글 고치기')
gallery.json          사진첩 목록 (아래 '사진 추가하기')
assets/               로고, 첫 화면 배너(hero-banner.jpg · 원본 hero-silhouette.jpg), 구성원 사진(members/),
                      사진첩(gallery/thumb · gallery/full)
tools/                첫 화면 배너·다국어 자료를 만드는 스크립트, 사진첩 도우미
```

### 첫 화면 배너 (원본 그림 + 움직임)

첫 화면 아래쪽 배너는 연구실이 받은 원래 실루엣 그림(`assets/hero-silhouette.jpg`)을 **그대로** 씁니다.
등대, 배낭 멘 하이커, 새와 나비, 사진가, 자전거, 나무 심는 아이, 물가의 작은 곰과 오리 —
그림 자체는 다시 그리지 않았고, 물가의 곰 왼쪽에 **여우와 순록**만 같은 화이트 실루엣으로 더했습니다
(`assets/hero-banner.jpg`).

움직임은 그림 위에 얹은 투명한 빛·안개 레이어입니다(`style.css`의 `.hero-*`, `index.html`의 `hero-art` 마커).

- 그림 자체: 아주 느린 호흡(1.002 → 1.027, 42초)과 미세한 이동
- 등대: 램프에서 번지는 따뜻한 빛의 명멸(9.5초)과 부드러운 빔 스윕(24초)
- 숲·물가: 안개 세 겹이 66~94초 주기로 흐르고, 물빛 잔물결이 천천히 흔들립니다
- 하늘: 작은 빛 입자 18개가 천천히 떠다니고, 아주 옅은 빛결이 지나갑니다
- 마우스·스크롤: 층마다 깊이(0.4~3.2)를 달리해 은은하게 반응합니다(패럴랙스, `app.js`)
- `prefers-reduced-motion: reduce`: 모든 움직임이 멈춘 정지 그림으로 보입니다

```bash
python3 tools/make_hero_banner.py     # 원본 + 여우·순록 → assets/hero-banner.jpg
```

`tools/make_hero_banner.py`는 원본 JPG를 열어 `tools/hero-animals/`의 실루엣 두 장을 물가에 얹기만 합니다
(위치·크기는 스크립트의 `PLACEMENTS`에서 조정). 원본 `assets/hero-silhouette.jpg`는 손대지 않으므로
언제든 다시 만들 수 있고, 그림 속 등대·사람·곰은 픽셀 단위로 그대로 남습니다.
모바일에서도 사진 비율(3200:1185)을 유지해 여우·순록·등대가 잘리지 않습니다.

## 내 소개글 고치기 (구성원용)

소개글은 `data/members.js` 한 파일에 모여 있습니다. **자기 객체 하나만** 고치면 됩니다.

1. `data/members.js`를 열고 자기 이름이 있는 객체를 찾습니다.

   ```js
   {
     "id": "seoyeong-cho",
     "name": "조서영",
     "nameEn": "Cho Seoyeong",
     "photo": "assets/members/seoyeong-cho.jpg",
     "program": "phd",
     "tag": "박사과정",
     "headline": "도시숲의 구조와 열환경을 공간 데이터로 분석합니다",
     "bioKo": "i-Tree와 CFD, GIS를 …",
     "bioEn": "",
     "interests": ["도시숲 구조 분석", "GIS 공간분석"],
     "keywords": ["i-Tree", "CFD", "GIS"],
     "email": "whtjdud010@gnu.ac.kr",
     "links": []
   },
   ```

2. 고칠 수 있는 항목
   - `headline` — 카드에 보이는 한 줄 소개 (비우면 `bioKo` 앞부분이 나옵니다)
   - `bioKo` — 국문 소개글. 2~4문장이면 충분하고, 빈 줄로 문단을 나눌 수 있습니다.
   - `bioEn` — 영문 소개 (선택)
   - `interests` — 연구 관심사 목록, `keywords` — 키워드 목록 (큰따옴표로 감싼 목록)
   - `email` — 공개할 메일 주소
   - `links` — `[{ "label": "ORCID", "href": "https://orcid.org/…" }]`
   - `photo` — 사진을 넣으려면 `assets/members/`에 정사각형 이미지를 넣고
     `"photo": "assets/members/내이름.jpg"` 한 줄을 추가합니다.

3. `id` / `name` / `program` / `tag`는 명단 관리용이므로 바꾸지 마세요.
   아직 소개글을 받지 않은 구성원은 `"pending": true`로 두면 이름과 과정만 표시됩니다.

4. 저장한 뒤 커밋합니다.

   ```bash
   git add data/members.js
   git commit -m "docs: 조서영 소개글 수정"
   git push
   ```

**코드를 만지지 않고 하려면** 사이트의 구성원 섹션에서 「내 소개글 작성하기」를 누르세요.
입력한 내용이 카드 미리보기와 `members.js`에 그대로 붙일 수 있는 형식으로 만들어지고,
JSON을 복사하거나 메일로 보낼 수 있습니다.

## 사진 추가하기 (사진첩)

사진첩은 `gallery.json` 목록으로 그려집니다. 사진을 넣는 방법은 두 가지입니다.

**1) 스크립트로 한 번에 (권장)** — 리사이즈와 목록 추가를 같이 합니다.

```bash
python3 tools/add-gallery-photo.py ~/Desktop/photo.jpg \
    --slug table-mountain \
    --caption "테이블마운틴에서" \
    --tag "케이프타운"
```

**2) 직접 넣기**

1. 원본을 `assets/gallery/full/<이름>.jpg` (긴 변 1500px 정도), 그리드용 정사각형을
   `assets/gallery/thumb/<이름>.jpg` (720×720)로 저장합니다.
2. `gallery.json`의 `photos` 배열 끝에 한 줄을 추가합니다.

   ```json
   {
     "src": "assets/gallery/full/table-mountain.jpg",
     "thumb": "assets/gallery/thumb/table-mountain.jpg",
     "alt": "테이블마운틴에서 바라본 시내",
     "caption": "테이블마운틴에서",
     "tag": "케이프타운"
   }
   ```

`tag`가 같으면 사진첩 위의 필터 버튼 하나로 묶입니다. 새 `tag`를 쓰면 버튼이 자동으로 생깁니다.
사진은 그리드에서 3열 정사각형으로 보이고, 누르면 크게 보기(라이트박스)가 열립니다.

## 배포 (GitHub Pages)

1. 저장소 `Settings → Pages`에서 Source를 **Deploy from a branch**로 선택합니다.
2. Branch를 **main**, 폴더를 **/(root)** 로 지정하고 저장합니다.
3. 잠시 후 `https://sunbear5020.github.io/hel-fei-site/` 에서 확인할 수 있습니다.

## 다국어 (KR · EN · JP · ZH)

헤더 오른쪽의 `KR EN JP ZH` 버튼으로 전환합니다. 선택은 `localStorage`(`fei-hel-lang`)에 남고,
`?lang=ko|en|ja|zh` 로 바로 열 수도 있습니다. `<html lang>`도 함께 바뀝니다.

| 파일 | 역할 |
| --- | --- |
| `i18n.js` | 언어 전환 엔진(문자열·속성·블록 번역, 국문 복원) |
| `i18n-data.js` | 번역 사전 — **직접 고치지 말고** 아래 원본을 고친 뒤 다시 생성 |
| `tools/i18n_1.py` ~ `i18n_4.py` | 번역 원본(국문 원문 + EN/JA/ZH) |
| `tools/build_i18n.py` | `i18n-data.js` 생성 · 번역 누락 점검 |
| `data/members-i18n.js` | 구성원 소개글(국문은 `data/members.js`)의 EN/JA/ZH |

문구를 고칠 때:

```bash
python3 tools/build_i18n.py --check   # 번역 없는 국문 문자열 확인 후 i18n-data.js 재생성
```

`index.html`의 국문을 고치면 같은 문장을 `tools/i18n_*.py`에서도 찾아 고쳐 주세요
(`--check`가 누락된 문장을 알려 줍니다). 일본어·중국어는 `word-break: normal`로
글자 단위 줄바꿈을 쓰고, 국문은 기존 `keep-all`을 유지합니다.

## 프로젝트

- **숲결 (Soopgyeol)** — 대국민 산림치유 맞춤 추천 프로토타입
  https://sunbear5020.github.io/forest-healing-prototype/

## 연락처

- 경상국립대학교 농업생명과학대학 2호관(452동) 237호
- bkim5020@gnu.ac.kr · 055-772-1852

---

© FEI · HEL, Gyeongsang National University.
