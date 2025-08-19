import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import EyeIcon from '../../icons/eye.svg?react';
import EyeIconSlash from '../../icons/eye-slash.svg?react';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { registerUser, selectAuth } from '../../features/auth/authSlice';
import type { FormikHelpers } from 'formik';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe superar los 50 caracteres')
    .required('El nombre es obligatorio'),
  lastName: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no debe superar los 50 caracteres')
    .required('El apellido es obligatorio'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'El formato del email no es válido'
    )
    .test(
      'valid-domain',
      'Solo se permiten emails de dominios conocidos (Gmail, Yahoo, Outlook, etc.)',
      function (value) {
        if (!value) return false;
        const domain = value.split('@')[1];
        if (!domain) return false;

        const validDomains = [
          'gmail.com',
          'yahoo.com',
          'hotmail.com',
          'outlook.com',
          'live.com',
          'icloud.com',
          'yahoo.es',
          'hotmail.es',
          'outlook.es',
          'protonmail.com',
          'zoho.com',
          'aol.com',
          'yandex.com',
          'mail.com',
        ];

        return validDomains.includes(domain.toLowerCase());
      }
    )
    .required('El correo es obligatorio'),
  password: Yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(16, 'La contraseña no debe superar los 16 caracteres')
    .matches(/\d/, 'Contener 1 numeral')
    .matches(/^[A-Z]/, 'Primera letra en mayúscula')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('La confirmación de contraseña es obligatoria'),
});

const RegisterForm = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector(selectAuth);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleSubmit = async (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      role: 'USER';
    },
    {
      setSubmitting,
    }: FormikHelpers<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      role: 'USER';
    }>
  ) => {
    const result = await dispatch(registerUser(values));

    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }

    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'USER',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-8">
          <div>
            <label
              htmlFor="firstName"
              className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
            >
              Nombre
            </label>
            <Field
              name="firstName"
              type="text"
              data-test="username"
              className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Gonzalo"
            />
            <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
            >
              Apellido
            </label>
            <Field
              name="lastName"
              type="text"
              data-test="lastname"
              className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Ej.: López López"
            />
            <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div>
            <label
              htmlFor="email"
              className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
            >
              Email*
            </label>
            <Field
              name="email"
              type="email"
              data-test="email"
              className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="nombre@email.com"
            />
            <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
            >
              Contraseña*
            </label>
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                data-test="password"
                className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center bg-transparent p-0 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeIconSlash className="h-5 w-5 stroke-current text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 stroke-current text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
            >
              Confirmar contraseña*
            </label>
            <div className="relative">
              <Field
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                data-test="confirmPassword"
                className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Confirma contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center bg-transparent p-0 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeIconSlash className="h-5 w-5 stroke-current text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 stroke-current text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {error && <div className="text-center text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            className="font-['Albert Sans'] mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#5685FA] px-6 py-3 text-[16px] leading-[120%] font-normal text-white transition duration-300 hover:bg-[#4170e8] disabled:opacity-50"
            disabled={loading}
            data-test="register-button"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <p className="font-['Albert Sans'] text-center text-[16px] leading-[120%] font-normal text-[#5685FA]">
            ¿Ya usas Flowik?{' '}
            <a
              href="/login"
              className="font-['Albert Sans'] ml-1 border-b border-[#5685FA] text-[16px] leading-[120%] font-semibold text-[#5685FA] hover:border-b-2"
            >
              Inicia sesión
            </a>
          </p>
        </Form>
      </Formik>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              ¡Registro Exitoso!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleCloseModal} className="w-full bg-green-600 hover:bg-green-700">
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterForm;
