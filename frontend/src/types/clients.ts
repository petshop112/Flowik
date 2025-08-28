export type Payment = {
  id: number;
  paymentMount: number;
  datePayment: string;
};

export type Debt = {
  debt_date: string;
  mount: number;
  status: string;
  payments: Payment[];
};

export type ClientFormValues = {
  name_client: string;
  document_type: string;
  telephone_client: string;
  direction_client: string;
  email_client: string;
  notes: string;
};

export type Client = ClientFormValues & {
  id_client: number;
  isActive?: boolean;
  debts?: Debt[];
};
