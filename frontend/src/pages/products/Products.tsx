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

export default Products;
