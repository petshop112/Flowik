// hooks/useFormErrors.ts
import { useState, useCallback } from 'react';
import type { Form, Errors } from '../utils/validation/clientRules';
import { validateField } from '../utils/validation/clientRules';

export function useFormErrors(form: Form) {
  const [errors, setErrors] = useState<Errors>({});

  const validateOne = useCallback(
    (name: keyof Errors) => {
      setErrors((prev) => validateField(name, form, prev));
    },
    [form]
  );

  return { errors, setErrors, validateOne };
}
