"use client"
import { useState, useEffect } from "react"
import PartialFlashcard from "@/components/PartialFlashcard"

type Verb = {
  id: number
  kanji: string
  stem: string
  masu: string
  dict: string
  te: string
  nai: string
  ta: string
  group: string
  meaning: string
  masuRead: string
  dictRead: string
  teRead: string
  naiRead: string
  taRead: string
}

export default function Home() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [index, setIndex] = useState(0)
  const [showReading, setShowReading] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)
  const [targetForm, setTargetForm] = useState<"dict" | "te" | "nai" | "ta">("dict")
  const [formData, setFormData] = useState({ masu: "", meaning: "", group: "1" })
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchVerbs(searchTerm)
  }, [searchTerm])

  const fetchVerbs = async (q: string) => {
    const res = await fetch(`/api/verbs?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setVerbs(data)
    setIndex(0)
  }

  const handleNext = () => {
    setIndex((prev) => (prev < verbs.length - 1 ? prev + 1 : 0))
  }

  const handleBack = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : verbs.length - 1))
  }

  const handleAdd = async () => {
    if (!formData.masu || !formData.meaning) return
    await fetch("/api/verbs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    setFormData({ masu: "", meaning: "", group: "1" })
    await fetchVerbs(searchTerm)
    setShowAddForm(false)
  }

  const handleUpdate = async () => {
    const verb = verbs[index]
    if (!verb) return
    await fetch(`/api/verbs/${verb.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verb),
    })
    await fetchVerbs(searchTerm)
  }

  const handleDelete = async () => {
    const verb = verbs[index]
    if (!verb) return
    await fetch(`/api/verbs/${verb.id}`, { method: "DELETE" })
    await fetchVerbs(searchTerm)
    setIndex((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const verb = verbs[index] ?? null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow">
        Flashcard Perubahan Kata Kerja Jepang
      </h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Cari kata (arti / 日本語 / bentuk)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border p-2 rounded-lg shadow focus:ring-2 focus:ring-indigo-400"
      />

      {/* Toggle Cara Baca & Arti */}
      <div className="flex gap-6 bg-white px-6 py-3 rounded-xl shadow-md">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showReading}
            onChange={(e) => setShowReading(e.target.checked)}
            className="accent-indigo-500"
          />
          <span className="font-medium">Tampilkan cara baca</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMeaning}
            onChange={(e) => setShowMeaning(e.target.checked)}
            className="accent-indigo-500"
          />
          <span className="font-medium">Tampilkan arti</span>
        </label>
      </div>

      {/* Pilihan bentuk */}
      <div className="flex gap-4 flex-wrap justify-center bg-white px-6 py-3 rounded-xl shadow-md">
        {["dict", "te", "nai", "ta"].map((form) => (
          <label
            key={form}
            className={`px-3 py-1 rounded-lg cursor-pointer ${targetForm === form
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            <input
              type="radio"
              name="form"
              value={form}
              checked={targetForm === form}
              onChange={() => setTargetForm(form as never)}
              className="hidden"
            />
            {form === "dict"
              ? "辞書形"
              : form === "te"
                ? "て形"
                : form === "nai"
                  ? "ない形"
                  : "た形"}
          </label>
        ))}
      </div>

      {/* Flashcard */}
      {verb ? (
        <PartialFlashcard
          stem={verb.stem}
          masu={verb.masu}
          target={verb[targetForm]}
          group={verb.group}
          masuReading={verb.masuRead}
          targetReading={
            targetForm === "dict"
              ? verb.dictRead
              : targetForm === "te"
                ? verb.teRead
                : targetForm === "nai"
                  ? verb.naiRead
                  : verb.taRead
          }
          showReading={showReading}
          meaning={verb.meaning}
          showMeaning={showMeaning}
        />
      ) : (
        <p className="text-gray-600 mt-4">Tidak ada kata ditemukan</p>
      )}

      {/* Update / Delete */}
      {verb && (
        <div className="flex gap-4">
          {/* <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
          >
            Update
          </button> */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
          >
            Delete
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        {verbs.length > 0 && (
          <>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Next
            </button>

          </>
        )}
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {showAddForm ? "Cancel" : "+ Tambah"}
        </button>
      </div>

      {/* Form Tambah */}
      {showAddForm && (
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-sm mt-4">
          <h2 className="text-xl font-bold text-indigo-600">Tambah Kata Baru</h2>
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-indigo-400"
            placeholder="Masu form"
            value={formData.masu}
            onChange={(e) => setFormData({ ...formData, masu: e.target.value })}
          />
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-indigo-400"
            placeholder="Meaning"
            value={formData.meaning}
            onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
          />
          <select
            className="border p-2 rounded focus:ring-2 focus:ring-indigo-400"
            value={formData.group}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          >
            <option value="1">Group 1 (五段)</option>
            <option value="2">Group 2 (一段)</option>
            <option value="3">Group 3 (不規則)</option>
          </select>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        </div>
      )}
    </main>
  )
}
