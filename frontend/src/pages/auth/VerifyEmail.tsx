import { useNavigate, useLocation } from "react-router-dom";
import maskEmail from "../../utils/maskEmail";

const VerifiEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email;

    return (
        <div className="flex h-screen">
            
            <div className="flex flex-col justify-center items-center w-1/2 bg-[#FAFBFC] px-12 gap-y-3">
                <h1 className="text-[53px] text-[#333333] text-center font-semibold leading-[63.6px] font-['Albert_Sans']">
                    Verifica tu Email
                </h1>
                <p className="text-[#636060] text-[16px] font-albert font-semibold leading-[19.2px] mb-8">
                    {email
                        ? `HEMOS ENVIADO UN MAIL A "${maskEmail(email)}"`
                        : "HEMOS ENVIADO UN MAIL A TU CORREO ELECTRÓNICO"}
                </p>
                <div className="w-120">
                    <p className="mx-auto w-[428px] text-center text-[#666666] text-base font-normal leading-[120%] font-['Albert_Sans']">
                        Si no lo encuentras, revisa Spam o Promociones. El enlace vence en 15 minutos.
                    </p>

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

            
            <div className="w-[5px] h-150 mt-35 rounded-[10px] bg-[#7FE8F2]"></div>

            
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

export default VerifiEmail;
