import { useState, useEffect, useRef } from 'react'
import {
  Sparkles, Plane, Luggage, Wallet, Camera, MessageCircle,
  Copy, Check, CloudRain, MapPin, UtensilsCrossed, ExternalLink, Wand2,
} from 'lucide-react'
import { NavBar, Footer } from '../components/Sections'

const FORM_KEY = 'ai_travel_suite_form'
const RESULT_KEY = 'ai_travel_suite_result'
const CHECKLIST_KEY = 'ai_travel_suite_checklist'

const STYLES = ['Backpacker', 'Mid-range', 'Luxury']
const ACTIVITIES = ['Cafe hopping', 'Photography', 'Local Food', 'Shopping']

const LOADING_MESSAGES = [
  'กำลังค้นหาตั๋วเครื่องบิน...',
  'กำลังเช็กสภาพอากาศที่ปลายทาง...',
  'กำลังพับเสื้อผ้าลงกระเป๋า...',
  'กำลังคำนวณงบประมาณ...',
  'เตรียมพิกัดถ่ายรูปและแคปชัน...',
]

const TABS = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'packing', label: 'Packing', icon: Luggage },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'spots', label: 'Spots & Food', icon: Camera },
  { id: 'captions', label: 'Captions', icon: MessageCircle },
]

const PACKING_LIST = {
  Clothing: [
    { item: 'เสื้อกันหนาว', affiliate: 'ซื้อบน Shopee' },
    { item: 'เสื้อยืด 4-5 ตัว' },
    { item: 'กางเกงขายาว' },
    { item: 'รองเท้าผ้าใบ' },
  ],
  Gadgets: [
    { item: 'หัวแปลงปลั๊กไฟ', affiliate: 'ซื้อบน Lazada' },
    { item: 'พาวเวอร์แบงค์' },
    { item: 'สายชาร์จ + ที่ชาร์จ' },
  ],
  Documents: [
    { item: 'พาสพอร์ต (เช็กอายุเหลือ 6 เดือน+)' },
    { item: 'ตั๋วเครื่องบิน / ใบจองที่พัก' },
    { item: 'ประกันการเดินทาง' },
  ],
}

const BUDGET_BY_STYLE = {
  Backpacker: {
    total: '฿12,000 - 18,000',
    breakdown: [
      { label: 'ที่พัก', percent: 30, amount: '฿4,500' },
      { label: 'อาหาร', percent: 30, amount: '฿4,500' },
      { label: 'เดินทาง', percent: 25, amount: '฿3,700' },
      { label: 'ช้อปปิ้ง', percent: 15, amount: '฿2,300' },
    ],
  },
  'Mid-range': {
    total: '฿25,000 - 35,000',
    breakdown: [
      { label: 'ที่พัก', percent: 40, amount: '฿12,000' },
      { label: 'อาหาร', percent: 25, amount: '฿7,500' },
      { label: 'เดินทาง', percent: 20, amount: '฿6,000' },
      { label: 'ช้อปปิ้ง', percent: 15, amount: '฿4,500' },
    ],
  },
  Luxury: {
    total: '฿60,000 - 90,000',
    breakdown: [
      { label: 'ที่พัก', percent: 55, amount: '฿41,000' },
      { label: 'อาหาร', percent: 20, amount: '฿15,000' },
      { label: 'เดินทาง', percent: 15, amount: '฿11,000' },
      { label: 'ช้อปปิ้ง', percent: 10, amount: '฿7,500' },
    ],
  },
}

function generateMockResult(form) {
  const dest = form.destination.trim() || 'จุดหมายของคุณ'
  return {
    destination: dest,
    generatedAt: new Date().toISOString(),
    flights: {
      duration: '6h 30m (บินตรง)',
      priceRange: '฿12,000 - 18,000',
    },
    weather: 'อุณหภูมิเฉลี่ย 10-15°C มีฝนเล็กน้อยช่วงบ่าย',
    budget: BUDGET_BY_STYLE[form.style] || BUDGET_BY_STYLE['Mid-range'],
    spots: [
      { name: `จุดชมวิวใจกลาง ${dest}`, desc: 'มุมถ่ายรูปยอดนิยม เหมาะช่วงเช้าตรู่หรือโกลเด้นอาวร์' },
      { name: `ตลาดเช้า ${dest}`, desc: 'บรรยากาศท้องถิ่น ราคาย่อมเยา ของกินสดใหม่' },
      { name: `ย่านเมืองเก่า ${dest}`, desc: 'สถาปัตยกรรมดั้งเดิม เดินเล่นถ่ายรูปได้ทั้งวัน' },
    ],
    food: [
      { name: 'เมนูขึ้นชื่อประจำท้องถิ่น', desc: 'ต้องลองอย่างน้อยหนึ่งครั้งตอนไป' },
      { name: 'ของหวานริมทาง', desc: 'หาซื้อง่ายตามตลาดกลางคืน' },
      { name: 'ร้านกาแฟมุมสวย', desc: 'เหมาะกับสาย cafe hopping' },
    ],
    captions: [
      `หลงทาง...แต่ก็หลงรัก ${dest} 🧡 #${dest.replace(/\s+/g, '')} #TravelDiary`,
      `ทริปนี้จดจำไปอีกนาน ✈️ ${dest} คือคำตอบ #WanderlustTH #${dest.replace(/\s+/g, '')}`,
      `เก็บทุกวินาทีที่ ${dest} ไว้ในกล้องและในใจ 📸 #TravelWithMe #${dest.replace(/\s+/g, '')}`,
    ],
  }
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function TravelForm({ form, setForm, onGenerate, isLoading }) {
  const toggleActivity = (activity) => {
    setForm(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity],
    }))
  }

  const canSubmit = form.destination.trim().length > 0 && !isLoading

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-sky-500" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Travel Suite</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Destination</label>
          <input
            type="text"
            value={form.destination}
            onChange={e => setForm(prev => ({ ...prev, destination: e.target.value }))}
            placeholder="e.g. Kyoto, Japan"
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Travel Dates</label>
          <input
            type="text"
            value={form.dates}
            onChange={e => setForm(prev => ({ ...prev, dates: e.target.value }))}
            placeholder="e.g. 15-20 Dec 2026"
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Travel Style</label>
          <div className="relative">
            <select
              value={form.style}
              onChange={e => setForm(prev => ({ ...prev, style: e.target.value }))}
              className="w-full appearance-none border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 cursor-pointer transition-colors"
            >
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Activities</label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map(activity => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivity(activity)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  form.activities.includes(activity)
                    ? 'bg-sky-500 border-sky-500 text-white'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-sky-300 dark:hover:border-sky-500'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canSubmit}
        className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white text-sm font-semibold rounded-full hover:bg-sky-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 size={16} />
        {isLoading ? 'Generating…' : 'Generate Travel Plan'}
      </button>
      {!form.destination.trim() && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Enter a destination to get started.</p>
      )}
    </div>
  )
}

function LoadingStatus({ message }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-12 h-12 border-2 border-sky-100 dark:border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-300">{message}</p>
    </div>
  )
}

function AffiliateLink({ children, href = '#' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
    >
      {children}
      <ExternalLink size={11} />
    </a>
  )
}

function FlightsTab({ result }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated flight duration</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{result.flights.duration}</p>
        </div>
        <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated price range</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{result.flights.priceRange}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-5 py-3 bg-sky-500 text-white text-sm font-semibold rounded-full hover:bg-sky-600 transition-colors"
        >
          เช็กราคาตั๋วถูกสุดบน Skyscanner
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-5 py-3 border border-sky-500 text-sky-600 dark:text-sky-400 text-sm font-semibold rounded-full hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors"
        >
          จองผ่าน Trip.com
        </a>
      </div>
    </div>
  )
}

function PackingTab({ result, checklist, toggleChecked }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 bg-sky-50 dark:bg-sky-500/10 rounded-xl p-4">
        <CloudRain size={20} className="text-sky-500 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-200">{result.weather}</p>
      </div>

      {Object.entries(PACKING_LIST).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2.5">{category}</h3>
          <div className="flex flex-col gap-2">
            {items.map(({ item, affiliate }) => {
              const key = `${category}:${item}`
              return (
                <label key={key} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={!!checklist[key]}
                      onChange={() => toggleChecked(key)}
                      className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                    />
                    <span className={`text-sm ${checklist[key] ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                      {item}
                    </span>
                  </span>
                  {affiliate && <AffiliateLink>{affiliate}</AffiliateLink>}
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function BudgetTab({ result }) {
  const barColors = ['bg-sky-500', 'bg-teal-500', 'bg-amber-500', 'bg-violet-500']
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total estimated budget</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.budget.total}</p>
      </div>
      <div className="flex flex-col gap-4">
        {result.budget.breakdown.map((row, i) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-gray-700 dark:text-gray-200">{row.label}</span>
              <span className="text-gray-500 dark:text-gray-400">{row.amount}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${barColors[i % barColors.length]} rounded-full`} style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpotsFoodTab({ result }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          <MapPin size={16} className="text-sky-500" /> Popular photo spots
        </h3>
        <div className="flex flex-col gap-3">
          {result.spots.map(s => (
            <div key={s.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          <UtensilsCrossed size={16} className="text-sky-500" /> Must-try local dishes
        </h3>
        <div className="flex flex-col gap-3">
          {result.food.map(f => (
            <div key={f.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{f.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#"
        className="block bg-gradient-to-r from-sky-500 to-teal-500 rounded-2xl p-6 text-white hover:opacity-95 transition-opacity"
      >
        <p className="text-xs uppercase tracking-wide text-sky-100 mb-1">Full guide</p>
        <p className="text-lg font-bold">อ่านรีวิว {result.destination} ฉบับเต็ม พร้อมพิกัดลับ ได้ที่นี่!</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium mt-2">
          อ่านต่อ <ExternalLink size={13} />
        </span>
      </a>
    </div>
  )
}

function CaptionsTab({ result }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyCaption = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(prev => (prev === index ? null : prev)), 1800)
    } catch {
      // clipboard permission denied; silently ignore
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {result.captions.map((caption, i) => (
        <div key={i} className="flex items-start justify-between gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{caption}</p>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => copyCaption(caption, i)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              {copiedIndex === i ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            {copiedIndex === i && (
              <span className="absolute -top-8 right-0 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md whitespace-nowrap">
                Copied!
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AITravelSuitePage() {
  const [form, setForm] = useState(() => loadJSON(FORM_KEY, { destination: '', dates: '', style: 'Mid-range', activities: [] }))
  const [result, setResult] = useState(() => loadJSON(RESULT_KEY, null))
  const [checklist, setChecklist] = useState(() => loadJSON(CHECKLIST_KEY, {}))
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [activeTab, setActiveTab] = useState('flights')
  const timers = useRef([])

  useEffect(() => {
    localStorage.setItem(FORM_KEY, JSON.stringify(form))
  }, [form])

  useEffect(() => {
    if (result) localStorage.setItem(RESULT_KEY, JSON.stringify(result))
  }, [result])

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist))
  }, [checklist])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const toggleChecked = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleGenerate = () => {
    if (!form.destination.trim() || isLoading) return
    setIsLoading(true)
    setResult(null)

    LOADING_MESSAGES.forEach((msg, i) => {
      const t = setTimeout(() => setLoadingMessage(msg), i * 1500)
      timers.current.push(t)
    })

    const finishTimer = setTimeout(() => {
      const newResult = generateMockResult(form)
      setResult(newResult)
      setIsLoading(false)
      setActiveTab('flights')
      setLoadingMessage(LOADING_MESSAGES[0])
    }, LOADING_MESSAGES.length * 1500)
    timers.current.push(finishTimer)
  }

  const handleNewPlan = () => {
    setResult(null)
    setChecklist({})
    localStorage.removeItem(RESULT_KEY)
    localStorage.removeItem(CHECKLIST_KEY)
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6">
        <TravelForm form={form} setForm={setForm} onGenerate={handleGenerate} isLoading={isLoading} />

        {isLoading && <LoadingStatus message={loadingMessage} />}

        {result && !isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-6 pt-5">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {TABS.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-sky-500 text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'flights' && <FlightsTab result={result} />}
              {activeTab === 'packing' && <PackingTab result={result} checklist={checklist} toggleChecked={toggleChecked} />}
              {activeTab === 'budget' && <BudgetTab result={result} />}
              {activeTab === 'spots' && <SpotsFoodTab result={result} />}
              {activeTab === 'captions' && <CaptionsTab result={result} />}
            </div>

            <div className="px-4 md:px-6 pb-6">
              <button
                onClick={handleNewPlan}
                className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer"
              >
                Start a new plan
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
