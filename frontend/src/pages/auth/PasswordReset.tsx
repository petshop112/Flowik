import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen">
            {/* Columna izquierda */}
            <div className="flex flex-col justify-center items-center w-1/2 bg-[#FAFBFC] px-12 gap-y-3">
                <h1 className="text-[var(--GreyScale-800,#333333)] text-center text-[31px] font-semibold leading-[120%] font-['Albert Sans']">
                    Contraseña restablecida correctamente
                </h1>

                <div className="w-120">
                    <button
                        onClick={() => navigate("/login")}
                        className="flex w-full h-12 px-6 py-3 justify-center items-center gap-2 
                            rounded-[6px] 
                            bg-[#5685FA] text-white font-normal text-[16px] leading-[120%] font-['Albert Sans'] 
                            transition duration-300 hover:bg-[#4170e8] disabled:opacity-50 mt-12" data-test="verify-email-button"
                    >
                        Volver al inicio
                    </button>
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

export default PasswordReset;
