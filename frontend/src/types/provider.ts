export type ProviderFormValues = {
  name_provider: string;
  cuit_provider: string;
  direction_provider: string;
  telephone_provider: string;
  email_provider: string;
  category_provider: string;
};

export type Provider = ProviderFormValues & {
  id_provider: number;
  isActive?: boolean;
};
