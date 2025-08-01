import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Correo electrónico inválido")
        .required("El correo es obligatorio"),
    password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(16, "La contraseña no debe superar los 16 caracteres")
        .required("La contraseña es obligatoria"),
});

const LoginForm = () => {
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (
        values: { email: string; password: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setLoading(true);
        setSubmitError('');

        try {
            const response = await fetch('https://petshop-db4w.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            localStorage.setItem('token', data.token);
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
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico
                    </label>
                    <Field
                        name="email"
                        type="email"
                        id="email"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
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
                        id="password"
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {submitError && (
                    <div className="text-red-500 text-sm text-center">{submitError}</div>
                )}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>

                <p className="text-center text-sm text-gray-500">
                    ¿No tienes cuenta? <a href="/register" className="text-indigo-600 hover:underline">Regístrate</a>
                </p>
            </Form>
        </Formik>
    )
}

export default LoginForm;