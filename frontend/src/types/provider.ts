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

export type ProviderFormData = Omit<
  Provider,
  'direction_provider' | 'telephone_provider' | 'provider_description'
>;
