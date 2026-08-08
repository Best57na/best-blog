import { Plane, Luggage, Wallet, Camera, MessageCircle, Route as RouteIcon, Hotel } from 'lucide-react'

export const TABS = [
  { id: 'flights', labelKey: 'aiSuite.tabFlights', icon: Plane },
  { id: 'route', labelKey: 'aiSuite.tabRoute', icon: RouteIcon },
  { id: 'accommodation', labelKey: 'aiSuite.tabAccommodation', icon: Hotel },
  { id: 'packing', labelKey: 'aiSuite.tabPacking', icon: Luggage },
  { id: 'budget', labelKey: 'aiSuite.tabBudget', icon: Wallet },
  { id: 'spots', labelKey: 'aiSuite.tabSpots', icon: Camera },
  { id: 'captions', labelKey: 'aiSuite.tabCaptions', icon: MessageCircle },
]
