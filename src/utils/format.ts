import { format } from 'date-fns'

// Currency formatting utility
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Safe date formatting utility
export const formatDate = (dateString: string): string => {
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