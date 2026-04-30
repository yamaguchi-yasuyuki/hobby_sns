import type { Category, Facility, Bookmark, FacilityLink } from "@/types"

export const mockCategories: Category[] = [
  { id: "1", name: "温泉・銭湯",   slug: "onsen",   sort_order: 1 },
  { id: "2", name: "キャンプ場",   slug: "camp",    sort_order: 2 },
  { id: "3", name: "スポーツ施設", slug: "sports",  sort_order: 3 },
  { id: "4", name: "文化・芸術",   slug: "culture", sort_order: 4 },
  { id: "5", name: "公園・自然",   slug: "park",    sort_order: 5 },
  { id: "6", name: "宿泊施設",     slug: "lodge",   sort_order: 6 },
  { id: "7", name: "農業体験",     slug: "farm",    sort_order: 7 },
  { id: "8", name: "海・川・湖",   slug: "water",   sort_order: 8 },
]

const img = (seed: string) => `/api/placeholder/${seed}`

const cat = (id: string, name: string, slug: string) => ({ id, name, slug })

const ONSEN   = cat("1", "温泉・銭湯",   "onsen")
const CAMP    = cat("2", "キャンプ場",   "camp")
const SPORTS  = cat("3", "スポーツ施設", "sports")
const CULTURE = cat("4", "文化・芸術",   "culture")
const PARK    = cat("5", "公園・自然",   "park")
const LODGE   = cat("6", "宿泊施設",     "lodge")
const FARM    = cat("7", "農業体験",     "farm")
const WATER   = cat("8", "海・川・湖",   "water")

const REAL_IMAGES: Record<string, string> = {
  onsen:   "/images/onsen.png",
  camp:    "/images/camp.png",
  sports:  "/images/sports.png",
  culture: "/images/culture.png",
  park:    "/images/park.png",
  lodge:   "/images/lodge.png",
  farm:    "/images/farm.png",
  water:   "/images/water.png",
}

type BodyLinks = { body: string; links: FacilityLink[] }

