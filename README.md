# 📄 Invoices and Receipts Tracker

A privacy-first expense tracking app. All data stays in your browser - no servers, no data collection.

![Tech Stack](https://img.shields.io/badge/React%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20shadcn%2Fui-blue)

## ✨ Key Features

- **🔒 Complete Privacy**: 100% local storage, works offline, no data transmission
- **💰 Euro Currency**: Proper European formatting (€42,50) with real-time totals
- **📝 Rich Data**: Store name, description, date, and amount for each entry
- **📅 Date Picker**: Interactive calendar for selecting purchase dates
- **🎨 Modern UI**: Responsive design with custom icons and smooth animations
- **⚡ Instant UX**: Auto-save, keyboard shortcuts, input validation, bulk operations

## 🛠️ Built With

**Stack**: React 18 + TypeScript + Vite | **UI**: Tailwind CSS + shadcn/ui + Lucide icons | **Storage**: localStorage API

## 🚀 Quick Start

```bash
git clone <repository-url>
cd 2025-09-vibe-invoice-tracker
npm install
npm run dev
```

**Requirements**: Node.js 18+

## 📊 Data Structure

```typescript
interface InvoiceItem {
  id: number
  retailStore: string  // Store or vendor name
  price: number       // Amount in euros
  description: string // Item description
  date: string       // ISO date string
}
```

**Storage**: localStorage key `invoices-and-receipts-items` with JSON array format

## 🔧 Customization

**Currency**: Edit `formatCurrency` function for different locales (USD, GBP, etc.)
**Sample Data**: Modify `loadItemsFromStorage` default entries
**Styling**: Update Tailwind classes in components

## 🛡️ Privacy

Zero analytics, no external requests, GDPR compliant. All data stays in your browser.

## 📄 License

MIT License

---
*A privacy-focused financial tracker built with React + TypeScript*
