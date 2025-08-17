export interface Provider {
  id_provider: number;
  name_provider: string;
  direction_provider: string;
  telephone_provider: string;
  provider_description: string;
}

export type ProvidersResponse = Provider[];
