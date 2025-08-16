import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { newPassword, selectAuth } from "../../features/auth/authSlice";
import EyeIcon from "../../icons/eye.svg?react";
import EyeIconSlash from "../../icons/eye-slash.svg?react";
import * as Yup from "yup";

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(8, 'Mínimo 8 caracteres')
        .max(16, 'La contraseña no debe superar los 16 caracteres')
        .matches(/\d/, 'Contener 1 numeral')
        .matches(/^[A-Z]/, 'Primera letra en mayúscula')
        .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden')
        .required('La confirmación de contraseña es obligatoria'),
});

const NewPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector(selectAuth);
    
    const handleSubmit = async (
        values: { token: string; newPassword: string; confirmPassword: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        const result = await dispatch(newPassword(values));
    
        if (newPassword.fulfilled.match(result)) {
            navigate("/passwordReset");
        }
    
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ token, newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className="space-y-8">
                <div>
                    <label htmlFor="newPassword" className="block text-[16px] font-semibold leading-[19.2px] text-[#042D95] font-albert">
                        Contraseña*
                    </label>
                    <div className="relative">
                        <Field
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            data-test="newPassword"
                            className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
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
                    <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                    <label htmlFor="confirmPassword" className="block text-[16px] font-semibold leading-[19.2px] text-[#042D95] font-albert">
                        Confirmar contraseña*
                    </label>
                    <div className="relative">
                        <Field
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            data-test="confirmPassword"
                            className="mt-1 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
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
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
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

export default NewPasswordForm;