const DETAIL: Record<string, BodyLinks> = {
  "1": {
    body: `北海道・登別市が運営する「登別温泉 鬼見湯」は、市営でありながら本格的な硫黄泉を楽しめる施設です。大人500円という驚きの低価格で、地元民と観光客が共に利用する憩いの場となっています。

【泉質】
含硫黄-カルシウム・ナトリウム-塩化物泉。白濁した湯はなめらかで、皮膚病や疲労回復に効果があるとされています。源泉かけ流しで加水なし。

【施設情報】
内湯（男女別）・露天風呂（男女別）・休憩室完備。タオルのレンタルあり（100円）。シャンプー・ボディソープ備え付け。

【アクセス】
JR登別駅からバスで15分。駐車場80台（無料）。登別温泉街からは徒歩10分の静かな場所にあります。`,
    links: [
      { label: "公式サイト（登別市）", url: "https://www.city.noboribetsu.lg.jp", type: "official" },
      { label: "Googleマップで見る", url: "https://maps.google.com", type: "map" },
    ],
  },
  "8": {
    body: `長野県・松本市が運営する「松本市営アルプス公園キャンプ場」は、北アルプスを一望できる市営キャンプ場です。松本市街から車で20分という好立地ながら、1泊のテントサイト利用料がわずか500円という破格の料金設定が話題を集めています。

【サイト情報】
テントサイト40区画（電源なし）、オートキャンプサイト10区画（電源付き1,000円）。炊事場・トイレ・シャワー室完備。ゴミは指定袋で処分可能（有料）。

【周辺情報】
アルプス公園内にあり、隣接する動植物園（入園200円）の割引券つき。松本城・縄手通りへのアクセスも良好。帰り道に「浅間温泉」に立ち寄るのがローカルの定番コース。

【注意事項】
予約制（松本市公共施設予約システムから申込）。GW・お盆期間は3ヶ月前から予約開始と同時に満杯になることが多い。`,
    links: [
      { label: "松本市公式予約サイト", url: "https://www.city.matsumoto.nagano.jp", type: "reservation" },
      { label: "公園の詳細情報", url: "https://www.city.matsumoto.nagano.jp", type: "official" },
    ],
  },
  "14": {
    body: `島根県・出雲市が運営する「出雲市民スポーツセンター」は、市内最大のスポーツ施設です。プール・体育館・トレーニングルームが一体となった総合施設で、市民料金は破格の安さを誇ります。

【施設・料金（市民価格）】
・25mプール（8コース）：大人300円 / 子ども100円
・トレーニングルーム：大人200円（90分）
・体育館フロア：1時間400円（グループ利用）

【おすすめポイント】
市民以外でも利用可能（市民価格の1.5倍）。平日の昼間は比較的空いており、観光の合間にリフレッシュにも使えます。出雲大社から車で15分の好立地。`,
    links: [
      { label: "出雲市公式サイト", url: "https://www.city.izumo.shimane.jp", type: "official" },
      { label: "施設予約（市民向け）", url: "https://www.city.izumo.shimane.jp", type: "reservation" },
    ],
  },
  "20": {
    body: `兵庫県・篠山市（現丹波篠山市）が運営する「丹波篠山市農業体験農場」は、農業を通じて地域の魅力を伝える施設です。市が管理する棚田や畑で、プロの農家スタッフと共に季節の農作業を体験できます。

【体験内容（一部）】
・春：田植え体験（5月）、野菜苗植え付け
・夏：草刈り・管理作業、夏野菜の収穫
・秋：稲刈り・脱穀体験（9〜10月）
・冬：味噌作り体験、農産物加工

【料金と申込】
体験料：大人1,000〜2,000円（内容による）、子ども500〜1,000円。要予約（丹波篠山市農林業課まで電話またはWEBから）。

【特典】
当日収穫した農産物をお土産として持ち帰れます。地元農家との交流の機会もあり、移住・定住を検討している方にも人気の体験です。`,
    links: [
      { label: "丹波篠山市農林業課", url: "https://www.city.tanbasasayama.lg.jp", type: "official" },
      { label: "体験申込フォーム", url: "https://www.city.tanbasasayama.lg.jp", type: "reservation" },
    ],
  },
}

function makeFacility(
  id: string,
  title: string,
  description: string,
  seed: string,
  photoCount: number,
  operator: string,
  operatorType: Facility["operator_type"],
  categoryObj: Facility["category"],
  locationName: string | null,
  prefecture: string | null,
  admissionFee: string | undefined,
  bookmarkCount: number,
  viewCount: number,
  isBookmarked = false,
): Facility {
  const mainImage = REAL_IMAGES[categoryObj.slug] ?? img(seed)
  const detail = DETAIL[id]
  return {
    id,
    title,
    description,
    body: detail?.body,
    image_url: mainImage,
    images: [
      mainImage,
      ...Array.from({ length: photoCount - 1 }, (_, i) =>
        img(`${seed}-${i}`)
      ),
    ],
    official_url: "https://example.lg.jp",
    operator,
    operator_type: operatorType,
    links: detail?.links,
    category: categoryObj,
    location_name: locationName,
    prefecture,
    admission_fee: admissionFee,
    bookmark_count: bookmarkCount,
    view_count: viewCount,
    status: "published",
    is_bookmarked: isBookmarked,
    created_at: `2026-04-${String(Number(id) % 28 + 1).padStart(2, "0")}T10:00:00+09:00`,
  }
}

function interleaveByCategory(items: Facility[]): Facility[] {
  const groups = new Map<string, Facility[]>()
  for (const item of items) {
    if (!groups.has(item.category.id)) groups.set(item.category.id, [])
    groups.get(item.category.id)!.push(item)
  }
  const cols = Array.from(groups.values())
  const result: Facility[] = []
  const maxLen = Math.max(...cols.map(c => c.length))
  for (let i = 0; i < maxLen; i++) {
    for (const col of cols) {
      if (i < col.length) result.push(col[i])
    }
  }
  return result
}

export const mockFacilities: Facility[] = interleaveByCategory([

  // ─── 温泉・銭湯 ─────────────────────────────────────────
  makeFacility("1",
    "登別市営 鬼見湯 — 本物の硫黄泉が大人500円で楽しめる",
    "北海道・登別市が運営する市営温泉。白濁した硫黄泉を源泉かけ流しで楽しめる本格派。地元民の日常の湯として愛され、観光地化されていない素朴さが魅力。",
    "noboribetsu-onsen", 4, "登別市", "city", ONSEN, "登別温泉", "北海道", "大人500円", 312, 2800, true),

  makeFacility("2",
    "弘前市 百沢温泉 — 岩木山麓の市営温泉でじっくりリフレッシュ",
    "青森・弘前市が運営する市営温泉。岩木山の麓に位置し、単純温泉のやわらかい湯が特徴。地域の農家の方々が農作業後に利用する、素朴で温かみのある施設。",
    "hirosaki-onsen", 3, "弘前市", "city", ONSEN, "百沢温泉", "青森県", "大人350円", 198, 1650),

  makeFacility("3",
    "別府市営 竹瓦温泉 — 100年以上の歴史を持つ公営の名湯",
    "大分・別府市が運営する市営温泉。明治時代の建築様式を残す木造建築が歴史を感じさせる。砂湯（砂蒸し温泉）は別府でも数少ない体験で、大人700円と手頃。",
    "beppu-public", 5, "別府市", "city", ONSEN, "竹瓦温泉", "大分県", "入浴100円（砂湯700円）", 445, 3900),

  makeFacility("4",
    "草津町営 共同浴場 白幡の湯 — 地元民が通う無料の名湯",
    "群馬・草津町が管理する共同浴場。草津温泉の有名な湯畑エリアから少し外れた場所にあり、地元民が日常的に利用する「町のお風呂」。源泉かけ流しで利用は無料。",
    "kusatsu-free", 3, "草津町", "town", ONSEN, "白幡の湯", "群馬県", "無料", 567, 4200),

  makeFacility("5",
    "道後温泉 市営第2分館 — 夜間も楽しめる松山市の公営湯",
    "愛媛・松山市が運営する道後温泉の公営分館。有名な本館と同じ源泉を使用しながら夜22時まで営業。観光客が少なく地元民が利用するため、ゆっくり浸かれる穴場。",
    "dogo-shieiyu", 4, "松山市", "city", ONSEN, "道後温泉", "愛媛県", "大人460円", 289, 2400),

  makeFacility("6",
    "指宿市営 いぶすき温泉 鰻温泉 — 砂蒸し発祥の地で温まる",
    "鹿児島・指宿市が運営する鰻温泉。観光地として有名な砂蒸し温泉より落ち着いた雰囲気で、地元の高齢者が毎日通う本物の湯治場。硫黄泉が豊富に湧き出る。",
    "ibusuki-unagi", 3, "指宿市", "city", ONSEN, "鰻温泉", "鹿児島県", "大人300円", 178, 1420),

  // ─── キャンプ場 ──────────────────────────────────────────
  makeFacility("7",
    "松本市営 アルプスキャンプ場 — 北アルプスを望む市営サイトが500円",
    "長野・松本市が運営するキャンプ場。標高900mから北アルプスの連峰を一望でき、テントサイトは1泊500円という驚きの低価格。市が管理しているため施設も清潔。",
    "matsumoto-camp", 5, "松本市", "city", CAMP, "アルプスキャンプ場", "長野県", "テントサイト500円/泊", 398, 3200),

  makeFacility("8",
    "富士宮市営 朝霧キャンプ場 — 富士山麓の市民休養施設",
    "静岡・富士宮市が運営するキャンプ場。富士山を正面に望む絶好のロケーションで、市民価格は格安。朝霧高原の広大な牧草地帯の中にあり、開放感が抜群。",
    "fujinomiya-camp", 4, "富士宮市", "city", CAMP, "朝霧キャンプ場", "静岡県", "テントサイト800円/泊", 312, 2780),

  makeFacility("9",
    "高山市営 乗鞍キャンプ村 — 日本有数の高山市が管理する自然の宝庫",
    "岐阜・高山市が運営する乗鞍高原のキャンプ場。標高1,450mに位置し、夏でも涼しい高原の朝晩が清々しい。高山市民の割引があり地元ファミリーに大人気。",
    "takayama-camp", 4, "高山市", "city", CAMP, "乗鞍キャンプ村", "岐阜県", "テントサイト600円/泊", 267, 2100),

  makeFacility("10",
    "奥多摩町営 氷川キャンプ場 — 東京・多摩川の清流沿いで1,000円キャンプ",
    "東京都・奥多摩町が運営するキャンプ場。東京都とは思えない豊かな自然の中、多摩川の清流沿いにサイトが広がる。電車でアクセスできる貴重な公営キャンプ場。",
    "okutama-camp", 3, "奥多摩町", "town", CAMP, "氷川キャンプ場", "東京都", "テントサイト1,000円/泊", 523, 4100),

  makeFacility("11",
    "南阿蘇村営 夢の湯キャンプ場 — 阿蘇の大自然を堪能する村営施設",
    "熊本・南阿蘇村が運営するキャンプ場。阿蘇外輪山を一望する絶景の高台に位置し、天然温泉の入浴施設が隣接。温泉付きで1泊700円は破格のコスパ。",
    "minamiaso-camp", 4, "南阿蘇村", "village", CAMP, "夢の湯キャンプ場", "熊本県", "テントサイト700円/泊（温泉入浴込み）", 334, 2600),

  // ─── スポーツ施設 ────────────────────────────────────────
  makeFacility("12",
    "出雲市民スポーツセンター — プール・ジム・体育館が大人300円から",
    "島根・出雲市が運営する総合スポーツ施設。25mプール8コース・トレーニングルーム・多目的体育館を完備。市民料金は驚きの安さで、旅行者も市民価格の1.5倍で利用可能。",
    "izumo-sports", 3, "出雲市", "city", SPORTS, "市民スポーツセンター", "島根県", "プール300円 / ジム200円", 189, 1540),

  makeFacility("13",
    "富良野市営 スキー場 — 北海道・富良野市が運営するゲレンデが格安",
    "北海道・富良野市が一部運営に関与する市民向けスキー場。有名なフラノスキー場とは別の市民向けゲレンデで、リフト1日券が大人2,000円以下というローカル価格。",
    "furano-ski", 5, "富良野市", "city", SPORTS, "市民スキー場", "北海道", "リフト1日券1,800円", 156, 1200),

  makeFacility("14",
    "つくば市営 総合運動公園 — 筑波山を背に楽しむアスレチック施設",
    "茨城・つくば市が運営する総合運動公園。筑波山を望む広大な敷地に、テニスコート・野球場・フットサル場・ランニングコースが揃う。市民は格安で利用可能。",
    "tsukuba-sports", 3, "つくば市", "city", SPORTS, "総合運動公園", "茨城県", "施設による（テニス200円/h）", 143, 1100),

  makeFacility("15",
    "那覇市営 奥武山公園プール — 年中泳げる沖縄の市営プール",
    "沖縄・那覇市が運営する屋外プール。沖縄の温暖な気候を活かし、ほぼ年中利用可能（一部期間は閉場）。市民価格は大人100円と全国でも最安クラス。",
    "naha-pool", 4, "那覇市", "city", SPORTS, "奥武山公園プール", "沖縄県", "大人100円", 234, 1890),

  // ─── 文化・芸術 ──────────────────────────────────────────
  makeFacility("16",
    "小布施町営 北斎館 — 葛飾北斎の傑作が集まる町立美術館",
    "長野・小布施町が運営する美術館。葛飾北斎が晩年に訪れた小布施の地に、北斎の肉筆画や天井絵を集めた本格的な美術館。入館料が1,000円と国立美術館より手頃。",
    "obuse-hokusai", 4, "小布施町", "town", CULTURE, "北斎館", "長野県", "大人1,000円", 345, 2900),

  makeFacility("17",
    "大田市立 石見銀山世界遺産センター — 無料で学べる世界遺産の拠点",
    "島根・大田市が運営する世界遺産の学習施設。世界遺産「石見銀山」の歴史と文化を映像・展示で体験できる。展示エリアへの入場は無料で、銀山への入口にもなっている。",
    "ohda-iwami", 3, "大田市", "city", CULTURE, "石見銀山世界遺産センター", "島根県", "展示館無料", 267, 2200),

  makeFacility("18",
    "高岡市営 富山県の二上山ふるさとの森 文化交流施設",
    "富山・高岡市が運営する文化体験施設。伝統工芸の高岡銅器・漆器の制作体験が市民料金で楽しめる。職人が直接指導してくれる本格的な体験は旅行者にも人気。",
    "takaoka-craft", 3, "高岡市", "city", CULTURE, "ふるさとの森", "富山県", "体験料500円〜", 198, 1640),

  makeFacility("19",
    "萩市営 萩博物館 — 幕末の志士を生んだ城下町の記憶",
    "山口・萩市が運営する市立博物館。長州藩・幕末の歴史を伝える豊富な資料が一般500円で見られる。国宝も含む充実のコレクションは、日本史好きには必訪の場所。",
    "hagi-museum", 4, "萩市", "city", CULTURE, "萩博物館", "山口県", "大人500円", 223, 1850),

  // ─── 公園・自然 ──────────────────────────────────────────
  makeFacility("20",
    "横浜市営 三ッ池公園 — 桜の名所として知られる市営の大公園",
    "神奈川・横浜市が運営する公園。3つの池と350本の桜が織りなす春の絶景は圧巻。入園無料でありながら、バーベキューエリア・ローボート・遊具と充実の設備を誇る。",
    "yokohama-mitsui", 5, "横浜市", "city", PARK, "三ッ池公園", "神奈川県", "入園無料（ボート300円）", 412, 3400),

  makeFacility("21",
    "函館市営 香雪園 — 国の名勝に指定された函館の市営日本庭園",
    "北海道・函館市が運営する日本庭園。明治時代に造営された庭園を市が管理し、入園無料で公開。函館の歴史的な景観とともに、四季折々の自然美が楽しめる。",
    "hakodate-garden", 4, "函館市", "city", PARK, "香雪園", "北海道", "入園無料", 189, 1560),

  makeFacility("22",
    "仙台市営 西公園 — 東北最大の政令市が誇る緑豊かな憩いの場",
    "宮城・仙台市が運営する市民公園。広瀬川沿いに広がる緑地は市民の日常の散歩コース。年間を通じてイベントが開催され、冬はイルミネーションで幻想的な雰囲気に。",
    "sendai-nishi-park", 3, "仙台市", "city", PARK, "西公園", "宮城県", "入園無料", 156, 1230),

  makeFacility("23",
    "種子島町営 西之表市自然公園 — ロケット見学と大自然を同時に体験",
    "鹿児島・西之表市が運営する自然公園。JAXA種子島宇宙センターに近く、ロケット打ち上げ時には見学ポイントとしても機能する。透明度の高い海浜と大自然が同時に楽しめる。",
    "tanegashima-park", 4, "西之表市", "city", PARK, "自然公園", "鹿児島県", "入場無料", 234, 1900),

  // ─── 宿泊施設 ────────────────────────────────────────────
  makeFacility("24",
    "国民宿舎 桂浜荘 — 高知市が関与する絶景の公営宿",
    "高知県が関与する公営宿泊施設。坂本龍馬ゆかりの桂浜を望む絶好のロケーションで、1泊2食付き7,000円台から利用可能。全室から太平洋の雄大な景色が楽しめる。",
    "katsurahama-lodge", 5, "高知県", "prefecture", LODGE, "桂浜荘", "高知県", "1泊2食7,700円〜", 378, 3100),

  makeFacility("25",
    "休暇村 乳頭温泉郷 — 環境省が運営する国立公園内の宿泊施設",
    "秋田県・仙北市の国立公園内にある環境省所管の宿泊施設。乳頭温泉郷の豊富な湯を引いた内湯・露天風呂付きで、1泊2食付き12,000円前後から。自然環境の保全と調和した施設。",
    "nyuto-kyukamura", 5, "環境省", "national", LODGE, "休暇村乳頭温泉郷", "秋田県", "1泊2食12,000円〜", 445, 3800),

  makeFacility("26",
    "阿蘇青少年交流の家 — 文科省が運営する阿蘇の格安宿泊施設",
    "熊本・阿蘇市にある国立の宿泊研修施設。一般の旅行者も空き状況により利用可能で、1泊2食付き4,000円台という破格の料金。阿蘇の自然体験プログラムも充実。",
    "aso-youth", 4, "文部科学省", "national", LODGE, "阿蘇青少年交流の家", "熊本県", "1泊2食4,500円〜", 289, 2300),

  makeFacility("27",
    "国民宿舎 能登小牧台 — 能登半島を一望できる石川県の公営宿",
    "石川・七尾市にある公営宿泊施設。能登半島国定公園内の高台に位置し、七尾湾を見渡す絶景が自慢。地元の海産物を使った料理が好評で、1泊2食8,000円台から。",
    "noto-lodge", 4, "七尾市", "city", LODGE, "能登小牧台", "石川県", "1泊2食8,500円〜", 234, 1900),

  // ─── 農業体験 ────────────────────────────────────────────
  makeFacility("28",
    "丹波篠山市営 農業体験農場 — 棚田で田植え・稲刈りが家族で楽しめる",
    "兵庫・丹波篠山市が運営する農業体験施設。日本の棚田百選にも選ばれた黒豆の里で、田植えから稲刈りまで一連の農作業を体験できる。市が運営するため参加費が割安。",
    "sasayama-farm", 4, "丹波篠山市", "city", FARM, "農業体験農場", "兵庫県", "大人1,000〜2,000円", 267, 2100),

  makeFacility("29",
    "富士見市営 農業体験農園 — 埼玉の市営農園でプロに教わる野菜作り",
    "埼玉・富士見市が運営する体験農園。市が用意した農地を区画ごとに借り、年間を通じた野菜栽培を楽しめる。農業指導員が毎週アドバイスしてくれるので初心者でも安心。",
    "fujimi-farm", 3, "富士見市", "city", FARM, "市営農業体験農園", "埼玉県", "区画利用料7,000円/年", 145, 1140),

  makeFacility("30",
    "南魚沼市営 越後棚田体験センター — 日本一の米どころで本物の農業を体験",
    "新潟・南魚沼市が運営する農業体験施設。魚沼産コシヒカリの産地として名高い棚田で、田植えと稲刈りを体験できる。収穫した米を持ち帰れるのが最大の魅力。",
    "minamiuonuma-rice", 4, "南魚沼市", "city", FARM, "越後棚田体験センター", "新潟県", "体験料2,000円（米持ち帰り込み）", 312, 2450),

  makeFacility("31",
    "西表島 竹富町営 農業体験施設 — 亜熱帯の島で幻の作物を育てる",
    "沖縄・竹富町が運営する農業体験施設。西表島の亜熱帯気候を活かし、島バナナ・サトウキビ・パインアップルの収穫体験が楽しめる。農家の方との交流も深まる場所。",
    "iriomote-farm", 3, "竹富町", "town", FARM, "農業体験施設", "沖縄県", "体験料1,500円", 198, 1580),

  // ─── 海・川・湖 ──────────────────────────────────────────
  makeFacility("32",
    "葉山町営 森戸海岸 — 町が管理する三浦半島の美しい海水浴場",
    "神奈川・葉山町が管理する海水浴場。透明度が高く穏やかな波が特徴で、ファミリーやシュノーケラーに人気。町が管理するため施設が清潔で、駐車場も安価に利用可能。",
    "hayama-beach", 5, "葉山町", "town", WATER, "森戸海岸", "神奈川県", "入場無料（駐車場500円）", 378, 3100),

  makeFacility("33",
    "八戸市営 種差海岸 — 市が整備した天然芝が広がる絶景の海岸",
    "青森・八戸市が整備する種差海岸。天然の芝生が波打ち際まで広がるという日本でも珍しい景観が広がる。遊歩道が整備され、誰でも安全に散策できる。",
    "hachinohe-tanesashi", 4, "八戸市", "city", WATER, "種差海岸", "青森県", "入場無料", 289, 2340),

  makeFacility("34",
    "奥多摩町 白丸湖 — 東京・奥多摩の町が管理する湖でカヌー体験",
    "東京都・奥多摩町が管理する人造湖。湖面が鏡のように静かで、初心者でもカヌーやカヤックを楽しめる。町が運営する安全管理のもと、格安でウォータースポーツが体験できる。",
    "okutama-lake", 3, "奥多摩町", "town", WATER, "白丸湖", "東京都", "カヌー体験2,000円（要予約）", 223, 1760),

  makeFacility("35",
    "糸島市営 芥屋海水浴場 — 玄界灘の透き通る海を市が守る自然の浜",
    "福岡・糸島市が管理する海水浴場。玄界灘の透明度が高い海が広がり、SUPやシュノーケリングを楽しむ人が多い。市が環境保全に力を入れており、毎年きれいな状態を維持。",
    "itoshima-beach", 4, "糸島市", "city", WATER, "芥屋海水浴場", "福岡県", "入場無料", 334, 2700),

  makeFacility("36",
    "五島市営 高浜海水浴場 — 日本三大砂浜の一つが市営で守られている",
    "長崎・五島市が管理する高浜ビーチ。日本三大砂浜の一つとされるエメラルドグリーンの海と白砂の浜が広がる。市の管理により年間を通じて清潔な状態が保たれている。",
    "goto-beach", 5, "五島市", "city", WATER, "高浜海水浴場", "長崎県", "入場無料", 467, 3800),
])

