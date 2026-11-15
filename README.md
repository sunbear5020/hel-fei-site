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
assets/               로고, 첫 화면 아트워크(hero-silhouette.jpg), 구성원 사진(members/),
                      사진첩(gallery/thumb · gallery/full)
tools/                사진첩에 사진을 넣는 도우미 스크립트
```

> `assets/hero-silhouette.jpg` 는 연구실이 받은 배너용 PDF(등대·하이커·새·사진가·자전거·나무 심는 아이 실루엣)를
> 사이트 팔레트에 맞춰 다시 그린 첫 화면 아트워크입니다. 곰 실루엣은 SVG Repo의
> 'Bear Side View Silhouette'(무료 배포 벡터)를 사용했습니다.

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

## 프로젝트

- **숲결 (Soopgyeol)** — 대국민 산림치유 맞춤 추천 프로토타입
  https://sunbear5020.github.io/forest-healing-prototype/

## 연락처

- 경상국립대학교 농업생명과학대학 2호관(452동) 237호
- bkim5020@gnu.ac.kr · 055-772-1852

---

© FEI · HEL, Gyeongsang National University.
