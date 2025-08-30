import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { recoverPassword, selectAuth } from '../../features/auth/authSlice';
import type { FormikHelpers } from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Correo electrónico inválido').required('El correo es obligatorio'),
});

const RecoverPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector(selectAuth);

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting }: FormikHelpers<{ email: string }>
  ) => {
    const result = await dispatch(recoverPassword(values));

    if (recoverPassword.fulfilled.match(result)) {
      navigate('/verify-email', { state: { email: values.email } });
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ email: '' }}
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
              data-test="email"
              placeholder="Hello@correo.com"
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

          {error && (
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-red-500">
              <ExclamationCircleIcon className="h-4.5 w-4.5" strokeWidth={2.5} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="font-['Albert Sans'] mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#5685FA] px-6 py-3 text-[16px] leading-[120%] font-normal text-white transition duration-300 hover:bg-[#4170e8] disabled:opacity-50"
            disabled={loading}
            data-test="login-button"
          >
            {loading ? 'Cargando...' : 'Continuar'}
          </button>

          <div className="text-center">
            <a
              href="/login"
              className="font-['Albert Sans'] ml-1 border-b border-[#5685FA] text-[16px] leading-[120%] font-semibold text-[#5685FA] hover:border-b-2"
            >
              Regresar a Iniciar sesión
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RecoverPasswordForm;
