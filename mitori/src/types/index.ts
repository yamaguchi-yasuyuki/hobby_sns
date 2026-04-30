export type Genre = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type SourceType = "note" | "x" | "youtube" | "instagram" | "blog" | "other"
export type ContentStatus = "draft" | "published" | "unpublished"
export type LinkType = "note" | "website" | "amazon" | "shop" | "youtube" | "other"

export type ContentLink = {
  label: string
  url: string
  type: LinkType
}

export type Content = {
  id: string
  title: string
  description: string
  body?: string
  image_url: string
  images: string[]
  external_url: string
  source_type: SourceType
  links?: ContentLink[]
  genre: Pick<Genre, "id" | "name" | "slug">
  location_name: string | null
  prefecture: string | null
  bookmark_count: number
  view_count: number
  click_count?: number
  status: ContentStatus
  is_bookmarked: boolean
  created_at: string
}

export type BookmarkCategory =
  | "行きたい場所"
  | "欲しいもの"
  | "気になるスポット"
  | "未分類"

export type Bookmark = {
  id: string
  category: BookmarkCategory
  created_at: string
  content: Pick<
    Content,
    "id" | "title" | "image_url" | "genre" | "location_name" | "prefecture"
  >
}
