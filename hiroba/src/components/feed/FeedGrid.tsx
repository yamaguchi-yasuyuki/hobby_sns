"use client"

import { useState } from "react"
import FacilityCard from "./FacilityCard"
import FacilityModal from "./FacilityModal"
import type { Facility } from "@/types"

type FeedGridProps = {
  facilities: Facility[]
}

export default function FeedGrid({ facilities }: FeedGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (facilities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <p className="text-[16px] font-bold text-[#1E3A2F] mb-2">
          このカテゴリの施設はまだありません
        </p>
        <p className="text-[13px] text-[#88A898]">
          他のカテゴリも見てみてください！
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {facilities.map((facility, index) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <FacilityModal
          facilities={facilities}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}
