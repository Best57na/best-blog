import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavBar, Footer } from '../components/Sections'
import { API_BASE } from '../utils/api'
import { useLanguage } from '../lib/language'
import { TABS } from '../lib/travelPlanTabs'
import {
  FlightsTab, RouteTab, AccommodationTab, PackingReadOnlyTab, BudgetTab, SpotsFoodTab, CaptionsTab,
} from '../components/TravelPlanTabs'

function LoadingStatus() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-sky-100 dark:border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
    </div>
  )
}

export default function TripSharePage() {
  const { shareToken } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [trip, setTrip] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('route')

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setNotFound(false)
    axios.get(`${API_BASE}/ai/travel-plan/shared/${shareToken}`)
      .then(response => {
        if (cancelled) return
        setTrip(response.data)
        setActiveTab(response.data.plan.needsFlight ? 'flights' : 'route')
      })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [shareToken])

  const result = trip?.plan
  const packingList = trip?.packing || []

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6">
        {isLoading && <LoadingStatus />}

        {!isLoading && notFound && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('aiSuite.tripNotFound')}</p>
            <button
              onClick={() => navigate('/ai-travel-suite')}
              className="px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-sm text-white dark:text-gray-900 cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors"
            >
              {t('aiSuite.planYourOwnTrip')}
            </button>
          </div>
        )}

        {!isLoading && result && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-4 md:px-6 pt-5">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.destination}</h1>
              {trip.dates && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{trip.dates}</p>}
            </div>

            <div className="px-4 md:px-6 pt-4">
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
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'flights' && result.needsFlight && <FlightsTab result={result} />}
              {activeTab === 'route' && <RouteTab result={result} />}
              {activeTab === 'accommodation' && <AccommodationTab result={result} />}
              {activeTab === 'packing' && <PackingReadOnlyTab result={result} packingList={packingList} />}
              {activeTab === 'budget' && <BudgetTab result={result} />}
              {activeTab === 'spots' && <SpotsFoodTab result={result} />}
              {activeTab === 'captions' && <CaptionsTab result={result} />}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
