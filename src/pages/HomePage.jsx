import { ShieldCheck, MessageSquare, TrendingUp, CheckCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import IndiaNetworkAnimation from '../components/home/IndiaNetworkAnimation'
import ConveyorAnimation from '../components/home/ConveyorAnimation'
import { Link, useNavigate } from 'react-router-dom'

const SERVICES = [
  { icon: '🔧', label: 'Manufacturing', desc: 'Raw materials, components, bulk orders' },
  { icon: '🏪', label: 'Wholesale', desc: 'FMCG, textiles, electronics distributors' },
  { icon: '🛒', label: 'Retail Supply', desc: 'Vendors for retail chains and stores' },
  { icon: '⚙️', label: 'Service Providers', desc: 'IT, logistics, packaging, printing' },
  { icon: '🚚', label: 'Traders', desc: 'Import-export, commodity trading' },
  { icon: '📦', label: 'Distributors', desc: 'Regional distribution networks' },
]

const HOW = [
  { step: '01', title: 'Register your business', desc: 'Create a profile with your GST number and business details. Verification takes 24 hours.' },
  { step: '02', title: 'Post what you need', desc: 'Write a requirement (RFQ) — quantity, budget, delivery location. It reaches all matching sellers.' },
  { step: '03', title: 'Get quotes, negotiate', desc: 'Sellers respond with their best price. Chat directly, negotiate, and close the deal.' },
  { step: '04', title: 'Order and pay safely', desc: 'Confirm the order. Payment goes through only after you acknowledge delivery.' },
]

const TESTIMONIALS = [
  { name: 'Ramesh Agarwal', city: 'Surat', business: 'Agarwal Textiles', text: 'Found three reliable fabric suppliers within a week. The GST verification gave us confidence to deal with new parties.', rating: 5 },
  { name: 'Priya Menon', city: 'Coimbatore', business: 'Menon Engineering Works', text: 'Posted an RFQ for CNC machined parts. Got 8 quotes in 2 days. Saved 18% vs our old supplier.', rating: 5 },
  { name: 'Suresh Bhatia', city: 'Ludhiana', business: 'Bhatia Hosiery', text: 'As a seller, we get serious inquiries only. No time-wasters. Orders are proper with documentation.', rating: 4 },
]

const FAQS = [
  { q: 'Is Rozgar free to use?', a: 'Listing your business and browsing is free. We charge a small platform fee only when a deal is closed.' },
  { q: 'How does business verification work?', a: 'We verify your GST number and PAN with government databases. Most verifications complete within 24 hours.' },
  { q: 'What if I have a dispute with a seller?', a: 'Our team mediates disputes. Payment is held safely and released only after delivery confirmation.' },
  { q: 'Can I use Rozgar without a registered business?', a: 'Yes — individual buyers can post RFQs without GST. Sellers must be registered businesses.' },
  { q: 'Which cities does Rozgar operate in?', a: 'All major Indian cities. Our seller network is strongest in Mumbai, Delhi, Surat, Coimbatore, Ludhiana, and Ahmedabad.' },
]

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-gray-900">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-sm text-gray-600 pb-4 leading-relaxed">{a}</p>}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                GST-verified businesses only
              </div>
              <h1 className="text-4xl sm:text-[2.75rem] font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-4">
                Find verified suppliers.<br />
                Close deals that stick.
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mb-7 max-w-md">
                Rozgar connects Indian businesses with trusted suppliers and buyers.
                Post a requirement, get quotes, negotiate directly, and close deals — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-9">
                <Link to="/register" className="btn-primary text-center py-3 px-7 text-base">
                  Start for free
                </Link>
                <Link to="/businesses" className="btn-secondary text-center py-3 px-7 text-base">
                  Browse suppliers
                </Link>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-5 flex-wrap">
                {[
                  { val: '4,800+', label: 'Verified businesses' },
                  { val: '1.2L+', label: 'Deals closed' },
                  { val: '₹2.3Cr+', label: 'Trade facilitated' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xl font-bold text-gray-900">{s.val}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="relative hidden md:block">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-100">
                 <IndiaNetworkAnimation />
              </div>
              {/* Floating trust card */}
              <div className="absolute -bottom-10 -left-5 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">GST + PAN verified</div>
                    <div className="text-2xs text-gray-500">Every seller on Rozgar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────────── */}
      <section className="bg-navy-700 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
            {[
              { icon: <ShieldCheck className="w-4 h-4" />, text: 'GST & PAN verified businesses' },
              { icon: <CheckCircle className="w-4 h-4" />, text: 'Structured RFQ-quote-order flow' },
              { icon: <MessageSquare className="w-4 h-4" />, text: 'Direct negotiation chat' },
              { icon: <TrendingUp className="w-4 h-4" />, text: 'Secure payment & invoice' },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2 text-white text-sm">
                <span className="text-blue-300">{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-16 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
          <p className="text-xs font-semibold text-ember-500 uppercase tracking-widest mb-2">
            What's on Rozgar
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Every type of B2B business</h2>
            <p className="text-xs text-gray-400 hidden sm:block">
              Click or drag a box
            </p>
          </div>
        </div>
        <ConveyorAnimation
          onCategoryClick={(name) => {
            const typeMap = {
            'MANUFACTURER':     'MANUFACTURER',
            'WHOLESALE':         'WHOLESALER',
            'RETAIL SUPPLY':     'RETAILER',
            'SERVICE PROVIDERS': 'SERVICE_PROVIDER',
            'TRADERS':           'TRADER',
            'DISTRIBUTORS':      'DISTRIBUTOR',
            }
            navigate(`/businesses?type=${typeMap[name] || name}`)
          }}
          />
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 bg-warm border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold text-ember-500 uppercase tracking-widest mb-2">The process</p>
            <h2 className="text-2xl font-bold text-gray-900">From requirement to delivery</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW.map((h, i) => (
              <div key={h.step} className="relative">
                {i < HOW.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-gray-200 z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(100% - 1rem)' }} />
                )}
                <div className="relative z-10">
                  <div className="w-9 h-9 bg-navy-700 rounded flex items-center justify-center text-white text-xs font-bold mb-4">
                    {h.step}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{h.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold text-ember-500 uppercase tracking-widest mb-2">From our users</p>
            <h2 className="text-2xl font-bold text-gray-900">Businesses that use Rozgar daily</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                  {[...Array(5 - t.rating)].map((_, i) => (
                    <span key={i} className="text-gray-200 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.business} · {t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-navy-700 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to grow your business?</h2>
          <p className="text-sm text-blue-200 mb-7 leading-relaxed">
            Join 4,800+ verified businesses already trading on Rozgar.
            Free to join. No commission until you close a deal.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="bg-ember-500 text-white font-semibold px-7 py-3 rounded hover:bg-ember-600 transition-colors text-sm">
              Create free account
            </Link>
            <Link to="/rfq/open" className="border border-blue-400 text-blue-100 font-semibold px-7 py-3 rounded hover:bg-blue-800 transition-colors text-sm">
              Browse requirements
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-semibold text-ember-500 uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl font-bold text-gray-900">Common questions</h2>
          </div>
          {FAQS.map(f => <FAQ key={f.q} {...f} />)}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 bg-warm border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold text-ember-500 uppercase tracking-widest mb-2">Get in touch</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">We're here to help</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Questions about listing your business, payment issues, or anything else — reach us directly.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 text-sm">📱</div>
                  <div>
                    <div className="text-xs text-gray-500">WhatsApp (fastest)</div>
                    <a href="https://wa.me/916200748452" className="text-sm font-medium text-gray-900 hover:text-ember-500">+91 6200748452</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-blue-600 text-sm">✉️</div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <a href="mailto:sarthakbhushan7s@gmail.com" className="text-sm font-medium text-gray-900 hover:text-ember-500">sarthakbhushan7s@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Send a message</h3>
              <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="label">Your name</label>
                  <input className="input" placeholder="Ramesh Agarwal" />
                </div>
                <div>
                  <label className="label">Phone number</label>
                  <input className="input" placeholder="+91 6200748452" type="tel" />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input" rows={3} placeholder="Tell us what you need..." />
                </div>
                <button className="btn-primary w-full py-3">Send message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
