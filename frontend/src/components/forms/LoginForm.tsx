import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { decodeJwt } from "../../utils/auth";
import EyeIcon from "../../icons/eye.svg?react";
import EyeIconSlash from "../../icons/eye-slash.svg?react";

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
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "https://petshop-db4w.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);
      
      const payload = decodeJwt(data.token);
      console.log("Payload JWT:", payload);

      if (payload && payload.userName) {
        localStorage.setItem("username", payload.userName);
      }

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
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
          />
          <ErrorMessage
            name="email"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-[16px] font-semibold leading-[19.2px] text-[#042D95] font-albert"
            >
              Contraseña
            </label>
            <a
              href="#"
              className="text-[#5685FA] font-['Albert Sans'] text-[16px] font-normal leading-[120%]"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <Field
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              data-test="password"
              placeholder="Placeholder"
              className="mt-1 mb-2 block w-full rounded-[6px] border border-[#CBD5E1] bg-white px-4 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
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
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {submitError && (
          <div className="text-red-500 text-sm text-center">{submitError}</div>
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
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        <p className="text-[#5685FA] font-['Albert Sans'] text-[16px] font-normal leading-[120%] text-center">
          ¿Primera vez aquí?{" "}
          <a
            href="#"
            className="ml-1 border-b border-[#5685FA] text-[#5685FA] font-['Albert Sans'] text-[16px] font-semibold leading-[120%] hover:border-b-2"
          >Regístrate</a>
        </p>
      </Form>
    </Formik>
  );
};

export default LoginForm;
