import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Sparkles, Plane, Luggage, Wallet, Camera, MessageCircle,
  Copy, Check, CloudRain, MapPin, UtensilsCrossed, ExternalLink, Wand2,
  Route as RouteIcon, Hotel, X, Plus, Download, Share2,
} from 'lucide-react'
import { NavBar, Footer } from '../components/Sections'
import { API_BASE } from '../utils/api'
import { useLanguage } from '../lib/language'

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

const TABS = [
  { id: 'flights', labelKey: 'aiSuite.tabFlights', icon: Plane },
  { id: 'route', labelKey: 'aiSuite.tabRoute', icon: RouteIcon },
  { id: 'accommodation', labelKey: 'aiSuite.tabAccommodation', icon: Hotel },
  { id: 'packing', labelKey: 'aiSuite.tabPacking', icon: Luggage },
  { id: 'budget', labelKey: 'aiSuite.tabBudget', icon: Wallet },
  { id: 'spots', labelKey: 'aiSuite.tabSpots', icon: Camera },
  { id: 'captions', labelKey: 'aiSuite.tabCaptions', icon: MessageCircle },
]

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

function FlightsTab({ result }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('aiSuite.flightDuration')}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{result.flights.duration}</p>
        </div>
        <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('aiSuite.flightPrice')}</p>
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
          {t('aiSuite.skyscannerCta')}
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-5 py-3 border border-sky-500 text-sky-600 dark:text-sky-400 text-sm font-semibold rounded-full hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors"
        >
          {t('aiSuite.tripComCta')}
        </a>
      </div>
    </div>
  )
}

