'use client'
import { useEffect, useState } from 'react'
import { MessageSquare, Trash2, Send } from 'lucide-react'

interface Comment {
  id: string
  content: string
  user: {
    id: string
    name?: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function InternalComments({ caseId }: { caseId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [caseId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/internal-comments?caseId=${caseId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/internal-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, content: newComment })
      })

      if (res.ok) {
        setNewComment('')
        fetchComments()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Radera kommentar?')) return

    try {
      const res = await fetch(`/api/internal-comments/${commentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (loading) {
    return <div className="text-slate-500">Laddar kommentarer...</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600" /> Interna anteckningar
      </h3>

      {/* Kommentarform */}
      <form onSubmit={handleAddComment} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Skriv en intern anteckning här... (bara synlig för teamet)"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
          rows={3}
        />
        <div className="flex gap-2 mt-3 justify-end">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Lägg till
          </button>
        </div>
      </form>

      {/* Kommentarer */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Inga kommentarer än
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-800">{comment.user.name || comment.user.email}</p>
                  <p className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString('sv-SE')}</p>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Radera"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
