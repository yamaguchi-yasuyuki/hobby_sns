import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 都道府県を北から南の地理的順序に並べるための定義
const PREFECTURE_ORDER = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  "沖縄県",
]

export function sortPrefectures(prefectures: string[]): string[] {
  return [...prefectures].sort(
    (a, b) => {
      const ai = PREFECTURE_ORDER.indexOf(a)
      const bi = PREFECTURE_ORDER.indexOf(b)
      if (ai === -1 && bi === -1) return a.localeCompare(b, "ja")
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    }
  )
}
