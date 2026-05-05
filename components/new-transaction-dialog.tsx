'use client'

import { useState } from 'react'
import { useFinance } from '@/lib/finance-context'
import { transactionTypeLabels } from '@/lib/transaction-utils'
import type { TransactionType } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'

interface NewTransactionDialogProps {
  trigger?: React.ReactNode
}

export function NewTransactionDialog({ trigger }: NewTransactionDialogProps) {
  const { addTransaction } = useFinance()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TransactionType>('deposito')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !description || !date) return

    addTransaction({
      type,
      amount: parseFloat(amount),
      description,
      date,
    })

    setType('deposito')
    setAmount('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Nova
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar movimentacao</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="type" className="text-sm">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(transactionTypeLabels) as TransactionType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {transactionTypeLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-sm">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm">Descricao</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Salario, Conta de luz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-sm">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