function RouteTab({ result }) {
  return (
    <div className="flex flex-col gap-4">
      {(result.route || []).map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center flex-shrink-0">
            <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
            {i < result.route.length - 1 && <span className="w-px flex-1 bg-gray-200 dark:bg-gray-600 mt-1" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function AccommodationTab({ result }) {
  return (
    <div className="flex flex-col gap-3">
      {(result.accommodation || []).map(stay => (
        <div key={stay.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stay.name}</p>
            <span className="flex-shrink-0 text-xs font-medium text-sky-600 dark:text-sky-400">{stay.priceRange}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stay.area}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{stay.desc}</p>
        </div>
      ))}
    </div>
  )
}

function PackingTab({ result, packingList, setPackingList, checklist, setChecklist, toggleChecked }) {
  const { t } = useLanguage()
  const [newItemInputs, setNewItemInputs] = useState({})
  const [newCategoryName, setNewCategoryName] = useState('')

  const addItem = (category) => {
    const text = (newItemInputs[category] || '').trim()
    if (!text) return
    setPackingList(prev => prev.map(cat => cat.category === category ? { ...cat, items: [...cat.items, text] } : cat))
    setNewItemInputs(prev => ({ ...prev, [category]: '' }))
  }

  const removeItem = (category, item) => {
    setPackingList(prev => prev.map(cat => cat.category === category ? { ...cat, items: cat.items.filter(i => i !== item) } : cat))
    setChecklist(prev => {
      const next = { ...prev }
      delete next[`${category}:${item}`]
      return next
    })
  }

  const addCategory = () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed) return
    setPackingList(prev => prev.some(c => c.category === trimmed) ? prev : [...prev, { category: trimmed, items: [] }])
    setNewCategoryName('')
  }

  const removeCategory = (category) => {
    setPackingList(prev => prev.filter(c => c.category !== category))
    setChecklist(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(key => { if (key.startsWith(`${category}:`)) delete next[key] })
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 bg-sky-50 dark:bg-sky-500/10 rounded-xl p-4">
        <CloudRain size={20} className="text-sky-500 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-200">{result.weather}</p>
      </div>

      {packingList.map(({ category, items }) => (
        <div key={category}>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{category}</h3>
            <button
              type="button"
              onClick={() => removeCategory(category)}
              title={t('aiSuite.removeCategory')}
              className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {items.map(item => {
              const key = `${category}:${item}`
              return (
                <div key={key} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checklist[key]}
                      onChange={() => toggleChecked(key)}
                      className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                    />
                    <span className={`text-sm ${checklist[key] ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                      {item}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(category, item)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 cursor-pointer flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newItemInputs[category] || ''}
              onChange={e => setNewItemInputs(prev => ({ ...prev, [category]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(category) } }}
              placeholder={t('aiSuite.addItemToCategory').replace('{category}', category)}
              className="flex-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem(category)}
              disabled={!(newItemInputs[category] || '').trim()}
              className="p-1.5 rounded-lg border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }}
          placeholder={t('aiSuite.addNewCategoryPlaceholder')}
          className="flex-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30 transition-colors"
        />
        <button
          type="button"
          onClick={addCategory}
          disabled={!newCategoryName.trim()}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={14} /> {t('aiSuite.addCategory')}
        </button>
      </div>
    </div>
  )
}

function BudgetTab({ result }) {
  const { t } = useLanguage()
  const barColors = ['bg-sky-500', 'bg-teal-500', 'bg-amber-500', 'bg-violet-500']
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('aiSuite.totalBudget')}</p>
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
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          <MapPin size={16} className="text-sky-500" /> {t('aiSuite.popularSpots')}
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
          <UtensilsCrossed size={16} className="text-sky-500" /> {t('aiSuite.mustTryDishes')}
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
        <p className="text-xs uppercase tracking-wide text-sky-100 mb-1">{t('aiSuite.fullGuide')}</p>
        <p className="text-lg font-bold">{t('aiSuite.readMoreTemplate').replace('{destination}', result.destination)}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium mt-2">
          {t('aiSuite.readMore')} <ExternalLink size={13} />
        </span>
      </a>
    </div>
  )
}

function CaptionsTab({ result }) {
  const { t } = useLanguage()
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
                {t('aiSuite.copied')}
              </span>
            )}
          </div>
        </div>
      ))}
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
  const { t } = useLanguage()
  const LOADING_MESSAGES = [
    t('aiSuite.loadingMessage1'),
    t('aiSuite.loadingMessage2'),
    t('aiSuite.loadingMessage3'),
    t('aiSuite.loadingMessage4'),
    t('aiSuite.loadingMessage5'),
  ]
  const [form, setForm] = useState(() => loadJSON(FORM_KEY, { origin: '', destination: '', dates: '', style: 'Mid-range', activities: [] }))
  const [result, setResult] = useState(loadPersistedResult)
  const [packingList, setPackingList] = useState(() => loadJSON(PACKING_KEY, []))
  const [checklist, setChecklist] = useState(() => loadJSON(CHECKLIST_KEY, {}))
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [activeTab, setActiveTab] = useState(() => {
    const persisted = loadPersistedResult()
    return persisted && !persisted.needsFlight ? 'route' : 'flights'
  })
  const timers = useRef([])

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

  const handleGenerate = async () => {
    if (!form.destination.trim() || isLoading) return
    setIsLoading(true)
    setResult(null)
    setLoadingMessage(LOADING_MESSAGES[0])

    let messageIndex = 0
    const rotation = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[messageIndex])
    }, 1500)
    timers.current.push(rotation)

    try {
      const response = await axios.post(`${API_BASE}/ai/travel-plan`, {
        origin: form.origin,
        destination: form.destination,
        dates: form.dates,
        style: form.style,
        activities: form.activities,
      })
      setResult(response.data.plan)
      setPackingList(response.data.plan.packing || [])
      setChecklist({})
      setActiveTab(response.data.plan.needsFlight ? 'flights' : 'route')
    } catch (error) {
      toast.error(error.response?.data?.message || t('aiSuite.generateErrorFallback'))
    } finally {
      clearInterval(rotation)
      setIsLoading(false)
      setLoadingMessage(LOADING_MESSAGES[0])
    }
  }

  const handleNewPlan = () => {
    setResult(null)
    setPackingList([])
    setChecklist({})
    localStorage.removeItem(RESULT_KEY)
    localStorage.removeItem(PACKING_KEY)
    localStorage.removeItem(CHECKLIST_KEY)
  }

  const handleSavePlan = () => {
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
    toast.success(t('aiSuite.planSaved'))
  }

  const handleSharePlan = async () => {
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
              <div className="flex-1 min-w-0 flex gap-1 overflow-x-auto no-scrollbar">
                {TABS.filter(tab => tab.id !== 'flights' || result.needsFlight).map(tab => {
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
                      {t(tab.labelKey)}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={handleSavePlan}
                  title={t('aiSuite.savePlanTitle')}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={handleSharePlan}
                  title={t('aiSuite.sharePlanTitle')}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'flights' && result.needsFlight && <FlightsTab result={result} />}
              {activeTab === 'route' && <RouteTab result={result} />}
              {activeTab === 'accommodation' && <AccommodationTab result={result} />}
              {activeTab === 'packing' && (
                <PackingTab
                  result={result}
                  packingList={packingList}
                  setPackingList={setPackingList}
                  checklist={checklist}
                  setChecklist={setChecklist}
                  toggleChecked={toggleChecked}
                />
              )}
              {activeTab === 'budget' && <BudgetTab result={result} />}
              {activeTab === 'spots' && <SpotsFoodTab result={result} />}
              {activeTab === 'captions' && <CaptionsTab result={result} />}
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
