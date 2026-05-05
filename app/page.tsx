'use client'

import { useFinance } from '@/lib/finance-context'
import { formatCurrency, formatDate, transactionTypeLabels, transactionTypeColors } from '@/lib/transaction-utils'
import { NewTransactionDialog } from '@/components/new-transaction-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowDownLeft, ArrowUpRight, Receipt, CreditCard, TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { TransactionType } from '@/lib/types'

const transactionIcons: Record<TransactionType, typeof ArrowDownLeft> = {
  deposito: ArrowDownLeft,
  transferencia: ArrowUpRight,
  pagamento: Receipt,
  saque: CreditCard,
}

export default function HomePage() {
  const { account } = useFinance()
  const recentTransactions = account.transactions.slice(0, 4)
  
  const totalEntradas = account.transactions
    .filter(t => t.type === 'deposito')
    .reduce((acc, t) => acc + t.amount, 0)
  
  const totalSaidas = account.transactions
    .filter(t => t.type !== 'deposito')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Saudacao simples */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Ola, bem-vindo de volta</h1>
        <p className="text-muted-foreground text-sm mt-1">Aqui esta o resumo da sua conta</p>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Saldo atual</p>
            <p className={`text-2xl font-semibold ${account.balance >= 0 ? 'text-foreground' : 'text-rose-600'}`}>
              {formatCurrency(account.balance)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Entradas</p>
            </div>
            <p className="text-2xl font-semibold text-emerald-600">
              {formatCurrency(totalEntradas)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="h-3 w-3 text-rose-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Saidas</p>
            </div>
            <p className="text-2xl font-semibold text-rose-600">
              {formatCurrency(totalSaidas)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acao rapida */}
      <div className="mb-8">
        <NewTransactionDialog
          trigger={
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Nova transacao
            </Button>
          }
        />
      </div>

      {/* Ultimas transacoes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Movimentacoes recentes</h2>
          <Link href="/transacoes" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        {recentTransactions.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma movimentacao registrada ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => {
              const Icon = transactionIcons[transaction.type]
              const colors = transactionTypeColors[transaction.type]
              const isDeposit = transaction.type === 'deposito'

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${colors.bg}`}>
                      <Icon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transactionTypeLabels[transaction.type]} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p className={`font-medium ${isDeposit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
