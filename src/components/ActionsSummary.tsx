import { useState } from 'react'
import { Share, Copy, Check, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { InvoiceItem } from '../types/invoice'
import { formatCurrency } from '@/utils/format'
import { generateShareLink } from '@/utils/storage'

interface ActionsSummaryProps {
  items: InvoiceItem[]
  totalSpent: number
  onClearAll: () => void
}

export function ActionsSummary({ items, totalSpent, onClearAll }: ActionsSummaryProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)

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

  const handleExportToPasswordManager = async () => {
    if (items.length === 0) {
      return // Don't allow export if no items
    }

    try {
      // Create a formatted JSON export
      const exportData = {
        app: 'Invoices and Receipts Tracker',
        exportDate: new Date().toISOString(),
        totalSpent,
        itemCount: items.length,
        items: items
      }
      
      const jsonString = JSON.stringify(exportData, null, 2)
      
      // Create a visible form to trigger browser password save dialog
      const form = document.createElement('form')
      form.method = 'post'
      form.action = window.location.href
      form.style.position = 'fixed'
      form.style.top = '-9999px'
      form.style.left = '-9999px'
      
      // Prevent actual navigation
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        // Clean up form after a delay to allow password managers to capture it
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form)
          }
        }, 2000)
      })
      
      // Create username field (using app name)
      const usernameInput = document.createElement('input')
      usernameInput.type = 'text'
      usernameInput.name = 'username'
      usernameInput.id = 'export-username'
      usernameInput.autocomplete = 'username'
      usernameInput.value = 'invoice-tracker-backup'
      
      // Create password field (containing the JSON data)
      const passwordInput = document.createElement('input')
      passwordInput.type = 'password'
      passwordInput.name = 'password'
      passwordInput.id = 'export-password'
      passwordInput.autocomplete = 'current-password'
      passwordInput.value = jsonString
      
      // Create submit button
      const submitButton = document.createElement('button')
      submitButton.type = 'submit'
      submitButton.textContent = 'Save'
      
      // Add inputs to form
      form.appendChild(usernameInput)
      form.appendChild(passwordInput)
      form.appendChild(submitButton)
      
      // Add form to document
      document.body.appendChild(form)
      
      // Focus and submit to trigger password manager
      usernameInput.focus()
      passwordInput.focus()
      
      // Programmatically submit the form
      setTimeout(() => {
        submitButton.click()
      }, 100)
      
      setExportSuccess(true)
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setExportSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const confirmClearAll = () => {
    onClearAll()
    setShowClearDialog(false)
  }

  return (
    <>
      <div className="bg-card/60 rounded-lg border shadow-sm p-4 mb-6">
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
              variant={exportSuccess ? "default" : "outline"}
              size="sm"
              onClick={handleExportToPasswordManager}
              disabled={items.length === 0}
              className={`flex items-center gap-1 transition-all duration-300 ${
                exportSuccess ? 'gradient-violet-blue text-white border-0 hover:opacity-90' : 'hover:border-primary'
              }`}
              aria-label={exportSuccess ? "Data copied for password manager" : `Export ${items.length} invoice${items.length !== 1 ? 's' : ''} to password manager`}
              title={exportSuccess ? "Copied to clipboard!" : "Copy JSON data for password manager"}
            >
              {exportSuccess ? (
                <><Check className="h-3 w-3" aria-hidden="true" /> Dialog should open</>
              ) : (
                <><Download className="h-3 w-3" aria-hidden="true" />Save as password</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
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

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Clear All Invoices</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all {items.length} invoice{items.length !== 1 ? 's' : ''}? 
              This action cannot be undone and will permanently remove all your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmClearAll}
              className="flex-1 sm:flex-initial"
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}