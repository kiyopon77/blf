// app/plot/[plotId]/components/NotesCard.tsx
import { FloorNoteResponse } from "@/types/floor"

const NotesCard = ({ notes }: { notes?: FloorNoteResponse | null }) => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        <span className="text-gray-700 font-extrabold">Notes</span>
        <div className="flex flex-col">
          {notes?.content ? (
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{notes.content}</p>
          ) : (
            <span className="text-gray-500 italic">No notes available for this floor.</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotesCard
