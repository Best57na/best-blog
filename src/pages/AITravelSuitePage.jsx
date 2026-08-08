import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Sparkles, Wand2, X, Plus, Download, Share2 } from 'lucide-react'
import { NavBar, Footer } from '../components/Sections'
import { API_BASE } from '../utils/api'
import { useLanguage } from '../lib/language'
import { CURRENCIES } from '../lib/currencies'
import { TABS } from '../lib/travelPlanTabs'
import {
  FlightsTab, RouteTab, AccommodationTab, PackingTab, BudgetTab, SpotsFoodTab, CaptionsTab,
} from '../components/TravelPlanTabs'

const FORM_KEY = 'ai_travel_suite_form'
const RESULT_KEY = 'ai_travel_suite_result'
const CHECKLIST_KEY = 'ai_travel_suite_checklist'
const PACKING_KEY = 'ai_travel_suite_packing'

const STYLES = ['Backpacker', 'Mid-range', 'Luxury']
const STYLE_KEYS = {
  Backpacker: 'aiSuite.styleBackpacker',
  'Mid-range': 'aiSuite.styleMidrange',
  Luxury: 'aiSuite.styleLuxury',
}

const ACTIVITIES = [
  'Cafe hopping', 'Photography', 'Local Food', 'Shopping',
  'Nature & Hiking', 'Museum & History', 'Nightlife', 'Beach',
  'Adventure Sports', 'Wellness & Spa', 'Family Friendly', 'Local Markets',
]
const ACTIVITY_KEYS = {
  'Cafe hopping': 'aiSuite.activityCafeHopping',
  Photography: 'aiSuite.activityPhotography',
  'Local Food': 'aiSuite.activityLocalFood',
  Shopping: 'aiSuite.activityShopping',
  'Nature & Hiking': 'aiSuite.activityNatureHiking',
  'Museum & History': 'aiSuite.activityMuseumHistory',
  Nightlife: 'aiSuite.activityNightlife',
  Beach: 'aiSuite.activityBeach',
  'Adventure Sports': 'aiSuite.activityAdventureSports',
  'Wellness & Spa': 'aiSuite.activityWellnessSpa',
  'Family Friendly': 'aiSuite.activityFamilyFriendly',
  'Local Markets': 'aiSuite.activityLocalMarkets',
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
  const { t } = useLanguage()
  const [customActivity, setCustomActivity] = useState('')

  const toggleActivity = (activity) => {
    setForm(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity],
    }))
  }

  const addCustomActivity = () => {
    const trimmed = customActivity.trim()
    if (!trimmed) return
    setForm(prev => prev.activities.includes(trimmed) ? prev : { ...prev, activities: [...prev.activities, trimmed] })
    setCustomActivity('')
  }

  const customActivities = form.activities.filter(a => !ACTIVITIES.includes(a))

  const canSubmit = form.destination.trim().length > 0 && !isLoading

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-sky-500" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('aiSuite.heading')}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('aiSuite.from')}</label>
          <input
            type="text"
            value={form.origin}
            onChange={e => setForm(prev => ({ ...prev, origin: e.target.value }))}
            placeholder={t('aiSuite.fromPlaceholder')}
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('aiSuite.to')}</label>
          <input
            type="text"
            value={form.destination}
            onChange={e => setForm(prev => ({ ...prev, destination: e.target.value }))}
            placeholder={t('aiSuite.toPlaceholder')}
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('aiSuite.dates')}</label>
          <input
            type="text"
            value={form.dates}
            onChange={e => setForm(prev => ({ ...prev, dates: e.target.value }))}
            placeholder={t('aiSuite.datesPlaceholder')}
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('aiSuite.style')}</label>
            <div className="relative">
              <select
                value={form.style}
                onChange={e => setForm(prev => ({ ...prev, style: e.target.value }))}
                className="w-full appearance-none border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 cursor-pointer transition-colors"
              >
                {STYLES.map(s => <option key={s} value={s}>{t(STYLE_KEYS[s])}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('aiSuite.currency')}</label>
            <div className="relative">
              <select
                value={form.currency}
                onChange={e => setForm(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full appearance-none border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 cursor-pointer transition-colors"
              >
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('aiSuite.activities')}</label>
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
              {t(ACTIVITY_KEYS[activity])}
            </button>
          ))}
        </div>

        {customActivities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {customActivities.map(activity => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivity(activity)}
                className="flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium bg-sky-500 border border-sky-500 text-white cursor-pointer"
              >
                {activity}
                <X size={12} />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            value={customActivity}
            onChange={e => setCustomActivity(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomActivity() } }}
            placeholder={t('aiSuite.addActivityPlaceholder')}
            className="flex-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
          />
          <button
            type="button"
            onClick={addCustomActivity}
            disabled={!customActivity.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} /> {t('aiSuite.add')}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canSubmit}
        className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white text-sm font-semibold rounded-full hover:bg-sky-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 size={16} />
        {isLoading ? t('aiSuite.generating') : t('aiSuite.generate')}
      </button>
      {!form.destination.trim() && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('aiSuite.enterDestinationHint')}</p>
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

function TabPending({ error, onRetry }) {
  const { t } = useLanguage()
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('aiSuite.groupBCErrorFallback')}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-full bg-sky-500 text-white text-xs font-medium cursor-pointer hover:bg-sky-600 transition-colors"
        >
          {t('aiSuite.retry')}
        </button>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="w-6 h-6 border-2 border-sky-100 dark:border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{t('aiSuite.loadingMore')}</p>
    </div>
  )
}

function loadPersistedResult() {
  const stored = loadJSON(RESULT_KEY, null)
  return stored && Array.isArray(stored.route) && Array.isArray(stored.accommodation) ? stored : null
}

function formatPlanAsText(result, packingList, t) {
  const lines = [`${t('aiSuite.exportPlanTitle')} ${result.destination}`, '']

  if (result.needsFlight && result.flights) {
    lines.push(`✈️ ${t('aiSuite.exportFlight')} ${result.flights.duration} (${result.flights.priceRange})`)
  }
  lines.push(`🌤️ ${t('aiSuite.exportWeather')} ${result.weather}`, '')

  lines.push(`🗺️ ${t('aiSuite.exportRoute')}`)
  result.route.forEach((step, i) => lines.push(`${i + 1}. ${step.title} — ${step.desc}`))
  lines.push('')

  lines.push(`🏨 ${t('aiSuite.exportAccommodation')}`)
  result.accommodation.forEach(stay => lines.push(`- ${stay.name} (${stay.area}) ${stay.priceRange}`))
  lines.push('')

  lines.push(`💰 ${t('aiSuite.exportBudget')} ${result.budget.total}`)
  result.budget.breakdown.forEach(row => lines.push(`  - ${row.label}: ${row.amount} (${row.percent}%)`))
  lines.push('')

  lines.push(`📸 ${t('aiSuite.exportSpots')}`)
  result.spots.forEach(s => lines.push(`- ${s.name}: ${s.desc}`))
  lines.push('')

  lines.push(`🍜 ${t('aiSuite.exportFood')}`)
  result.food.forEach(f => lines.push(`- ${f.name}: ${f.desc}`))
  lines.push('')

  if (packingList && packingList.length > 0) {
    lines.push(`🎒 ${t('aiSuite.exportPacking')}`)
    packingList.forEach(cat => {
      lines.push(`${cat.category}:`)
      cat.items.forEach(item => lines.push(`  - ${item}`))
    })
    lines.push('')
  }

  lines.push(`📝 ${t('aiSuite.exportCaptions')}`)
  result.captions.forEach(c => lines.push(`- ${c}`))
  lines.push('', t('aiSuite.exportFooter'))

  return lines.join('\n')
}

export default function AITravelSuitePage() {
  const { t, language } = useLanguage()
  const LOADING_MESSAGES = [
    t('aiSuite.loadingMessage1'),
    t('aiSuite.loadingMessage2'),
    t('aiSuite.loadingMessage3'),
    t('aiSuite.loadingMessage4'),
    t('aiSuite.loadingMessage5'),
  ]
  const [form, setForm] = useState(() => ({
    origin: '', destination: '', dates: '', style: 'Mid-range', currency: 'THB', activities: [],
    ...loadJSON(FORM_KEY, {}),
  }))
  const [result, setResult] = useState(loadPersistedResult)
  const [packingList, setPackingList] = useState(() => loadJSON(PACKING_KEY, []))
  const [checklist, setChecklist] = useState(() => loadJSON(CHECKLIST_KEY, {}))
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [groupBCError, setGroupBCError] = useState(false)
  const [refineInstruction, setRefineInstruction] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [savedPlan, setSavedPlan] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    const persisted = loadPersistedResult()
    return persisted && !persisted.needsFlight ? 'route' : 'flights'
  })
  const timers = useRef([])
  const tabsRef = useRef(null)
  const dragState = useRef({ isDown: false, moved: false, startX: 0, scrollLeft: 0 })
  const lastRequestRef = useRef(null)

  const handleTabsMouseDown = (e) => {
    const el = tabsRef.current
    if (!el) return
    dragState.current = { isDown: true, moved: false, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.classList.add('cursor-grabbing')
  }
  const handleTabsMouseUpOrLeave = () => {
    dragState.current.isDown = false
    tabsRef.current?.classList.remove('cursor-grabbing')
  }
  const handleTabsMouseMove = (e) => {
    if (!dragState.current.isDown) return
    const el = tabsRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = x - dragState.current.startX
    if (Math.abs(walk) > 5) dragState.current.moved = true
    el.scrollLeft = dragState.current.scrollLeft - walk
  }
  const handleTabClick = (tabId) => {
    if (dragState.current.moved) { dragState.current.moved = false; return }
    setActiveTab(tabId)
  }

  useEffect(() => {
    localStorage.setItem(FORM_KEY, JSON.stringify(form))
  }, [form])

  useEffect(() => {
    if (result) localStorage.setItem(RESULT_KEY, JSON.stringify(result))
  }, [result])

  useEffect(() => {
    localStorage.setItem(PACKING_KEY, JSON.stringify(packingList))
  }, [packingList])

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist))
  }, [checklist])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const toggleChecked = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const fetchGroupBC = async (tripInput, weather) => {
    setGroupBCError(false)
    try {
      const response = await axios.post(`${API_BASE}/ai/travel-plan/group-bc`, { ...tripInput, weather })
      setResult(prev => (prev ? { ...prev, ...response.data } : prev))
      setPackingList(response.data.packing || [])
    } catch {
      setGroupBCError(true)
    }
  }

  const handleGenerate = async () => {
    if (!form.destination.trim() || isLoading) return
    setIsLoading(true)
    setResult(null)
    setGroupBCError(false)
    setSavedPlan(null)
    setLoadingMessage(LOADING_MESSAGES[0])

    let messageIndex = 0
    const rotation = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[messageIndex])
    }, 1500)
    timers.current.push(rotation)

    const tripInput = {
      origin: form.origin,
      destination: form.destination,
      dates: form.dates,
      style: form.style,
      activities: form.activities,
      language,
      currency: form.currency,
    }
    lastRequestRef.current = tripInput

    try {
      const response = await axios.post(`${API_BASE}/ai/travel-plan/group-a`, tripInput)
      const groupA = response.data.groupA
      setResult(groupA)
      setChecklist({})
      setActiveTab(groupA.needsFlight ? 'flights' : 'route')
      clearInterval(rotation)
      setIsLoading(false)
      setLoadingMessage(LOADING_MESSAGES[0])

      fetchGroupBC(tripInput, groupA.weather)
    } catch (error) {
      toast.error(error.response?.data?.message || t('aiSuite.generateErrorFallback'))
      clearInterval(rotation)
      setIsLoading(false)
      setLoadingMessage(LOADING_MESSAGES[0])
    }
  }

  const handleRetryGroupBC = () => {
    if (!lastRequestRef.current || !result) return
    fetchGroupBC(lastRequestRef.current, result.weather)
  }

  const handleNewPlan = () => {
    setResult(null)
    setPackingList([])
    setChecklist({})
    setSavedPlan(null)
    localStorage.removeItem(RESULT_KEY)
    localStorage.removeItem(PACKING_KEY)
    localStorage.removeItem(CHECKLIST_KEY)
  }

  const groupBCReady = result?.captions !== undefined
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const downloadPlanAsFile = () => {
    const text = formatPlanAsText(result, packingList, t)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `travel-plan-${result.destination.replace(/[^\p{L}\p{N}]+/gu, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const saveToCloud = async () => {
    const authHeaders = { Authorization: `Bearer ${localStorage.getItem('token')}` }
    const body = { ...lastRequestRef.current, plan: result, packing: packingList }
    if (savedPlan) {
      await axios.put(`${API_BASE}/ai/travel-plan/${savedPlan.id}`, body, { headers: authHeaders })
      return savedPlan
    }
    const response = await axios.post(`${API_BASE}/ai/travel-plan/save`, body, { headers: authHeaders })
    const next = { id: response.data.id, shareToken: response.data.shareToken }
    setSavedPlan(next)
    return next
  }

  const handleSavePlan = async () => {
    if (!groupBCReady) { toast.error(t('aiSuite.loadingMore')); return }
    if (!currentUser) {
      downloadPlanAsFile()
      toast.success(t('aiSuite.planSaved'))
      return
    }
    setIsSaving(true)
    try {
      const { shareToken } = await saveToCloud()
      const shareUrl = `${window.location.origin}/trip/${shareToken}`
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('aiSuite.planSavedWithLink'))
      } catch {
        toast.success(shareUrl)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('aiSuite.generateErrorFallback'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSharePlan = async () => {
    if (!groupBCReady) { toast.error(t('aiSuite.loadingMore')); return }

    if (!currentUser) {
      const text = formatPlanAsText(result, packingList, t)
      if (navigator.share) {
        try {
          await navigator.share({ title: `${t('aiSuite.shareTitlePrefix')} ${result.destination}`, text })
        } catch {
          // user cancelled the native share sheet
        }
        return
      }
      try {
        await navigator.clipboard.writeText(text)
        toast.success(t('aiSuite.planCopied'))
      } catch {
        toast.error(t('aiSuite.planCopyError'))
      }
      return
    }

    setIsSaving(true)
    try {
      const { shareToken } = await saveToCloud()
      const shareUrl = `${window.location.origin}/trip/${shareToken}`
      if (navigator.share) {
        try {
          await navigator.share({ title: `${t('aiSuite.shareTitlePrefix')} ${result.destination}`, url: shareUrl })
        } catch {
          // user cancelled the native share sheet
        }
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('aiSuite.planCopied'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('aiSuite.generateErrorFallback'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefine = async () => {
    const instruction = refineInstruction.trim()
    if (!instruction || isRefining || !groupBCReady) return
    setIsRefining(true)
    try {
      const response = await axios.post(`${API_BASE}/ai/travel-plan/refine`, {
        ...lastRequestRef.current,
        currentPlan: result,
        instruction,
      })
      const refined = response.data.plan
      setResult(refined)
      setPackingList(refined.packing || [])
      setChecklist({})
      setActiveTab(refined.needsFlight ? 'flights' : 'route')
      setRefineInstruction('')
    } catch (error) {
      toast.error(error.response?.data?.message || t('aiSuite.generateErrorFallback'))
    } finally {
      setIsRefining(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6">
        <TravelForm form={form} setForm={setForm} onGenerate={handleGenerate} isLoading={isLoading} />

        {isLoading && <LoadingStatus message={loadingMessage} />}

        {result && !isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-4 md:px-6 pt-5">
              <div
                ref={tabsRef}
                onMouseDown={handleTabsMouseDown}
                onMouseMove={handleTabsMouseMove}
                onMouseUp={handleTabsMouseUpOrLeave}
                onMouseLeave={handleTabsMouseUpOrLeave}
                className="flex-1 min-w-0 flex gap-1 overflow-x-auto no-scrollbar cursor-grab select-none"
              >
                {TABS.filter(tab => tab.id !== 'flights' || result.needsFlight).map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-sky-500 text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={14} />
                      {t(tab.labelKey)}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={handleSavePlan}
                  title={currentUser ? t('aiSuite.savePlanTitle') : t('aiSuite.signInToSave')}
                  disabled={!groupBCReady || isSaving}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={handleSharePlan}
                  title={t('aiSuite.sharePlanTitle')}
                  disabled={!groupBCReady || isSaving}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {groupBCReady && (
              <div className="px-4 md:px-6 pt-4">
                <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-500/10 rounded-full pl-4 pr-1.5 py-1.5">
                  <input
                    type="text"
                    value={refineInstruction}
                    onChange={e => setRefineInstruction(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRefine() }}
                    placeholder={t('aiSuite.refinePlaceholder')}
                    disabled={isRefining}
                    maxLength={300}
                    className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    onClick={handleRefine}
                    disabled={isRefining || !refineInstruction.trim()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-500 text-white text-xs font-medium cursor-pointer hover:bg-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {isRefining ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Wand2 size={14} />
                    )}
                    {t('aiSuite.refineButton')}
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 md:p-6">
              {activeTab === 'flights' && result.needsFlight && <FlightsTab result={result} />}
              {activeTab === 'route' && <RouteTab result={result} />}
              {activeTab === 'accommodation' && (
                result.accommodation
                  ? <AccommodationTab result={result} />
                  : <TabPending error={groupBCError} onRetry={handleRetryGroupBC} />
              )}
              {activeTab === 'packing' && (
                result.packing
                  ? (
                    <PackingTab
                      result={result}
                      packingList={packingList}
                      setPackingList={setPackingList}
                      checklist={checklist}
                      setChecklist={setChecklist}
                      toggleChecked={toggleChecked}
                    />
                  )
                  : <TabPending error={groupBCError} onRetry={handleRetryGroupBC} />
              )}
              {activeTab === 'budget' && <BudgetTab result={result} />}
              {activeTab === 'spots' && (
                result.spots
                  ? <SpotsFoodTab result={result} />
                  : <TabPending error={groupBCError} onRetry={handleRetryGroupBC} />
              )}
              {activeTab === 'captions' && (
                result.captions
                  ? <CaptionsTab result={result} />
                  : <TabPending error={groupBCError} onRetry={handleRetryGroupBC} />
              )}
            </div>

            <div className="px-4 md:px-6 pb-6">
              <button
                onClick={handleNewPlan}
                className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer"
              >
                {t('aiSuite.startNewPlan')}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
