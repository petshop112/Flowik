export function DebtLegend() {
  return (
    <footer className="text-dark-blue mt-4 flex flex-wrap gap-4 text-sm">
      <span className="font-semibold">Estados deuda:</span>
      <article className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-rose-500"></div>
        <aside className="leading-none">
          <p className="font-semibold">Crítico</p>
          <p>+ 60 días</p>
        </aside>
      </article>
      <article className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-orange-400"></div>
        <aside className="leading-none">
          <p className="font-semibold">Atrasado</p>
          <p>30 - 60 días</p>
        </aside>
      </article>
      <article className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-teal-300"></div>
        <aside className="leading-none">
          <p className="font-semibold">Reciente</p>
          <p>&lt; 30 días</p>
        </aside>
      </article>
    </footer>
  );
}
