import { INVENTORY_STATUS_ITEMS } from '../../constants/inventoryConstants';

export function InventoryLegend() {
  return (
    <footer className="text-dark-blue mt-4 flex flex-wrap gap-4 text-sm">
      {INVENTORY_STATUS_ITEMS.map(({ bg, label, range }) => (
        <article key={label} className="flex items-center gap-2">
          <div className={`h-5 w-5 ${bg} rounded-full`}></div>
          <aside className="leading-none">
            <p className="font-semibold">{label}</p>
            <p>{range}</p>
          </aside>
        </article>
      ))}
    </footer>
  );
}
