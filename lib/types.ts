export type TransactionType = 'deposito' | 'transferencia' | 'pagamento' | 'saque'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  description: string
}

export interface Account {
  balance: number
  transactions: Transaction[]
}
