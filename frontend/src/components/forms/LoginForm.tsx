import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://petshop-db4w.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Manejo de errores del backend
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Guardo el token en localStorage o en Redux Toolkit
            localStorage.setItem('token', data.token); // si el backend devuelve `token`

            // Redirigir al usuario o actualizar el estado global
            console.log('Login exitoso:', data);

            navigate('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center">
                    {error}
                </div>
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
        </form>
    )
}

export default LoginForm;