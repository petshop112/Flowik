import LoginForm from '../../components/forms/LoginForm';

const Login = () => {
    return (
        <div className="flex h-screen">
            {/* Columna izquierda */}
            <div className="flex flex-col justify-center items-center w-1/2 bg-[#FAFBFC] px-12 gap-y-3">
                <h1 className="text-[53px] text-[#333333] text-center font-semibold leading-[63.6px] font-['Albert_Sans']">
                    Iniciar sesión
                </h1>
                <p className="text-[#636060] text-[16px] font-albert font-semibold leading-[19.2px] mb-8">
                    MENOS PLANTILLAS, MÁS CONTROL
                </p>
                <div className="w-120">
                    <LoginForm />
                </div>
            </div>

            {/* Línea divisoria */}
            <div className="w-[5px] h-150 mt-35 rounded-[10px] bg-[#7FE8F2]"></div>

            {/* Columna derecha */}
            <div className="flex flex-col justify-center items-center gap-[113px] pt-[260px] pr-[117px] pb-[261px] pl-[116px] w-1/2">
                <img src="/icons/logo_login.svg" alt="Flowik Logo" className="w-3/4" />
                <p className="text-black text-center font-albert text-[24px] font-normal leading-[33.6px]">
                    Flowik es más que un nombre: es la promesa de que tu negocio puede operar con orden,
                    velocidad y precisión... y que al final del día, todo fluya.
                </p>
            </div>
        </div>
    )
}

export default Login;