'use client'

import { useState } from 'react'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency, formatDate, transactionTypeLabels, transactionTypeColors } from '@/lib/transaction-utils'
import type { Transaction, TransactionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EditTransactionDialog } from '@/components/edit-transaction-dialog'
import { NewTransactionDialog } from '@/components/new-transaction-dialog'
import { ArrowDownLeft, ArrowUpRight, Receipt, CreditCard, Pencil, Trash2, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const transactionIcons: Record<TransactionType, typeof ArrowDownLeft> = {
  deposito: ArrowDownLeft,
  transferencia: ArrowUpRight,
  pagamento: Receipt,
  saque: CreditCard,
}

export function TransactionList() {
  const { account, deleteTransaction } = useFinance()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null)
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = account.transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
    }
  }

  return (
    <>
      {/* Barra de acoes */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descricao..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(value) => setFilterType(value as TransactionType | 'all')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {(Object.keys(transactionTypeLabels) as TransactionType[]).map((key) => (
              <SelectItem key={key} value={key}>
                {transactionTypeLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <NewTransactionDialog
          trigger={
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova</span>
            </Button>
          }
        />
      </div>

      {/* Lista */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchTerm || filterType !== 'all' 
            ? 'Nenhuma movimentacao encontrada com esses filtros'
            : 'Nenhuma movimentacao registrada'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => {
            const Icon = transactionIcons[transaction.type]
            const colors = transactionTypeColors[transaction.type]
            const isDeposit = transaction.type === 'deposito'

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-md shrink-0 ${colors.bg}`}>
                    <Icon className={`h-4 w-4 ${colors.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {transactionTypeLabels[transaction.type]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <p className={`font-medium text-right ${isDeposit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewingTransaction(transaction)}
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span className="sr-only">Ver detalhes</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => setDeletingTransaction(transaction)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Contador */}
      {filteredTransactions.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-6">
          {filteredTransactions.length} {filteredTransactions.length === 1 ? 'registro' : 'registros'}
        </p>
      )}

      {/* Edit Dialog */}
      <EditTransactionDialog
        transaction={editingTransaction}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir movimentacao?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa acao vai remover permanentemente &quot;{deletingTransaction?.description}&quot; do seu extrato.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details */}
      <AlertDialog open={!!viewingTransaction} onOpenChange={(open) => !open && setViewingTransaction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Detalhes</AlertDialogTitle>
          </AlertDialogHeader>
          {viewingTransaction && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = transactionIcons[viewingTransaction.type]
                  const colors = transactionTypeColors[viewingTransaction.type]
                  return (
                    <div className={`p-2.5 rounded-md ${colors.bg}`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                  )
                })()}
                <div>
                  <p className="font-medium">{viewingTransaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transactionTypeLabels[viewingTransaction.type]}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Data</p>
                  <p className="text-sm">{formatDate(viewingTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Valor</p>
                  <p className={`text-sm font-medium ${viewingTransaction.type === 'deposito' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {viewingTransaction.type === 'deposito' ? '+' : '-'}{formatCurrency(viewingTransaction.amount)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