/** 自治体管理画面などで ID 参照用 */
export function getMockFacilityById(id: string): Facility | undefined {
  return mockFacilities.find((f) => f.id === id)
}

export const mockBookmarks: Bookmark[] = [
  {
    id: "b1",
    category: "行きたい場所",
    created_at: "2026-04-10T09:00:00+09:00",
    facility: {
      id: "1",
      title: "登別市営 鬼見湯 — 本物の硫黄泉が大人500円で楽しめる",
      image_url: REAL_IMAGES.onsen,
      category: ONSEN,
      location_name: "登別温泉",
      prefecture: "北海道",
    },
  },
  {
    id: "b2",
    category: "気になる施設",
    created_at: "2026-04-12T09:00:00+09:00",
    facility: {
      id: "7",
      title: "松本市営 アルプスキャンプ場 — 北アルプスを望む市営サイトが500円",
      image_url: REAL_IMAGES.camp,
      category: CAMP,
      location_name: "アルプスキャンプ場",
      prefecture: "長野県",
    },
  },
  {
    id: "b3",
    category: "家族と行く",
    created_at: "2026-04-14T09:00:00+09:00",
    facility: {
      id: "28",
      title: "丹波篠山市営 農業体験農場 — 棚田で田植え・稲刈りが家族で楽しめる",
      image_url: REAL_IMAGES.farm,
      category: FARM,
      location_name: "農業体験農場",
      prefecture: "兵庫県",
    },
  },
]
