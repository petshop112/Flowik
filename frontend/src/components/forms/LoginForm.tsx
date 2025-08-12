import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { decodeJwt } from "../../utils/auth";
// import { ReactComponent as EyeIcon } from "./eye.svg";
// import { ReactComponent as EyeSlashIcon } from "./eye-slash.svg";

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
        "https://petshop-db4w.onrender.com/auth/login",
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

      // grab the username from the token decodification 
      // and saving it into the local storage
      
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
      <Form className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-[16px] font-semibold leading-[19.2px] text-[#042D95] font-albert"
          >
            Correo electrónico
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
          <label
            htmlFor="password"
            className="block text-[16px] font-semibold leading-[19.2px] text-[#042D95] font-albert"
          >
            Contraseña
          </label>
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
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {/* {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )} */}
            </button>
          </div>
          <ErrorMessage
            name="password"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
          <a
            href="#"
            className="text-[#5685FA] font-['Albert_Sans'] text-[16px] font-normal leading-[19.2px] cursor-pointer hover:underline"
          >
            ¿Has olvidado tu contraseña?
          </a>
        </div>

        {submitError && (
          <div className="text-red-500 text-sm text-center">{submitError}</div>
        )}

        <button
          type="submit"
          className="flex w-[479px] h-12 px-6 py-3 justify-center items-center gap-2 
             rounded-[6px] border border-[#9CB7FC] 
             bg-[#F1F9FE] text-[#9CB7FC] font-[400] text-[16px] leading-[120%] 
             font-['Albert Sans'] transition duration-300"
          disabled={loading}
          data-test="login-button"
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
