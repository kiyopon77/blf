// app/plot/[plotId]/components/NotesCard.tsx
import { useState } from "react"
import { FloorNoteResponse } from "@/types/floor"
import { updateFloorNotes } from "@/services/admin/floor"
import { message } from "antd"

const NotesCard = ({ notes, floorId }: { notes?: FloorNoteResponse | null, floorId?: number }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(notes?.content || "")
  const [currentNotes, setCurrentNotes] = useState(notes?.content || "")
  const [isSaving, setIsSaving] = useState(false)
  // const { message } = App.useApp()

  const handleSave = async () => {
    if (!floorId) return
    setIsSaving(true)
    try {
      await updateFloorNotes(floorId, content)
      setCurrentNotes(content)
      setIsEditing(false)
      message.success("Notes updated successfully")
    } catch (e) {
      message.error("Failed to update notes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-extrabold">Notes</span>
          {floorId && !isEditing && (
            <button 
              onClick={() => {
                setContent(currentNotes)
                setIsEditing(true)
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          )}
        </div>
        <div className="flex flex-col">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[120px] rounded-lg border border-gray-300 p-3 text-sm font-medium resize-y"
                placeholder="Add any notes related to this floor..."
                disabled={isSaving}
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : currentNotes ? (
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{currentNotes}</p>
          ) : (
            <span className="text-gray-500 italic">No notes available for this floor.</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotesCard
