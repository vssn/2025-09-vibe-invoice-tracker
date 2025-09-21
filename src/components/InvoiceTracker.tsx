import React, { useState, useEffect } from 'react'
import { Trash2, Calendar as CalendarIcon } from 'lucide-react'
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

// App Icon Component
const AppIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" 
       className="mx-auto transition-transform duration-300 hover:scale-110 cursor-default drop-shadow-lg">
    {/* Document background */}
    <rect x="12" y="4" width="32" height="44" rx="4" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>
    
    {/* Document fold corner */}
    <path d="M36 4L44 12V8C44 5.79086 42.2091 4 40 4H36Z" fill="#1E40AF"/>
    <path d="M36 4V12H44" stroke="#1E40AF" strokeWidth="2" fill="none"/>
    
    {/* Document lines (representing text) */}
    <rect x="18" y="18" width="16" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="18" y="22" width="12" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="18" y="26" width="14" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="18" y="30" width="10" height="2" rx="1" fill="white" opacity="0.8"/>
    
    {/* Euro symbol circle background */}
    <circle cx="28" cy="40" r="9" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5"/>
    
    {/* Euro symbol - larger and more detailed */}
    <path d="M24 34C25.5 33 27 32.5 28.5 32.5C30.5 32.5 32.2 33.5 33.5 35M24 46C25.5 47 27 47.5 28.5 47.5C30.5 47.5 32.2 46.5 33.5 45M21 38H34M21 42H34" 
          stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    
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
    return format(date, 'MMM dd, yyyy')
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

const loadItemsFromStorage = (): InvoiceItem[] => {
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        {/* App Icon */}
        <div className="mb-4">
          <AppIcon />
        </div>
        <h1 className="text-3xl font-bold">Invoices and Receipts</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Track your purchases and expenses. All data is stored privately in your browser's local storage.
        </p>
        {isSaving && (
          <p className="text-sm text-muted-foreground mt-2">
            💾 Saving...
          </p>
        )}
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Store/Vendor</TableHead>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead className="w-[15%]">Date</TableHead>
              <TableHead className="w-[15%]">Amount</TableHead>
              <TableHead className="w-[20%] text-right">Actions</TableHead>
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t bg-muted/50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">Total Amount:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllItems}
                disabled={items.length === 0}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Clear All
              </Button>
            </div>
            <span className="text-lg font-bold">{formatCurrency(totalSpent)}</span>
          </div>
          
          <div className="space-y-3">
            {/* First row: Store and Amount */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter store or vendor name"
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
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
              />
            </div>
            
            {/* Second row: Description */}
            <div>
              <Textarea
                placeholder="Enter description (e.g., Bluetooth headphones, Weekly groceries)..." 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="min-h-[60px] resize-none"
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
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDate}
                      onSelect={setNewDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button 
                onClick={addItem} 
                disabled={!newStore.trim() || !newPrice.trim() || !newDescription.trim() || !newDate}
                className="px-8"
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}