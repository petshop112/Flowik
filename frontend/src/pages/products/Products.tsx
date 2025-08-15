// import useAuthToken from "../../hooks/useAuthToken";
// import { useProducts } from "../../hooks/useProducts";
// import { ProductModal } from "../../components/modal/ProductModal";
// import { DeleteProductConfirmationModal } from "../../components/modal/DeleteProductConfirmationModal";

import ProductsTable from "../../components/ui/ProductsTable";

function Products() {
  return (
    <section className="h-full w-full">
      <nav className="h-18">Navbar</nav>
      <main className="flex justify-between">
        <aside className="w-64">Sidebar</aside>
        <ProductsTable />
      </main>
    </section>
  );
}
// function Products() {
//   const token = useAuthToken();
//   const {
//     productList,
//     showModal,
//     editingProduct,
//     formData,
//     fetchLoading,
//     fetchError,
//     actionLoading,
//     actionError,
//     showDeleteModal,
//     openModal,
//     closeModal,
//     handleSubmit,
//     openDeleteModal,
//     closeDeleteModal,
//     handleDelete,
//     handleInputChange,
//   } = useProducts(token);

//   if (fetchLoading) {
//     return <p className="text-white p-4">Cargando productos...</p>;
//   }

//   if (fetchError) {
//     return <p className="text-red-500 p-4">Error: {fetchError}</p>;
//   }

//   return (
//     <section className="p-6 bg-gray-900 min-h-screen">
//       <article className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-xl md:text-3xl font-bold text-white">
//             Gestión de Productos
//           </h1>
//           <button
//             onClick={() => openModal()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             Agregar Producto
//           </button>
//         </header>

//         {actionError && (
//           <article className="bg-red-500 text-white p-3 rounded-lg mb-4">
//             {actionError}
//           </article>
//         )}

//         <main className="bg-gray-800 rounded-lg overflow-hidden shadow-lg overflow-x-auto">
//           <table className="w-full min-w-lg">
//             <thead className="bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-white font-semibold">
//                   ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-white font-semibold">
//                   Nombre
//                 </th>
//                 <th className="px-6 py-3 text-left text-white font-semibold">
//                   Precio
//                 </th>
//                 <th className="px-6 py-3 text-left text-white font-semibold">
//                   Categoría
//                 </th>
//                 <th className="px-6 py-3 text-left text-white font-semibold">
//                   Acciones
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {productList && productList.length > 0 ? (
//                 productList.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="border-b border-gray-700 hover:bg-gray-750"
//                   >
//                     <td className="px-6 py-4 text-gray-300">{product.id}</td>
//                     <td className="px-6 py-4 text-white font-medium">
//                       {product.title}
//                     </td>
//                     <td className="px-6 py-4 text-green-400">
//                       ${product.price}
//                     </td>
//                     <td className="px-6 py-4 text-gray-300">
//                       {product.category}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => openModal(product)}
//                           className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                           disabled={actionLoading}
//                         >
//                           Editar
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(product.id)}
//                           className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                           disabled={actionLoading}
//                         >
//                           Eliminar
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="px-6 py-8 text-center text-gray-400"
//                   >
//                     No hay productos disponibles
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </main>
//       </article>

//       <ProductModal
//         showModal={showModal}
//         editingProduct={editingProduct}
//         formData={formData}
//         actionLoading={actionLoading}
//         closeModal={closeModal}
//         handleSubmit={handleSubmit}
//         handleInputChange={handleInputChange}
//       />

//       <DeleteProductConfirmationModal
//         showDeleteModal={showDeleteModal}
//         actionLoading={actionLoading}
//         closeDeleteModal={closeDeleteModal}
//         handleDelete={handleDelete}
//       />
//     </section>
//   );
// }

export default Products;
