# -*- coding: utf-8 -*-
"""FEI · HEL — 번역 (4/4): HTML 블록 · 정규식 패턴 · 사진첩 캡션"""

BLOCKS = {
    "about-title": {
        "en": "A lab that fills the gaps<br />between forest and health",
        "ja": "森と健康のあいだの<br />空白を埋める研究室",
        "zh": "填补森林与健康之间<br />空白的研究室",
    },
    "pub-note": {
        "en": ('The full list and citation counts are also available on '
               '<a href="https://scholar.google.com/citations?hl=ko&amp;user=WHwl92YAAAAJ" target="_blank" rel="noopener">Google Scholar</a> '
               'and <a href="https://orcid.org/0000-0002-7099-2223" target="_blank" rel="noopener">ORCID</a>. '
               'Citation counts shown are as of November 2026.'),
        "ja": ('全リストと被引用情報は '
               '<a href="https://scholar.google.com/citations?hl=ko&amp;user=WHwl92YAAAAJ" target="_blank" rel="noopener">Google Scholar</a> と '
               '<a href="https://orcid.org/0000-0002-7099-2223" target="_blank" rel="noopener">ORCID</a> でもご確認いただけます。'
               '表示している被引用数は2026年11月時点のものです。'),
        "zh": ('完整列表与被引信息也可在 '
               '<a href="https://scholar.google.com/citations?hl=ko&amp;user=WHwl92YAAAAJ" target="_blank" rel="noopener">Google Scholar</a> 与 '
               '<a href="https://orcid.org/0000-0002-7099-2223" target="_blank" rel="noopener">ORCID</a> 查看。'
               '所示被引次数以2026年11月为准。'),
    },
    "bio-help": {
        "en": ('What you write below becomes a card preview and JSON in the <code>members.js</code> format at once. '
               'Copy the JSON into your entry in <code>data/members.js</code>, or send it by email, and the lab will add it.'),
        "ja": ('下に入力した内容は、カードのプレビューと <code>members.js</code> 形式のJSONとしてすぐに作られます。'
               'JSONをコピーして <code>data/members.js</code> のご自身の項目に貼り付けるか、メールでお送りいただければ研究室で反映します。'),
        "zh": ('下方填写的内容会立即生成卡片预览和 <code>members.js</code> 格式的 JSON。'
               '把 JSON 复制到 <code>data/members.js</code> 中你的条目，或通过邮件发送，实验室会为其更新。'),
    },
    "roster-note": {
        "en": ("Press a card to expand the profile. Members who have not registered a profile yet are marked <em>coming soon</em>."),
        "ja": ("カードを押すと紹介文が開きます。まだ紹介文が登録されていないメンバーは<em>準備中</em>と表示されます。"),
        "zh": ("点击卡片可展开简介。尚未登记简介的成员显示为<em>待补充</em>。"),
    },
    "bio-cta-copy": {
        "en": ('Enter a name, one-line summary, research interests and keywords, email and links, and a card preview '
               'and JSON in the <code>members.js</code> format are built right away. Copy the JSON into the file or send it by email '
               'and it will be published on this page. Three minutes is enough.'),
        "ja": ('氏名、一行紹介、研究関心とキーワード、メール・リンクを入力すると、カードのプレビューと '
               '<code>members.js</code> 形式のJSONがすぐに作られます。JSONをファイルに貼り付けるか、メールでお送りいただければ本ページに掲載されます。'
               '所要時間は3分ほどです。'),
        "zh": ('填写姓名、一句话简介、研究兴趣与关键词、邮箱和链接，即可立即生成卡片预览和 '
               '<code>members.js</code> 格式的 JSON。把 JSON 粘贴到文件或通过邮件发送，就会发布在本页面。三分钟足够。'),
    },
    "member-noscript": {
        "en": ('Member profiles are shown with JavaScript. You can read the content in '
               '<a href="data/members.js">data/members.js</a>.'),
        "ja": ('メンバー紹介はJavaScriptで表示されます。内容は <a href="data/members.js">data/members.js</a> で確認できます。'),
        "zh": ('成员简介通过 JavaScript 显示。内容可在 <a href="data/members.js">data/members.js</a> 中查看。'),
    },
}

