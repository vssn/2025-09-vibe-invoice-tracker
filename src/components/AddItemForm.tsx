import React, { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
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
import type { InvoiceItem } from '../types/invoice'

interface AddItemFormProps {
  onAddItem: (item: Omit<InvoiceItem, 'id'>) => void
}

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [newStore, setNewStore] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDate, setNewDate] = useState<Date | undefined>(new Date())

  const handleAddItem = () => {
    if (newStore.trim() && newPrice.trim() && newDescription.trim() && newDate) {
      const price = parseFloat(newPrice)
      if (!isNaN(price)) {
        onAddItem({
          retailStore: newStore.trim(),
          price: price,
          description: newDescription.trim(),
          date: newDate.toISOString()
        })
        
        // Reset form
        setNewStore('')
        setNewPrice('')
        setNewDescription('')
        setNewDate(new Date())
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem()
    }
  }

  return (
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
            onClick={handleAddItem} 
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
  )
}