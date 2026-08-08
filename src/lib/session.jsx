import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useLanguage } from './language'
import { clearSession, getTokenExpiryMs, extendSession } from './sessionAuth'

const POLL_MS = 20_000
const WARNING_WINDOW_MS = 5 * 60 * 1000
const DISMISS_SUPPRESS_MS = 60_000

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [popupState, setPopupState] = useState('hidden') // 'hidden' | 'warning' | 'expired-refresh'
  const [msLeft, setMsLeft] = useState(0)
  const [isExtending, setIsExtending] = useState(false)
  const dismissedUntilRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      const expiry = getTokenExpiryMs()
      if (!expiry) {
        setPopupState('hidden')
        return
      }

      const remaining = expiry - Date.now()

      if (remaining <= 0) {
        clearSession()
        setPopupState('hidden')
        navigate('/login')
        toast.error(t('session.sessionExpiredToast'))
        return
      }

      setMsLeft(remaining)
      if (remaining <= WARNING_WINDOW_MS) {
        if (Date.now() >= dismissedUntilRef.current) setPopupState('warning')
      } else {
        setPopupState('hidden')
      }
    }

    tick()
    const interval = setInterval(tick, POLL_MS)
    const onVisible = () => { if (document.visibilityState === 'visible') tick() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [navigate, t])

  const handleDismiss = () => {
    dismissedUntilRef.current = Date.now() + DISMISS_SUPPRESS_MS
    setPopupState('hidden')
  }

  const handleExtend = async () => {
    setIsExtending(true)
    const result = await extendSession()
    setIsExtending(false)
    if (result.ok) {
      setPopupState('hidden')
    } else {
      setPopupState('expired-refresh')
    }
  }

  const handleLoginAgain = () => {
    clearSession()
    setPopupState('hidden')
    navigate('/login')
  }

  return (
    <SessionContext.Provider value={{ msLeft }}>
      {children}
      {popupState !== 'hidden' && (
        <SessionWarningDialog
          state={popupState}
          msLeft={msLeft}
          isExtending={isExtending}
          onExtend={handleExtend}
          onDismiss={handleDismiss}
          onLoginAgain={handleLoginAgain}
        />
      )}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function SessionWarningDialog({ state, msLeft, isExtending, onExtend, onDismiss, onLoginAgain }) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-10 py-10 max-w-sm w-full text-center relative">
        {state === 'warning' && (
          <>
            <button onClick={onDismiss} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('session.warningTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('session.warningBody').replace('{time}', formatCountdown(msLeft))}</p>
            <button
              onClick={onExtend}
              disabled={isExtending}
              className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium text-sm cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
            >
              {isExtending ? t('session.extending') : t('session.extendButton')}
            </button>
            <button onClick={onDismiss} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer">
              {t('session.dismissButton')}
            </button>
          </>
        )}
        {state === 'expired-refresh' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('session.loginAgainTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('session.loginAgainBody')}</p>
            <button
              onClick={onLoginAgain}
              className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium text-sm cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors"
            >
              {t('session.loginAgainButton')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
