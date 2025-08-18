import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { recoverPassword, selectAuth } from "../../features/auth/authSlice";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Correo electrónico inválido")
        .required("El correo es obligatorio"),
});

const RecoverPasswordForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector(selectAuth);
    
    const handleSubmit = async (
        values: { email: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        const result = await dispatch(recoverPassword(values));
    
        if (recoverPassword.fulfilled.match(result)) {
            navigate("/verify-email", { state: { email: values.email } });
        }
    
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className="space-y-8">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-[16px] font-semibold leading-[19.2px] text-[#042D95] font-albert"
                    >
                        Email
                    </label>
                    <Field
                        name="email"
                        type="email"
                        id="email"
                        data-test="email"
                        className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        placeholder="Hello@correo.com"
                    />
                    <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
        
                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}
        
                <button
                    type="submit"
                    className="flex w-full h-12 px-6 py-3 justify-center items-center gap-2 
                     rounded-[6px] 
                     bg-[#5685FA] text-white font-normal text-[16px] leading-[120%] font-['Albert Sans'] 
                     transition duration-300 hover:bg-[#4170e8] disabled:opacity-50 mt-12"
                    disabled={loading}
                    data-test="login-button"
                >
                    {loading ? "Cargando..." : "Continuar"}
                </button>
                
                <div className="text-center">
                    <a
                        href="/login"
                        className="ml-1 border-b border-[#5685FA] text-[#5685FA] font-['Albert Sans'] text-[16px] font-semibold leading-[120%] hover:border-b-2"
                    >
                        Regresar a Iniciar sesión
                    </a>
                </div>
            </Form>
        </Formik>
    )
}

export default RecoverPasswordForm;
