import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppIcon } from '@/components/AppIcon'
import { AddItemForm } from '@/components/AddItemForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import { ActionsSummary } from '@/components/ActionsSummary'
import { SharingInfo } from '@/components/SharingInfo'
import type { InvoiceItem } from '../types/invoice'
import { loadItemsFromStorage, saveItemsToStorage, clearItemsFromStorage } from '@/utils/storage'



export function InvoiceTracker() {
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    // Load items from localStorage on initial render
    return loadItemsFromStorage()
  })

  const [isSaving, setIsSaving] = useState(false)
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

  const addItem = (newItem: Omit<InvoiceItem, 'id'>) => {
    // Get next available ID (handle case where items array is empty)
    const nextId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1
    const itemWithId: InvoiceItem = {
      id: nextId,
      ...newItem
    }
    setItems([...items, itemWithId])
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleClearAll = () => {
    setItems([])
    clearItemsFromStorage()
  }

  const totalSpent = items.reduce((sum, item) => sum + item.price, 0)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
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

      {/* Actions Summary */}
      <ActionsSummary 
        items={items}
        totalSpent={totalSpent}
        onClearAll={handleClearAll}
      />

      {/* Add Item Form */}
      <AddItemForm onAddItem={addItem} />
      
      {/* Invoice Table */}
      <InvoiceTable 
        items={items}
        onDeleteItem={deleteItem}
      />
    
      {/* Sharing Info */}
      <SharingInfo />

    </div>
  )
}
