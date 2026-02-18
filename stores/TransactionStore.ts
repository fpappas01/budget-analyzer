import { create } from "zustand";

type RowObj = {
  id: number;
  type: "income" | "expense";
  value: number;
  description: string;
  category_id: number;
  category_name: string;
  complete_date: string;
  month_year: string;
};

type TransactionsState = {
  transactions: RowObj[];
  setTransactions: (transactions: RowObj[]) => void;
  addTransaction: (transaction: RowObj) => void;
  updateTransaction: (transaction: RowObj) => void;
  deleteTransaction: (transaction_id: number) => void;
};




 export const useTransactionStore = create<TransactionsState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        transaction.id === tx.id ? transaction : transaction,
      ),
    })),
  deleteTransaction: (transaction_id) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== transaction_id),
    })),
}));
