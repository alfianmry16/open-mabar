'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Star, Loader2, MessageSquare, Send, ThumbsUp, Bug, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Feedback {
  id: string
  rating: number | null
  category: 'saran' | 'testimoni' | 'bug'
  message: string
  created_at: string
}

export function FeedbackForm() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([])
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState(0)
  const [category, setCategory] = useState<'saran' | 'testimoni' | 'bug'>('saran')
  const [message, setMessage] = useState('')

  const fetchFeedbackHistory = useCallback(async () => {
    setIsHistoryLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbackHistory(data || [])
    } catch (err) {
      console.error('Error fetching feedback history:', err)
    } finally {
      setIsHistoryLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchFeedbackHistory()
  }, [fetchFeedbackHistory])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Rating is only required for Testimoni
    if (category === 'testimoni' && !rating) {
      toast.error('Silakan pilih rating bintang untuk testimoni')
      return
    }

    if (message.trim().length < 5) {
      toast.error('Pesan terlalu pendek')
      return
    }

    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          rating: category === 'testimoni' ? rating : null,
          category,
          message: message.trim(),
        } as any)

      if (error) throw error

      toast.success('Feedback berhasil dikirim! Terima kasih.')
      setRating(null)
      setMessage('')
      setCategory('saran')
      fetchFeedbackHistory()
    } catch (err) {
      console.error('Error sending feedback:', err)
      toast.error('Gagal mengirim feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'testimoni': return <ThumbsUp className="h-4 w-4" />
      case 'bug': return <Bug className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  return (
    <div className="grid gap-8">
      {/* Feedback Form Card */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-sm border-0 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-md">
              <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-xl">Beri Feedback</CardTitle>
          </div>
          <CardDescription>
            Saran, testimoni, atau laporkan bug untuk membantu kami menjadi lebih baik.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Star Rating - Only for Testimoni */}
            {category === 'testimoni' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="text-sm font-medium">Rating Anda (Wajib)</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          (hoverRating || (rating || 0)) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {rating && rating > 0 ? `${rating} dari 5 bintang` : 'Pilih bintang'}
                  </span>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Kategori</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['saran', 'testimoni', 'bug'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-all",
                      category === cat
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                  >
                    {getCategoryIcon(cat)}
                    <span className="capitalize">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-medium">Pesan</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                placeholder="Tuliskan pengalaman atau saran Anda di sini..."
                className="min-h-[120px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || (category === 'testimoni' && !rating) || message.trim().length < 5}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* History Card */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-sm border-0 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Riwayat Feedback</CardTitle>
          <CardDescription>
            Feedback yang pernah Anda kirimkan sebelumnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isHistoryLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
          ) : feedbackHistory.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/20">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Belum ada riwayat feedback.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {feedbackHistory.map((item) => (
                <div key={item.id} className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-h-[14px]">
                      {item.rating ? (
                        [1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3.5 w-3.5",
                              (item.rating || 0) >= star
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200 dark:text-slate-700"
                            )}
                          />
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Tanpa rating</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &quot;{item.message}&quot;
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Dikirim pada {new Date(item.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
