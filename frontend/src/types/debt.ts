export type DebtPayload = {
  mount: number;
};

export interface Payment {
  id: number;
  paymentMount: number;
  datePayment: string;
}

export interface Debt {
  debt_date: string;
  mount: number;
  payments: Payment[];
}
