"use client"

type Props = {
  facilityTitle: string
}

export default function FacilityStaffDeleteButton({ facilityTitle }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        if (
          !confirm(
            `「${facilityTitle}」を削除しますか？\n一般ユーザーからも非表示になります。\n\n（デモ: Supabase 未接続のため一覧は変わりません）`
          )
        ) {
          return
        }
        window.alert("削除 API は DB スキーマ実装後に有効になります。docs/MUNICIPALITY_ADMIN_UI.md を参照してください。")
      }}
      className="text-[12px] font-bold text-[#88A898] hover:text-[#C44] px-2 py-1"
    >
      削除
    </button>
  )
}
