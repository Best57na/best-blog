import { useState } from 'react'
import { Copy, Check, CloudRain, MapPin, UtensilsCrossed, ExternalLink, X, Plus } from 'lucide-react'
import { useLanguage } from '../lib/language'

export function FlightsTab({ result }) {
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

export function RouteTab({ result }) {
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

export function AccommodationTab({ result }) {
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

export function PackingTab({ result, packingList, setPackingList, checklist, setChecklist, toggleChecked }) {
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

export function PackingReadOnlyTab({ result, packingList }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 bg-sky-50 dark:bg-sky-500/10 rounded-xl p-4">
        <CloudRain size={20} className="text-sky-500 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-200">{result.weather}</p>
      </div>

      {packingList.map(({ category, items }) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2.5">{category}</h3>
          <div className="flex flex-col gap-2">
            {items.map(item => (
              <div key={item} className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function BudgetTab({ result }) {
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

export function SpotsFoodTab({ result }) {
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

export function CaptionsTab({ result }) {
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
