import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { loginUser, selectAuth } from '../../features/auth/authSlice';
import type { FormikHelpers } from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import EyeIconSlash from '../../icons/eye-slash.svg?react';
import EyeIcon from '../../icons/eye.svg?react';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Correo electrónico inválido').required('El correo es obligatorio'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(16, 'La contraseña no debe superar los 16 caracteres')
    .matches(/\d/, 'Debe contener al menos un caracter numérico')
    .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .matches(/[!@#$%^&*(),.?":{}|<>_-]/, 'Debe contener al menos un caracter especial')
    .required('La contraseña es obligatoria'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector(selectAuth);

  const errorMessage =
    error === 'Failed to fetch'
      ? 'No se pudo realizar la conexión, por favor intente más tarde.'
      : error;

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: FormikHelpers<{ email: string; password: string }>
  ) => {
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
            >
              Email
            </label>
            <Field
              name="email"
              type="email"
              id="email"
              placeholder="example@gmail.com"
              data-test="email"
              className={`mt-1 block w-full rounded-[6px] border px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none ${
                errors.email && touched.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-[#CBD5E1] bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            <ErrorMessage
              name="email"
              render={(msg) => (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <ExclamationCircleIcon className="h-4.5 w-4.5" strokeWidth={2.5} />
                  <span>{msg}</span>
                </div>
              )}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-albert block text-[16px] leading-[19.2px] font-semibold text-[#042D95]"
              >
                Contraseña
              </label>
              <a
                href="/recover-password"
                className="font-['Albert Sans'] text-[16px] leading-[120%] font-normal text-[#5685FA]"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                data-test="password"
                placeholder="*********"
                className={`mt-1 block w-full rounded-[6px] border px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] outline-none ${
                  errors.password && touched.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-[#CBD5E1] bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                }`}
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
            <ErrorMessage
              name="password"
              render={(msg) => (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <ExclamationCircleIcon className="h-4.5 w-4.5" strokeWidth={2.5} />
                  <span>{msg}</span>
                </div>
              )}
            />
          </div>

          {errorMessage && (
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-red-500">
              <ExclamationCircleIcon className="h-4.5 w-4.5" strokeWidth={2.5} />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="font-['Albert Sans'] mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#5685FA] px-6 py-3 text-[16px] leading-[120%] font-normal text-white transition duration-300 hover:bg-[#4170e8] disabled:opacity-50"
            disabled={loading}
            data-test="login-button"
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>

          {/* <p className="font-['Albert Sans'] text-center text-[16px] leading-[120%] font-normal text-[#5685FA]">
            ¿Primera vez aquí?{' '}
            <a
              href="/register"
              className="font-['Albert Sans'] ml-1 border-b border-[#5685FA] text-[16px] leading-[120%] font-semibold text-[#5685FA] hover:border-b-2"
            >
              Regístrate
            </a>
          </p> */}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
