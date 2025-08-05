import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

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
        .test('valid-domain', 'Solo se permiten emails de dominios conocidos (Gmail, Yahoo, Outlook, etc.)', function (value) {
            if (!value) return false;
            const domain = value.split('@')[1];
            if (!domain) return false;

            const validDomains = [
                'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
                'live.com', 'icloud.com', 'yahoo.es', 'hotmail.es', 'outlook.es',
                'protonmail.com', 'zoho.com', 'aol.com', 'yandex.com', 'mail.com'
            ];

            return validDomains.includes(domain.toLowerCase());
        })
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
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigate = useNavigate();

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
        },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setSubmitError('');
        setLoading(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 30000);

            const response = await fetch('https://petshop-db4w.onrender.com/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            let data;
            try {
                data = await response.json();
            } catch {
                data = { message: `Error del servidor (${response.status}): ${response.statusText}` };
            }

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }

            setShowSuccessModal(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    setSubmitError('La petición tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente.');
                } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                    setSubmitError('Error de conexión. Verifica tu internet y que el servidor esté disponible.');
                } else if (err.message.includes('email') || err.message.toLowerCase().includes('correo')) {
                    setSubmitError('Este email ya está registrado o no es válido. Intenta con otro email.');
                } else if (err.message.includes('400')) {
                    setSubmitError('Los datos ingresados no son válidos. Verifica la información.');
                } else if (err.message.includes('500')) {
                    setSubmitError('Error interno del servidor. Intenta nuevamente en unos minutos.');
                } else {
                    setSubmitError(err.message);
                }
            } else {
                setSubmitError('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
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
                            data-test="username"
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
                            data-test="lastname"
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
                            data-test="email"
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
                            data-test="password"
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
                            data-test="confirmpassword"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {submitError && <div className="text-red-500 text-sm text-center">{submitError}</div>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-300"
                        disabled={loading}
                        data-test="register-button"
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta? <a href="/login" className="text-indigo-600 hover:underline">Inicia sesión</a>
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
                        <Button
                            onClick={handleCloseModal}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            Continuar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RegisterForm;