import { useState } from "react";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí va la lógica de autenticación
        console.log({ email, password });
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email-login"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password-login"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-300"
            >
                Iniciar sesión
            </button>

            <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta? <a href="/register" className="text-indigo-600 hover:underline">Regístrate</a>
            </p>
        </form>
    )
}

export default LoginForm;