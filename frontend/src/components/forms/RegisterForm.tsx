import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
        .required('El correo es obligatorio'),
    password: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(16, 'La contraseña no debe superar los 16 caracteres')
        .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('La confirmación de contraseña es obligatoria'),
});

const RegisterForm = () => {
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (
        values: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            confirmPassword: string;
        },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setSubmitError('');
        setSubmitSuccess('');
        setLoading(true);

        try {
            const response = await fetch('https://petshop-db4w.onrender.com/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar');
            }

            setSubmitSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return(
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className="space-y-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <Field
                        name="firstName"
                        type="text"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Apellido
                    </label>
                    <Field
                        name="lastName"
                        type="text"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico
                    </label>
                    <Field
                        name="email"
                        type="email"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <Field
                        name="password"
                        type="password"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar contraseña
                    </label>
                    <Field
                        name="confirmPassword"
                        type="password"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {submitError && <div className="text-red-500 text-sm text-center">{submitError}</div>}
                {submitSuccess && <div className="text-green-500 text-sm text-center">{submitSuccess}</div>}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                <p className="text-center text-sm text-gray-500">
                    ¿Ya tienes una cuenta? <a href="/login" className="text-indigo-600 hover:underline">Inicia sesión</a>
                </p>
            </Form>
        </Formik>
    )
}

export default RegisterForm;