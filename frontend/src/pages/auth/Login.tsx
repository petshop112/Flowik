import LoginForm from '../../components/forms/LoginForm';

const Login = () => {
    return (
        <div className='flex justify-center items-center min-h-full'>
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Iniciar sesión</h2>
                <LoginForm />
            </div>
        </div>
    )
}

export default Login;