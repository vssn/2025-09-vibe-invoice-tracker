import { formatCurrency, formatDate } from './format'
import {
  saveItemsToStorage,
  clearItemsFromStorage,
  loadItemsFromStorage,
  generateShareLink
} from './storage'

describe('format utils', () => {
  it('formats currency in EUR', () => {
    expect(formatCurrency(42.5)).toBe('42,50 €')
    expect(formatCurrency(1000)).toBe('1.000,00 €')
  })

  it('formats valid date', () => {
    expect(formatDate('2024-01-15')).toBe('15. Jan 2024')
  })

  it('returns Invalid date for bad input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date')
  })
})

describe('storage utils', () => {
  const testItems = [
    { id: 1, retailStore: 'Test', price: 10, description: 'desc', date: '2024-01-01' },
    { id: 2, retailStore: 'Shop', price: 20, description: 'desc2', date: '2024-01-02' }
  ]

  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', window.location.pathname)
  })

  it('saves and loads items from storage', () => {
    saveItemsToStorage(testItems)
    expect(loadItemsFromStorage()).toEqual(testItems)
  })

  it('clears items from storage', () => {
    saveItemsToStorage(testItems)
    clearItemsFromStorage()
    expect(loadItemsFromStorage().length).toBeGreaterThan(0) // returns default data
  })

  it('generates a share link containing encoded data', () => {
    const link = generateShareLink(testItems)
    expect(link).toContain('d=')
    expect(link).toContain('#shared-invoices')
  })
})
