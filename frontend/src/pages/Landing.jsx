import { ArrowRight, BarChart3, Mic, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Chatbot from '../components/chatbot/Chatbot'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-6 px-3 py-1.5 bg-amber/10 border border-amber rounded-full">
              <p className="text-amber text-xs font-mono">Powered by Groq · LLaMA 3.3 70B</p>
            </div>
            <h1 className="font-fraunces text-5xl md:text-6xl text-ink leading-tight mb-6">
              Your store.
              <br />
              <span className="italic text-amber">Understood.</span>
            </h1>
            <p className="text-ink/70 text-lg mb-8">
              ARIA is an AI-powered retail intelligence platform. Ask questions, get live insights,
              manage inventory — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => navigate('/signup')}
                className="bg-amber text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2"
              >
                Sign Up Free <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login')} className="border border-ink text-ink px-8 py-3 rounded-lg font-medium hover:bg-ink hover:text-cream transition">
                Try Demo
              </button>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <p className="text-stone">Used by retail managers</p>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white text-xs font-bold">
                  L
                </div>
                <div className="w-8 h-8 bg-slate rounded-full flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
              </div>
              <p className="text-stone">Join 200+ stores</p>
            </div>
          </div>

          {/* Mockup */}
          <div className="hidden md:block">
            <div className="bg-white rounded-3xl border border-border p-6 shadow-lg">
              <img 
                src="/images/retail image.jpg" 
                alt="ARIA Dashboard" 
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-ink text-center mb-16">
            Everything you need. Nothing you don't.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'AI Chatbot',
                desc: 'Ask ARIA anything about your store. Text or voice. Instant answers from your live data.',
              },
              {
                icon: BarChart3,
                title: 'Live Insights',
                desc: 'See inline charts inside the conversation. Sales trends, inventory breakdowns, customer patterns.',
              },
              {
                icon: Smartphone,
                title: 'Works Everywhere',
                desc: 'Fully responsive. Desktop, tablet, phone. Same experience on every device.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-cream p-8 rounded-lg border border-border">
                  <Icon size={32} className="text-amber mb-4" />
                  <h3 className="font-fraunces text-xl text-ink mb-3">{feature.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-3xl text-ink text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Connect your store data', 'Ask ARIA anything', 'Get instant intelligence'].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-amber text-white rounded-full flex items-center justify-center mx-auto mb-4 font-fraunces text-lg font-bold">
                  {i + 1}
                </div>
                <p className="text-ink font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-fraunces text-4xl text-cream mb-4">
            Ready to understand your store?
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-amber text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition inline-flex items-center gap-2"
          >
            Open Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Chatbot pageContext="home" />

      {/* Footer */}
      <footer className="bg-cream border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-fraunces text-amber italic text-lg">ARIA</p>
            <p className="text-stone text-sm">Your store. Understood.</p>
          </div>
          <p className="text-stone text-sm font-mono">Built with Groq · React</p>
        </div>
      </footer>
    </div>
  )
}
