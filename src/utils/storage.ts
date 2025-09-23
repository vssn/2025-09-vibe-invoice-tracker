import type { InvoiceItem } from '../types/invoice'

const STORAGE_KEY = 'invoices-and-receipts-items'
const URL_DATA_PARAM = 'd' // Shorter parameter name

// Helper functions for localStorage
export const saveItemsToStorage = (items: InvoiceItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save items to localStorage:', error)
  }
}

export const clearItemsFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear items from localStorage:', error)
  }
}

// Compress and decompress data for shorter URLs
const compressData = (items: InvoiceItem[]): string => {
  // Create a more compact representation
  const compact = items.map(item => ([
    item.id,
    item.retailStore,
    item.price,
    item.description,
    item.date
  ]))
  return JSON.stringify(compact)
}

const decompressData = (compactStr: string): InvoiceItem[] => {
  const compact = JSON.parse(compactStr)
  return compact.map((item: any[]) => ({
    id: item[0] || 1,
    retailStore: item[1] || 'Unknown Store',
    price: Number(item[2]) || 0,
    description: item[3] || 'No description',
    date: item[4] || new Date().toISOString()
  }))
}

// URL-safe base64 encoding/decoding
const urlSafeBase64Encode = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

const urlSafeBase64Decode = (str: string): string => {
  // Add padding back
  str += '==='.slice(0, (4 - str.length % 4) % 4)
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  return atob(str)
}

// Load data from URL parameter if present
const loadItemsFromUrlParam = (): InvoiceItem[] | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get(URL_DATA_PARAM)
    
    if (encodedData) {
      // Decode URL-safe base64 data and decompress
      const decodedData = urlSafeBase64Decode(encodedData)
      const parsedItems = decompressData(decodedData)
      
      // Validate the data structure
      if (Array.isArray(parsedItems)) {
        return parsedItems
      }
    }
  } catch (error) {
    console.error('Failed to load data from URL parameter:', error)
  }
  return null
}

export const loadItemsFromStorage = (): InvoiceItem[] => {
  // First, try to load from URL parameter
  const urlData = loadItemsFromUrlParam()
  if (urlData && urlData.length > 0) {
    // Save URL data to localStorage and clean up the URL
    saveItemsToStorage(urlData)
    // Remove the data parameter from URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.delete(URL_DATA_PARAM)
    window.history.replaceState({}, document.title, url.toString())
    return urlData
  }

  // If no URL data, load from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsedItems = JSON.parse(stored)
      // Migrate old data format to new format with description and date fields
      return parsedItems.map((item: any) => ({
        id: item.id,
        retailStore: item.retailStore,
        price: item.price,
        description: item.description || 'No description',
        date: item.date || new Date().toISOString()
      }))
    }
  } catch (error) {
    console.error('Failed to load items from localStorage:', error)
  }
  // Return default data if localStorage is empty or fails
  return [
    { id: 1, retailStore: 'MediaMarkt', price: 42.50, description: 'Bluetooth headphones', date: new Date('2024-01-15').toISOString() },
    { id: 2, retailStore: 'Carrefour', price: 28.90, description: 'Weekly groceries', date: new Date('2024-01-18').toISOString() },
    { id: 3, retailStore: 'Amazon', price: 35.75, description: 'USB-C cable and adapter', date: new Date('2024-01-20').toISOString() },
    { id: 4, retailStore: 'IKEA', price: 67.00, description: 'Desk organizer set', date: new Date('2024-01-22').toISOString() },
    { id: 5, retailStore: 'Saturn', price: 159.99, description: 'Wireless mouse and keyboard', date: new Date('2024-01-25').toISOString() },
  ]
}

// Generate a shareable link with compressed and URL-safe encoded data
export const generateShareLink = (items: InvoiceItem[]): string => {
  try {
    // Compress data and encode with URL-safe base64
    const compactData = compressData(items)
    const encodedData = urlSafeBase64Encode(compactData)
    const baseUrl = window.location.origin + window.location.pathname
    
    // Add fragment identifier for better URL recognition by tools
    return `${baseUrl}?${URL_DATA_PARAM}=${encodedData}#shared-invoices`
  } catch (error) {
    console.error('Failed to generate share link:', error)
    throw error
  }
}