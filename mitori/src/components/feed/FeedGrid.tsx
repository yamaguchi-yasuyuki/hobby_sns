"use client"

import { useState } from "react"
import ContentCard from "./ContentCard"
import ContentModal from "./ContentModal"
import type { Content } from "@/types"

type FeedGridProps = {
  contents: Content[]
}

export default function FeedGrid({ contents }: FeedGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#A09890]">
        <p className="text-[14px] tracking-[0.05em]">このジャンルのコンテンツはまだありません</p>
        <p className="text-[12px] mt-2 text-[#C4BDB5] tracking-[0.05em]">他のジャンルを選んでみてください</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {contents.map((content, index) => (
          <ContentCard
            key={content.id}
            content={content}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <ContentModal
          contents={contents}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}
