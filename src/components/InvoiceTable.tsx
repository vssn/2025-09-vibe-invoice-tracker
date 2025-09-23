import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { InvoiceItem } from '../types/invoice'
import { formatCurrency, formatDate } from '@/utils/format'

interface InvoiceTableProps {
  items: InvoiceItem[]
  onDeleteItem: (id: number) => void
}

export function InvoiceTable({ items, onDeleteItem }: InvoiceTableProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm mb-6">
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
                  onClick={() => onDeleteItem(item.id)}
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
  )
}