PATTERNS = [    {
        "re": r"^피인용 (\d+)$",
        "en": "Cited {1}",
        "ja": "被引用{1}件",
        "zh": "被引{1}次",
    },
    {
        "re": r"^전체 논문 (\d+)편$",
        "en": "All {1} papers",
        "ja": "全{1}編",
        "zh": "全部{1}篇",
    },
    {
        "re": r"^전체 연구과제 (\d+)건$",
        "en": "All {1} projects",
        "ja": "全{1}件",
        "zh": "全部{1}项",
    },
    {
        "re": r"^(\d{4})년 (\d+)편$",
        "en": "{1} · {2} papers",
        "ja": "{1}年 {2}編",
        "zh": "{1}年 {2}篇",
    },
    {
        "re": r"^(\d{4})년 (\d+)건$",
        "en": "{1} · {2} projects",
        "ja": "{1}年 {2}件",
        "zh": "{1}年 {2}项",
    },
    {
        "re": r"^사진 (\d+)장$",
        "en": "{1} photos",
        "ja": "写真{1}枚",
        "zh": "{1}张照片",
    },
]

CAPTIONS = [
    ("짱안의 강과 석회암 봉우리", "River and limestone peaks of Trang An",
     "チャンアンの川と石灰岩の峰", "长安的河流与石灰岩山峰"),
    ("하노이 구시가지의 밤", "Night in Hanoi's Old Quarter", "ハノイ旧市街の夜", "河内老城区的夜晚"),
    ("성요셉성당", "St Joseph's Cathedral", "聖ヨセフ聖堂", "圣若瑟主教座堂"),
    ("테이블마운틴 프레임", "Table Mountain frame", "テーブルマウンテンのフレーム", "桌山相框"),
    ("케이프포인트 바위 지대", "Cape Point rocks", "ケープポイントの岩場", "开普角岩石区"),
    ("케이프 해안선", "Cape coastline", "ケープの海岸線", "开普海岸线"),
    ("볼더스비치의 바위와 바다", "Boulders Beach rocks and sea", "ボルダーズビーチの岩と海", "博尔德斯海滩的岩石与海"),
    ("볼더스비치의 펭귄", "Penguins at Boulders Beach", "ボルダーズビーチのペンギン", "博尔德斯海滩的企鹅"),
    ("모래 위의 발자국", "Footprints in the sand", "砂の上の足跡", "沙地上的足迹"),
    ("해 질 무렵의 케이프타운", "Cape Town at dusk", "夕暮れのケープタウン", "黄昏的开普敦"),
    ("테이블마운틴 케이블카", "Table Mountain cable car", "テーブルマウンテンのケーブルカー", "桌山缆车"),
    ("아가판서스가 핀 정원", "A garden of agapanthus", "アガパンサスの咲く庭", "百子莲盛开的花园"),
    ("포스터 세션 발표", "Presenting at the poster session", "ポスターセッションでの発表", "海报展示环节的报告"),
    ("학회장에서", "At the conference venue", "学会会場にて", "在会议现场"),
    ("점프샷", "Jump shot", "ジャンプ写真", "跳跃合影"),
    ("요트 위에서", "On the yacht", "ヨットの上で", "在游艇上"),
    ("트레킹", "Trekking", "トレッキング", "徒步"),
    ("바닷가 산책로", "Seaside boardwalk", "海辺の遊歩道", "海边步道"),
    ("18th World Congress on Public Health", "18th World Congress on Public Health",
     "第18回世界公衆衛生会議", "第18届世界公共卫生大会"),
    ("세션장", "Session room", "セッション会場", "分会场"),
    ("공원 화단의 꽃", "Flowers in a park bed", "公園の花壇の花", "公园花坛的花"),
    ("홍콩공원 산책로", "Hong Kong Park promenade", "香港公園の遊歩道", "香港公园步道"),
    ("분수대 앞에서", "By the fountain", "噴水の前で", "在喷泉前"),
    ("나무 그늘 산책로", "Shaded path", "木陰の遊歩道", "树荫步道"),
    ("초록이 가득한 돔", "A dome full of green", "緑あふれるドーム", "绿意满溢的穹顶"),
    ("공원에서 본 스카이라인", "Skyline from the park", "公園から見たスカイライン", "从公园望去的天际线"),
    ("빅토리아피크에서", "From Victoria Peak", "ビクトリアピークにて", "在太平山顶"),
    ("피크 전망대", "Peak lookout", "ピーク展望台", "山顶观景台"),
    ("피크에서", "On the Peak", "ピークにて", "在山顶"),
    ("피크에서 내려다본 도심", "The city from the Peak", "ピークから見下ろす市街", "从山顶俯瞰市区"),
    ("피크 테라스에서 함께", "Together on the Peak terrace", "ピークテラスで一緒に", "在山顶露台合影"),
    ("미드레벨스의 벽화 골목", "Mural alley in Mid-Levels", "ミッドレベルズの壁画横丁", "半山壁画小巷"),
    ("벽화 앞", "In front of the mural", "壁画の前", "壁画前"),
    ("골목 풍경", "Alley scene", "路地の風景", "小巷风景"),
    ("골목에서", "In the alley", "路地にて", "在小巷"),
    ("소호의 언덕길", "SoHo's uphill lanes", "ソーホーの坂道", "苏豪的坡道"),
    ("쇼핑몰의 에스컬레이터", "Escalators in a mall", "ショッピングモールのエスカレーター", "商场扶梯"),
    ("야시장 노점", "Night-market stall", "夜市の屋台", "夜市摊位"),
    ("에그와플", "Egg waffle", "エッグワッフル", "鸡蛋仔"),
    ("전시장의 건축 모델", "Architectural model at an exhibition", "展示場の建築模型", "展场的建筑模型"),
    ("왕궁의 지붕", "Roofs of the Grand Palace", "王宮の屋根", "王宫的屋顶"),
    ("왕궁의 수호상", "Guardian statue at the Grand Palace", "王宮の守護像", "王宫的守护像"),
    ("위병 행렬", "Changing of the guard", "衛兵の行進", "卫兵列队"),
    ("루프탑 수영장", "Rooftop pool", "ルーフトップのプール", "屋顶泳池"),
    ("루프탑에서 함께", "Together on the rooftop", "ルーフトップで一緒に", "在屋顶合影"),
    ("방콕의 사거리", "A Bangkok intersection", "バンコクの交差点", "曼谷的十字路口"),
    ("가로수의 붉은 꽃", "Red blossoms on a street tree", "街路樹の赤い花", "行道树上的红花"),
    ("수초 수조", "Aquatic plant tank", "水草水槽", "水草缸"),
    ("길거리 음식 노점", "Street-food stall", "屋台のストリートフード", "街头小吃摊"),
    ("골목 국수집", "Noodle shop in an alley", "路地の麺屋", "巷子里的面馆"),
    ("저녁 노점", "Evening street stall", "夕暮れの屋台", "傍晚的摊位"),
    ("시장의 구슬 노점", "Bead stall at the market", "市場のビーズ屋台", "市场的珠饰摊"),
    ("시장 골목", "Market alley", "市場の路地", "市场小巷"),
    ("주스 노점", "Juice stall", "ジュース屋台", "果汁摊"),
    ("쌀국수 한 그릇", "A bowl of rice noodles", "ライスヌードル一杯", "一碗米粉"),
]

