import {
  isEmpty,
  onlyLettersAndSpaces,
  isEmail,
  digitsBetween,
  lengthBetween,
} from './validatorForm';

export type Form = {
  firstName: string;
  lastName: string;
  telephone_client: string;
  email_client: string;
  document_type?: string;
  direction_client?: string;
};
export type Errors = Partial<Record<keyof Form, string>>;

export function validateField(name: keyof Errors, form: Form, errors: Errors): Errors {
  const next = { ...errors };
  let error = '';
  switch (name) {
    case 'firstName': {
      const v = form.firstName.trim();
      if (isEmpty(v)) error = 'El nombre es obligatorio.';
      else if (!onlyLettersAndSpaces(v)) error = 'Solo letras y espacios.';
      break;
    }
    case 'lastName': {
      const v = form.lastName.trim();
      if (isEmpty(v)) error = 'Los apellidos son obligatorios.';
      else if (!onlyLettersAndSpaces(v)) error = 'Solo letras y espacios.';
      break;
    }
    case 'telephone_client': {
      const tel = form.telephone_client.trim();
      if (!digitsBetween(tel, 6, 15)) error = 'Entre 6 y 15 dígitos.';
      break;
    }
    case 'email_client': {
      const email = form.email_client.trim();
      if (!isEmail(email)) error = 'Correo inválido.';
      break;
    }
    case 'document_type': {
      const v = (form.document_type || '').trim();
      if (v.length > 0 && !digitsBetween(v, 7, 11)) error = 'Entre 7 y 11 números.';
      break;
    }
    case 'direction_client': {
      const v = (form.direction_client || '').trim();
      if (v.length > 0 && !lengthBetween(v, 10, 100)) error = 'Entre 10 y 100 caracteres.';
      break;
    }
    default:
      break;
  }
  if (error) next[name] = error;
  else delete next[name];
  return next;
}

export function validateAll(form: Form): Errors {
  const errs: Errors = {};
  (Object.keys(form) as (keyof Form)[]).forEach((k) => {
    Object.assign(errs, validateField(k, form, errs));
  });
  return errs;
}
