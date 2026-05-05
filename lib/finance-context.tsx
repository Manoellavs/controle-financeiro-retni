'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Transaction, TransactionType, Account } from '@/lib/types'

// Dados mockados iniciais
const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposito',
    amount: 4850,
    date: '2025-05-01',
    description: 'Salario ref. abril/2025',
  },
  {
    id: '2',
    type: 'pagamento',
    amount: 189.90,
    date: '2025-05-02',
    description: 'CPFL Energia',
  },
  {
    id: '3',
    type: 'transferencia',
    amount: 350,
    date: '2025-05-03',
    description: 'PIX para Maria',
  },
  {
    id: '4',
    type: 'saque',
    amount: 200,
    date: '2025-05-04',
    description: 'Saque 24h Bradesco',
  },
  {
    id: '5',
    type: 'pagamento',
    amount: 79.90,
    date: '2025-05-05',
    description: 'Netflix + Spotify',
  },
  {
    id: '6',
    type: 'deposito',
    amount: 800,
    date: '2025-05-05',
    description: 'Freelance - site institucional',
  },
]

// Calcular saldo inicial
const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, t) => {
    if (t.type === 'deposito') {
      return acc + t.amount
    }
    return acc - t.amount
  }, 0)
}

interface FinanceContextType {
  account: Account
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  getTransaction: (id: string) => Transaction | undefined
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const balance = calculateBalance(transactions)

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  const editTransaction = useCallback((id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...transaction, id } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTransaction = useCallback(
    (id: string) => {
      return transactions.find((t) => t.id === id)
    },
    [transactions]
  )

  const account: Account = {
    balance,
    transactions,
  }

  return (
    <FinanceContext.Provider
      value={{
        account,
        addTransaction,
        editTransaction,
        deleteTransaction,
        getTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider')
  }
  return context
}