EXTRA = [
    ("김건우 교수", "Professor Geonwoo Kim", "金建佑教授", "金建佑教授"),
    ("연도별로 논문 보기", "Filter publications by year", "年別に論文を見る", "按年份查看论文"),
    ("전체", "All", "すべて", "全部"),
    ("특허", "Patents", "特許", "专利"),
]

EXTRA += [
    # hero manifesto labels (English in the Korean page, translated for JA/ZH)
    ("What we study", "What we study", "私たちが研究すること", "我们研究什么"),
    ("Why it matters", "Why it matters", "なぜ重要なのか", "为何重要"),
]

EXTRA += [
    # singular counts
    ("2020년 1편", "2020 · 1 paper", "2020年 1編", "2020年 1篇"),
]

EXTRA += [
    ("찾아오시는 길", "Getting here", "行き方", "到达方式"),
]

EXTRA += [
    ("지도에서 열기", "Open in maps", "地図で開く", "在地图中打开"),
]

EXTRA += [
    # SEO head (title · description · keywords · OG/Twitter cards)
    ("경상국립대학교 환경산림과학부 산림환경자원학과 김건우 교수의 인간환경연구실(FEI · HEL · Formula for Environmental Intelligence, Human & Environmental Lab). 산림치유, 산림환경·미기상 공간분석, 가명정보 결합 연구와 대국민 산림복지 서비스 「숲결」을 연구합니다.",
     "The Human & Environmental Lab of Professor Geonwoo Kim, Department of Forest Environmental Resources, Gyeongsang National University (FEI · HEL · Formula for Environmental Intelligence, Human & Environmental Lab). We study forest healing, forest environment and microclimate spatial analysis, pseudonymized data linkage, and the public forest-welfare service Soopgyeol.",
     "慶尚国立大学校 環境林産科学部 森林環境資源学科 金建佑教授の人間環境研究室（FEI · HEL · Formula for Environmental Intelligence, Human & Environmental Lab）。森林癒し、森林環境・微気象の空間解析、仮名情報の結合研究、国民向け森林福祉サービス「森結（スプキョル）」を研究しています。",
     "庆尚国立大学环境林产科学部森林环境资源学科金建佑教授的人类环境研究室（FEI · HEL · Formula for Environmental Intelligence, Human & Environmental Lab）。研究森林疗愈、森林环境与微气象空间分析、假名信息结合，以及面向公众的森林福祉服务「森结」。"),
    ("경상국립대학교, 김건우, 김건우 교수, 경상국립대 김건우, 산림환경자원학과, 환경산림과학부, 인간환경연구실, FEI · HEL, FEI, HEL, 산림치유, 숲결, 산림복지, 산림환경, 미기상, 산림치유 효과, 가명정보 결합, 경상국립대학교 산림환경자원학과 교수",
     "Gyeongsang National University, Geonwoo Kim, Professor Geonwoo Kim, Department of Forest Environmental Resources, College of Agriculture and Life Sciences, Human & Environmental Lab, FEI · HEL, forest healing, Soopgyeol, forest welfare, forest environment, microclimate, pseudonymized data linkage",
     "慶尚国立大学校, 金建佑, 金建佑教授, 森林環境資源学科, 環境林産科学部, 人間環境研究室, FEI · HEL, 森林癒し, 森結, 森林福祉, 森林環境, 微気象, 仮名情報の結合",
     "庆尚国立大学, 金建佑, 金建佑教授, 森林环境资源学科, 环境林产科学部, 人类环境研究室, FEI · HEL, 森林疗愈, 森结, 森林福祉, 森林环境, 微气象, 假名信息结合"),
    ("김건우 (Geonwoo Kim), FEI · HEL, Gyeongsang National University",
     "Geonwoo Kim, FEI · HEL, Gyeongsang National University",
     "金建佑 (Geonwoo Kim), FEI · HEL, 慶尚国立大学校",
     "金建佑 (Geonwoo Kim), FEI · HEL, 庆尚国立大学"),
    ("FEI · HEL 인간환경연구실 · 경상국립대학교",
     "FEI · HEL Human & Environmental Lab · Gyeongsang National University",
     "FEI · HEL 人間環境研究室 · 慶尚国立大学校",
     "FEI · HEL 人类环境研究室 · 庆尚国立大学"),
    ("경상국립대학교 김건우 교수 · FEI · HEL 인간환경연구실",
     "Professor Geonwoo Kim, Gyeongsang National University · FEI · HEL Human & Environmental Lab",
     "慶尚国立大学校 金建佑教授 · FEI · HEL 人間環境研究室",
     "庆尚国立大学金建佑教授 · FEI · HEL 人类环境研究室"),
    ("등대에서 곰과 여우, 순록까지 이어지는 FEI · HEL 연구실 실루엣 배너",
     "The FEI · HEL silhouette banner: from the lighthouse to the bear, the fox and the reindeer",
     "灯台から熊、キツネ、トナカイへと続く FEI · HEL 研究室のシルエットバナー",
     "从灯塔到小熊、狐狸与驯鹿的 FEI · HEL 研究室剪影横幅"),
    ("“인간은 환경의 일부” — 자연에는 공식이 있습니다. 경상국립대학교 FEI · HEL 인간환경연구실.",
     "“Humans are a part of the environment.” Nature has a formula. FEI · HEL, Gyeongsang National University.",
     "「人間は環境の一部」——自然には公式があります。慶尚国立大学校 FEI · HEL 人間環境研究室。",
     "“人是环境的一部分。”自然之中自有公式。庆尚国立大学 FEI · HEL 人类环境研究室。"),
]

