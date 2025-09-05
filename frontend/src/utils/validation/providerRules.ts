import { isEmpty, onlyLettersAndSpaces, lengthBetween } from './validatorForm';

export type Form = {
  name_provider: string;
  cuit_provider: string;
  direction_provider: string;
  telephone_provider: string;
  email_provider: string;
  category_provider: string;
};

export type Errors = Partial<Record<keyof Form, string>> & { server?: string };

export function validateField(name: keyof Errors, form: Form, errors: Errors): Errors {
  const next = { ...errors };
  let error = '';

  switch (name) {
    case 'name_provider': {
      const v = form.name_provider.trim();
      if (isEmpty(v)) error = 'El nombre de empresa es obligatorio.';
      else if (!onlyLettersAndSpaces(v))
        error = 'El nombre de la empresa debe contener solo letras y espacios.';
      else if (!lengthBetween(v, 2, 50))
        error = 'El nombre de la empresa debe tener entre 2 y 50 caracteres.';
      break;
    }
    case 'cuit_provider': {
      const v = form.cuit_provider.trim();
      if (isEmpty(v)) error = 'El CUIT es obligatorio.';
      else if (!/^[0-9]{11}$/.test(v)) error = 'El CUIT debe tener exactamente 11 dígitos.';
      break;
    }
    case 'direction_provider': {
      const v = form.direction_provider.trim();
      if (v.length > 0) {
        if (!lengthBetween(v, 10, 100)) {
          error = 'La dirección debe tener entre 10 y 100 caracteres.';
        } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ,.\-#/º]+$|^$/.test(v)) {
          error = 'La dirección contiene caracteres no permitidos.';
        }
      }
      break;
    }

    case 'telephone_provider': {
      const v = form.telephone_provider.trim();
      if (isEmpty(v)) error = 'El teléfono es obligatorio.';
      else if (!/^[0-9]{7,20}$/.test(v)) error = 'El teléfono debe tener entre 7 y 20 dígitos.';
      break;
    }
    case 'email_provider': {
      const email = form.email_provider.trim();
      if (isEmpty(email)) error = 'El correo es obligatorio.';
      else if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(
          email
        )
      ) {
        error = 'Correo inválido.';
      }
      break;
    }
    case 'category_provider': {
      const v = form.category_provider.trim();
      if (isEmpty(v)) error = 'La categoría es obligatoria.';
      else if (!lengthBetween(v, 3, 300))
        error = 'La categoría debe tener entre 3 y 300 caracteres.';
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
