export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type FacilityStatus = "draft" | "published" | "unpublished"
export type LinkType = "website" | "official" | "map" | "reservation" | "youtube" | "other"

export type FacilityLink = {
  label: string
  url: string
  type: LinkType
}

export type OperatorType = "city" | "town" | "village" | "ward" | "prefecture" | "national"

export type Facility = {
  id: string
  title: string
  description: string
  body?: string
  image_url: string
  images: string[]
  official_url: string
  operator: string
  operator_type: OperatorType
  links?: FacilityLink[]
  category: Pick<Category, "id" | "name" | "slug">
  location_name: string | null
  prefecture: string | null
  admission_fee?: string
  opening_hours?: string
  bookmark_count: number
  view_count: number
  status: FacilityStatus
  is_bookmarked: boolean
  created_at: string
}

export type BookmarkCategory =
  | "行きたい場所"
  | "気になる施設"
  | "家族と行く"
  | "未分類"

export type Bookmark = {
  id: string
  category: BookmarkCategory
  created_at: string
  facility: Pick<
    Facility,
    "id" | "title" | "image_url" | "category" | "location_name" | "prefecture"
  >
}
