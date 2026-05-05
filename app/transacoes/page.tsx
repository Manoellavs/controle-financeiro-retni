import { TransactionList } from "@/components/transaction-list";

export default function TransacoesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Extrato completo</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Todas as suas movimentacoes em um so lugar
        </p>
      </div>

      <TransactionList />
    </div>
  );
}
