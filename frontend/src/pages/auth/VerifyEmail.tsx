import { useNavigate, useLocation } from 'react-router-dom';
import maskEmail from '../../utils/maskEmail';

const VerifiEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 flex-col items-center justify-center gap-y-3 bg-[#FAFBFC] px-12">
        <h1 className="text-center font-['Albert_Sans'] text-[53px] leading-[63.6px] font-semibold text-[#333333]">
          Verifica tu Email
        </h1>
        <p className="font-albert mb-8 text-[16px] leading-[19.2px] font-semibold text-[#636060]">
          {email
            ? `HEMOS ENVIADO UN MAIL A "${maskEmail(email)}"`
            : 'HEMOS ENVIADO UN MAIL A TU CORREO ELECTRÓNICO'}
        </p>
        <div className="w-120">
          <p className="mx-auto w-[428px] text-center font-['Albert_Sans'] text-base leading-[120%] font-normal text-[#666666]">
            Si no lo encuentras, revisa Spam o Promociones. El enlace vence en 15 minutos.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="font-['Albert Sans'] mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#5685FA] px-6 py-3 text-[16px] leading-[120%] font-normal text-white transition duration-300 hover:bg-[#4170e8] disabled:opacity-50"
            data-test="verify-email-button"
          >
            Volver al inicio
          </button>
        </div>
      </div>

      <div className="mt-35 h-150 w-[5px] rounded-[10px] bg-[#7FE8F2]"></div>

      <div className="flex w-2/5 flex-col items-center justify-center gap-[113px] pt-[260px] pr-[117px] pb-[261px] pl-[116px]">
        <img src="/icons/logo_login.svg" alt="Flowik Logo" className="w-3/4" />
        <p className="font-albert text-center text-[24px] leading-[33.6px] text-black">
          Flowik es más que un nombre: es la promesa de que tu negocio puede operar con orden,
          velocidad y precisión... y que al final del día, todo fluya.
        </p>
      </div>
    </div>
  );
};

export default VerifiEmail;
