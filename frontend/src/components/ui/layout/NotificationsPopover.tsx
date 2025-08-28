import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../button';
import { BellIcon } from '@heroicons/react/24/outline';

const notifications = [
  {
    date: 'Ayer',
    items: [
      {
        title: 'Gonzalo, 5 productos que posees están a punto de quedarse sin stock',
        bold: true,
      },
      {
        title: 'El cliente “x” lleva acumulado 35 días de deuda sin pagar. Revisar',
        bold: false,
      },
    ],
  },
  {
    date: 'Últimos 7 días',
    items: [
      {
        title: 'Gonzalo, 2 productos que posees están a punto de quedarse sin stock',
        bold: false,
      },
      {
        title: 'Gonzalo, 2 productos que posees están a punto de quedarse sin stock',
        bold: false,
      },
      {
        title: 'Gonzalo, 2 productos que posees están a punto de quedarse sin stock',
        bold: false,
      },
      {
        title: 'Gonzalo, 2 productos que posees están a punto de quedarse sin stock',
        bold: false,
      },
    ],
  },
];

export const NotificationsPopover = ({ count = 1 }: { count?: number }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="mr-6 bg-[#5685FA] px-3 py-1.5 text-white" variant="ghost">
          <BellIcon className="h-6 w-6" /> <span className="font-light">{count}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-100 w-88 overflow-y-scroll rounded-xl border-[#5685FA] bg-white p-4"
        align="end"
      >
        <div className="p-2">
          <p className="mb-1 text-lg font-semibold text-[#042D95]">Notificaciones</p>
          <p className="mb-4 text-xs text-gray-400">
            Las notificaciones se eliminarán automáticamente en 30 días.
          </p>
          <hr className="mb-2 border-gray-200" />
          {notifications.map((section) => (
            <div key={section.date} className="mb-2">
              <p
                className={`text-sm font-semibold text-[#042D95] ${section.date === 'Ayer' ? 'mt-0' : 'mt-4'}`}
              >
                {section.date}
              </p>
              {section.items.map((item, idx) => (
                <p
                  key={idx}
                  className={`text-sm ${item.bold ? 'font-bold' : 'font-normal text-gray-700'} mb-3 ml-3`}
                >
                  {item.title}
                </p>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
