import LoginForm from '../../components/forms/LoginForm';

const Login = () => {
  return (
    <div className="flex h-screen">
      {/* Columna izquierda */}
      <div className="flex w-1/2 flex-col items-center justify-center gap-y-3 bg-[#FAFBFC] px-12">
        <h1 className="text-center font-['Albert_Sans'] text-[53px] leading-[63.6px] font-semibold text-[#333333]">
          Iniciar sesión
        </h1>
        <p className="font-albert mb-8 text-[16px] leading-[19.2px] font-semibold text-[#636060]">
          MENOS PLANTILLAS, MÁS CONTROL
        </p>
        <div className="w-120">
          <LoginForm />
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="mt-35 h-150 w-[5px] rounded-[10px] bg-[#7FE8F2]"></div>

      {/* Columna derecha */}
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

export default Login;
