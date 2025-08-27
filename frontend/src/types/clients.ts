export type ClientFormValues = {
  name_client: string;
  document_type: string;
  telephone_client: string;
  direction_client: string;
  email_client: string;
};

// si tu API devuelve todos los campos + id, usa este para listar/mostrar
// & interseccion
export type Client = ClientFormValues & {
  id_client: number;
  isActive?: boolean;
};
