const DeleteProductModal = () => {
  return (
    <article
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4`}
    >
      <article className="border-warning-crimson relative flex w-full max-w-md flex-col items-center overflow-y-auto rounded-lg border bg-white pt-14 pb-4 shadow-2xl">
        <main className="w-full text-center">
          <article className="mx-auto mb-2 flex h-6 w-6 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-warning-crimson size-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                clipRule="evenodd"
              />
            </svg>
          </article>
          <h2 className="text-lg font-semibold text-gray-900">¿Quieres eliminar el producto X?</h2>
          <p className="px-6 text-gray-500">
            Vas a eliminar el "Producto X". Esta acción es permanente y no podrás deshacerla.
          </p>
        </main>
        <footer className="mt-6 flex justify-center space-x-3 [&>button]:cursor-pointer [&>button]:px-12 [&>button]:py-[6px] [&>button]:transition-colors">
          <button
            type="button"
            className="text-warning-crimson border-warning-crimson hover:bg-warning-crimson rounded-sm border transition-colors hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-warning-crimson rounded-sm text-white transition-colors hover:bg-red-700"
          >
            Eliminar
          </button>
        </footer>
      </article>
    </article>
  );
};

export default DeleteProductModal;
