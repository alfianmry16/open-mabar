import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { Users, Zap, Shield, BarChart3, ArrowRight, Sparkles, Star, Quote } from 'lucide-react'
import { getFeaturedTestimonials } from '@/lib/superadmin/server'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar showDashboardLink={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-24 sm:py-36 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Open Source Queue Management
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Kelola Antrian{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Open Mabar
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Sistem antrian real-time untuk streamer game. Atur giliran main bareng viewer dengan adil, terorganisir, dan tanpa drama.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {user ? (
                <Button size="lg" asChild className="h-12 px-8 text-base">
                  <Link href="/projects">
                    Buka Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="h-12 px-8 text-base">
                    <Link href="/register">
                      Mulai Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                    <Link href="/login">Masuk</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Dibuat khusus untuk streamer yang ingin bermain bersama komunitasnya
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: 'Real-Time Updates',
                desc: 'Antrian terupdate otomatis untuk semua viewer secara instan',
                color: 'text-amber-500',
                bg: 'bg-amber-50',
              },
              {
                icon: Users,
                title: 'Custom Roles',
                desc: 'Kategori kustom untuk role game seperti Tank, Mage, Jungler',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                icon: Shield,
                title: 'Moderator System',
                desc: 'Undang moderator untuk membantu kelola antrian bersama',
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
              },
              {
                icon: BarChart3,
                title: 'Leaderboard',
                desc: 'Tracking statistik pemain dan jumlah match yang diselesaikan',
                color: 'text-purple-500',
                bg: 'bg-purple-50',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-24 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Siap Mulai?
              </h2>
              <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                Bergabung dengan streamer lainnya yang sudah menggunakan Mabar untuk mengelola antrian open mabar mereka
              </p>
              {user ? (
                <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base">
                  <Link href="/projects">Buat Project Pertama</Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base">
                  <Link href="/register">Daftar Gratis Sekarang</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400 dark:text-slate-500">
          <p>&copy; 2026 Mabar. Built for streamers, by streamers.</p>
        </div>
      </footer>
    </div>
  )
}

async function TestimonialsSection() {
  const testimonials = await getFeaturedTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Cerita sukses dari para streamer yang telah beralih ke cara mabar yang lebih cerdas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative group hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center rotate-[-12deg] group-hover:rotate-0 transition-transform">
                <Quote className="h-6 w-6 text-white" />
              </div>

              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn("h-4 w-4", t.rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")} />
                ))}
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed italic text-lg">
                &quot;{t.message}&quot;
              </p>

              <div className="flex items-center gap-4 border-t border-slate-200/50 dark:border-slate-800 pt-6">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-white dark:ring-slate-700">
                  {t.avatar_url ? (
                    <Image src={t.avatar_url} alt={t.full_name || ''} width={48} height={48} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.full_name || 'Anonymous'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Verified User</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