EXTRA += [
    # hero banner (original lab silhouette with the fox and reindeer added)
    ("등대와 배낭을 멘 하이커, 날아오르는 새, 사진을 찍는 사람과 자전거를 타는 사람, "
     "나무를 심는 아이, 물가를 걷는 작은 곰과 여우, 순록을 하나의 숲 지형 실루엣으로 겹쳐 놓은 아트워크",
     "Artwork layering a lighthouse, a hiker with a backpack, birds in flight, a photographer, "
     "a cyclist, a child planting a tree, a small bear, a fox and a reindeer walking by the water "
     "into a single forest-landscape silhouette",
     "灯台とバックパックを背負ったハイカー、飛び立つ鳥、写真を撮る人と自転車に乗る人、木を植える子ども、"
     "水辺を歩く小さな熊とキツネ、トナカイを、ひとつの森の地形のシルエットに重ねたアートワーク",
     "将灯塔、背着背包的徒步者、飞起的鸟、拍照的人和骑车的人、种树的孩子，以及在水边散步的小熊、"
     "狐狸与驯鹿，叠加为一片森林地形剪影的艺术作品"),
    ("등대에서 곰까지, 여우와 순록이 함께 걷는 숲과 물과 사람의 장면.",
     "From lighthouse to bear: forest, water and people, with a fox and a reindeer walking together.",
     "灯台から熊まで、キツネとトナカイが一緒に歩く森と水と人の情景。",
     "从灯塔到小熊，狐狸与驯鹿一同走过的森林、水与人的景象。"),
]
