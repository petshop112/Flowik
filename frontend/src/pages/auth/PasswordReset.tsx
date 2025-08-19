import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Columna izquierda */}
      <div className="flex w-1/2 flex-col items-center justify-center gap-y-3 bg-[#FAFBFC] px-12">
        <h1 className="font-['Albert Sans'] text-center text-[31px] leading-[120%] font-semibold text-[var(--GreyScale-800,#333333)]">
          Contraseña restablecida correctamente
        </h1>

        <div className="w-120">
          <button
            onClick={() => navigate('/login')}
            className="font-['Albert Sans'] mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#5685FA] px-6 py-3 text-[16px] leading-[120%] font-normal text-white transition duration-300 hover:bg-[#4170e8] disabled:opacity-50"
            data-test="verify-email-button"
          >
            Volver al inicio
          </button>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="mt-35 h-150 w-[5px] rounded-[10px] bg-[#7FE8F2]"></div>

      {/* Columna derecha */}
      <div className="flex w-1/2 flex-col items-center justify-center gap-[113px] pt-[260px] pr-[117px] pb-[261px] pl-[116px]">
        <img src="/icons/logo_login.svg" alt="Flowik Logo" className="w-3/4" />
        <p className="font-albert text-center text-[24px] leading-[33.6px] font-normal text-black">
          Flowik es más que un nombre: es la promesa de que tu negocio puede operar con orden,
          velocidad y precisión... y que al final del día, todo fluya.
        </p>
      </div>
    </div>
  );
};

export default PasswordReset;
