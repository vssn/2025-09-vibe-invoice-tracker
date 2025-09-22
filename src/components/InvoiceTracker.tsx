import React, { useState, useEffect } from 'react'
import { Trash2, Calendar as CalendarIcon, Share, Copy, Check, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface InvoiceItem {
  id: number
  retailStore: string
  price: number
  description: string
  date: string // ISO date string
}

const STORAGE_KEY = 'invoices-and-receipts-items'
const URL_DATA_PARAM = 'data'

// App Icon Component
const AppIcon = ({ isDark = false }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" 
       className="mx-auto transition-transform duration-300 hover:scale-110 cursor-default drop-shadow-lg">
    {/* Gradient definition */}
    <defs>
      <linearGradient id="violetBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(270 85% 60%)" className="light-mode-stop" />
        <stop offset="100%" stopColor="hsl(240 85% 65%)" className="light-mode-stop" />
      </linearGradient>
      <linearGradient id="violetBlueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(270 85% 70%)" />
        <stop offset="100%" stopColor="hsl(240 85% 75%)" />
      </linearGradient>
    </defs>
    {/* Document background */}
    <rect x="12" y="4" width="32" height="44" rx="4" 
          fill={`url(#${isDark ? 'violetBlueGradientDark' : 'violetBlueGradient'})`} 
          stroke={isDark ? "hsl(270 85% 70%)" : "hsl(270 85% 55%)"} strokeWidth="2"/>
    
    {/* Document fold corner */}
    <path d="M36 4L44 12V8C44 5.79086 42.2091 4 40 4H36Z" 
          fill={isDark ? "hsl(270 85% 70%)" : "hsl(270 85% 55%)"}/>
    <path d="M36 4V12H44" 
          stroke={isDark ? "hsl(270 85% 70%)" : "hsl(270 85% 55%)"} strokeWidth="2" fill="none"/>
    
    {/* Document lines (representing text) */}
    <rect x="18" y="18" width="16" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="18" y="22" width="12" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="18" y="26" width="14" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="18" y="30" width="10" height="2" rx="1" fill="white" opacity="0.8"/>
    
    {/* Euro symbol circle background */}
    <circle cx="28" cy="40" r="9" fill="hsl(45 100% 95%)" stroke="hsl(45 90% 60%)" strokeWidth="2.5"/>
    
    {/* Euro symbol - larger and more detailed */}
    <path d="M24 34C25.5 33 27 32.5 28.5 32.5C30.5 32.5 32.2 33.5 33.5 35M24 46C25.5 47 27 47.5 28.5 47.5C30.5 47.5 32.2 46.5 33.5 45M21 38H34M21 42H34" 
          stroke="hsl(45 90% 50%)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    
    {/* Additional detail: small lines for invoice items */}
    <rect x="18" y="34" width="4" height="1" rx="0.5" fill="white" opacity="0.6"/>
    <rect x="18" y="36" width="6" height="1" rx="0.5" fill="white" opacity="0.6"/>
    
    {/* Shadow */}
    <ellipse cx="28" cy="56" rx="16" ry="4" fill="#000000" opacity="0.1"/>
  </svg>
)

// Currency formatting utility
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Safe date formatting utility
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    return format(date, 'dd. MMM yyyy')
  } catch (error) {
    return 'Invalid date'
  }
}

// Helper functions for localStorage
const saveItemsToStorage = (items: InvoiceItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save items to localStorage:', error)
  }
}

const clearItemsFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear items from localStorage:', error)
  }
}

