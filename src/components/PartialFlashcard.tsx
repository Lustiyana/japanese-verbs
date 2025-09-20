"use client"
import { useState } from "react"

type Props = {
  stem: string
  masu: string
  target: string
  group: string
  masuReading: string
  targetReading: string
  showReading: boolean
  meaning: string
  showMeaning: boolean
}

export default function PartialFlashcard({
  stem,
  masu,
  target,
  group,
  masuReading,
  targetReading,
  showReading,
  showMeaning,
  meaning
}: Props) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center gap-2 text-3xl">
      {/* Flashcard Row */}
      <div className="flex items-center gap-2">
        <span>{stem}</span>
        <div
          className="w-28 h-28 cursor-pointer perspective"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""
              }`}
          >
            {/* Front (ます形) */}
            <div className="absolute w-full h-full flex items-center justify-center bg-blue-500 text-white rounded-lg backface-hidden">
              <p className="font-bold">{masu}</p>
            </div>

            {/* Back (target form) */}
            <div className="absolute w-full h-full flex flex-col items-center justify-center bg-green-500 text-white rounded-lg rotate-y-180 backface-hidden">
              <p className="font-bold">{target}</p>
              {/* <span className="text-sm italic">{targetLabel}</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Cara baca di bawah flashcard */}
      {showReading && (
        <p className="text-lg text-gray-800">
          {flipped ? targetReading : masuReading}
        </p>
      )}

      {showMeaning && (
        <p className="text-lg text-gray-800">
          {meaning}
        </p>
      )}

      {/* Info golongan */}
      <p className="text-base text-gray-700 italic">Golongan: {group}</p>
    </div>
  )
}