// Load data from URL parameter if present
const loadItemsFromUrlParam = (): InvoiceItem[] | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get(URL_DATA_PARAM)
    
    if (encodedData) {
      // Decode base64 data
      const decodedData = atob(encodedData)
      const parsedItems = JSON.parse(decodedData)
      
      // Validate the data structure
      if (Array.isArray(parsedItems)) {
        return parsedItems.map((item: any) => ({
          id: item.id || 1,
          retailStore: item.retailStore || 'Unknown Store',
          price: Number(item.price) || 0,
          description: item.description || 'No description',
          date: item.date || new Date().toISOString()
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load data from URL parameter:', error)
  }
  return null
}

const loadItemsFromStorage = (): InvoiceItem[] => {
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

// Generate a shareable link with invoice data encoded as base64
const generateShareLink = (items: InvoiceItem[]): string => {
  try {
    const jsonData = JSON.stringify(items)
    const encodedData = btoa(jsonData)
    const baseUrl = window.location.origin + window.location.pathname
    return `${baseUrl}?${URL_DATA_PARAM}=${encodedData}`
  } catch (error) {
    console.error('Failed to generate share link:', error)
    throw error
  }
}

export function InvoiceTracker() {
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    // Load items from localStorage on initial render
    return loadItemsFromStorage()
  })

  const [newStore, setNewStore] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDate, setNewDate] = useState<Date | undefined>(new Date())
  const [isSaving, setIsSaving] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  // Apply dark mode theme
  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Save items to localStorage whenever items change
  useEffect(() => {
    const saveData = async () => {
      setIsSaving(true)
      saveItemsToStorage(items)
      // Small delay to show the saving indicator
      setTimeout(() => setIsSaving(false), 300)
    }
    
    // Save data on any change
    saveData()
  }, [items])

  const addItem = () => {
    if (newStore.trim() && newPrice.trim() && newDescription.trim() && newDate) {
      const price = parseFloat(newPrice)
      if (!isNaN(price)) {
        // Get next available ID (handle case where items array is empty)
        const nextId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1
        const newItem: InvoiceItem = {
          id: nextId,
          retailStore: newStore.trim(),
          price: price,
          description: newDescription.trim(),
          date: newDate.toISOString()
        }
        setItems([...items, newItem])
        setNewStore('')
        setNewPrice('')
        setNewDescription('')
        setNewDate(new Date())
      }
    }
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const clearAllItems = () => {
    if (window.confirm('Are you sure you want to clear all items? This action cannot be undone.')) {
      setItems([])
      clearItemsFromStorage()
    }
  }

  const totalSpent = items.reduce((sum, item) => sum + item.price, 0)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleShareLink = async () => {
    if (items.length === 0) {
      return // Don't allow sharing if no items
    }

    setIsSharing(true)
    setShareSuccess(false)

    try {
      const shareLink = generateShareLink(items)
      
      // Try to use the modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLink)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareLink
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      
      setShareSuccess(true)
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setShareSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Failed to copy share link:', error)
      // You could add error state here if needed
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      {/* Saving Indicator Overlay */}
      {isSaving && (
        <div className="absolute top-4 right-4 z-50 bg-background/90 backdrop-blur-sm border rounded-md px-3 py-1.5 shadow-sm">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="animate-spin">💾</span>
            Saving...
          </p>
        </div>
      )}
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-accent transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      <div className="text-center mb-8">
        {/* App Icon */}
        <div className="mb-4">
          <AppIcon isDark={isDarkMode} />
        </div>
        <h1 className="text-3xl font-bold text-gradient-violet-blue">Invoices and Receipts</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Track your purchases and expenses. All data is stored privately in your browser's local storage.
        </p>
      </div>

      {/* Actions Card */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">Total Amount: {formatCurrency(totalSpent)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={shareSuccess ? "default" : "outline"}
              size="sm"
              onClick={handleShareLink}
              disabled={items.length === 0 || isSharing}
              className={`flex items-center gap-1 transition-all duration-300 ${
                shareSuccess ? 'gradient-violet-blue text-white border-0 hover:opacity-90' : 'hover:border-primary'
              }`}
              aria-label={shareSuccess ? "Share link copied to clipboard" : isSharing ? "Generating share link..." : `Create share link for ${items.length} invoice${items.length !== 1 ? 's' : ''}`}
              title={shareSuccess ? "Link copied!" : "Generate and copy share link"}
            >
              {shareSuccess ? (
                <><Check className="h-3 w-3" aria-hidden="true" /> Copied!</>
              ) : isSharing ? (
                <><Copy className="h-3 w-3 animate-pulse" aria-hidden="true" /> Copying...</>
              ) : (
                <><Share className="h-3 w-3" aria-hidden="true" /> Share Link</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllItems}
              disabled={items.length === 0}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              aria-label={`Clear all ${items.length} invoice${items.length !== 1 ? 's' : ''} from the list`}
              title="Delete all invoices (this action cannot be undone)"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Add Item Form Card */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
        <div className="space-y-3">
          {/* First row: Store and Amount */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter store or vendor name"
              value={newStore}
              onChange={(e) => setNewStore(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              aria-label="Store or vendor name"
              aria-required="true"
            />
            <Input
              placeholder="Enter amount"
              type="number"
              step="0.01"
              min="0"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-32"
              aria-label="Amount in euros"
              aria-required="true"
            />
          </div>
          
          {/* Second row: Description */}
          <div>
            <Textarea
              placeholder="Enter description (e.g., Bluetooth headphones, Weekly groceries)..." 
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="min-h-[60px] resize-none"
              aria-label="Item description"
              aria-required="true"
            />
          </div>
          
          {/* Third row: Date picker and Add button */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !newDate && "text-muted-foreground"
                      }`}
                      aria-label={newDate ? `Selected date: ${format(newDate, "dd MMMM yyyy")}. Click to change date` : "Click to select a date"}
                      aria-haspopup="dialog"
                      aria-expanded="false"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {newDate ? format(newDate, "dd. MMM yyyy") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" role="dialog" aria-label="Date picker">
                    <Calendar
                      mode="single"
                      selected={newDate}
                      onSelect={setNewDate}
                      initialFocus
                      aria-label="Select a date for the invoice"
                    />
                  </PopoverContent>
              </Popover>
            </div>
            <Button 
              onClick={addItem} 
              disabled={!newStore.trim() || !newPrice.trim() || !newDescription.trim() || !newDate}
              className="px-8 gradient-violet-blue hover:opacity-90 transition-opacity"
              aria-label="Add new invoice item"
              title="Add the invoice item to your list"
            >
              Add Item
            </Button>
          </div>
        </div>
      </div>
      
      {/* Items Table Card */}
      <div className="bg-card rounded-lg border shadow-sm">
        <Table role="table" aria-label="Invoice and receipt items">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]" scope="col">Store/Vendor</TableHead>
              <TableHead className="w-[30%]" scope="col">Description</TableHead>
              <TableHead className="w-[15%]" scope="col">Date</TableHead>
              <TableHead className="w-[15%]" scope="col">Amount</TableHead>
              <TableHead className="w-[20%] text-right" scope="col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.retailStore}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                <TableCell className="text-sm">{formatDate(item.date)}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete invoice from ${item.retailStore} for ${formatCurrency(item.price)}`}
                    title={`Delete this invoice`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}