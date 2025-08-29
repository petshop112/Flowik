import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkReadNotification } from '../../../hooks/useNotifications';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../button';
import { BellIcon } from '@heroicons/react/24/outline';
import type { NotificationType } from '../../../types/notification';

function getSectionLabel(notiDateStr: string) {
  const notiDate = new Date(notiDateStr);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - notiDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return 'Últimos 7 días';
  return notiDate.toLocaleDateString();
}

function groupNotificationsBySection(notifications: NotificationType[]) {
  const groups: { [section: string]: NotificationType[] } = {};
  notifications.forEach((noti) => {
    const label = getSectionLabel(noti.generationDate);
    if (!groups[label]) groups[label] = [];
    groups[label].push(noti);
  });
  return groups;
}

export const NotificationsPopover = () => {
  const navigate = useNavigate();

  const handleNotificationClick = (item: NotificationType) => {
    if (!item.read) markRead(item.id);
    if (item.type === 'STOCK') {
      navigate('/products');
    } else if (item.type === 'DEBT') {
      navigate('/clients');
    }
  };
  const { data, isLoading, error } = useNotifications();
  const { mutate: markRead } = useMarkReadNotification();

  const notifications = data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const grouped = groupNotificationsBySection(notifications);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="mr-6 bg-[#5685FA] px-3 py-1.5 text-white" variant="ghost">
          <BellIcon className="h-6 w-6" />
          <span className="font-light">{unreadCount}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-100 w-88 overflow-y-auto rounded-xl border-[#5685FA] bg-white p-4"
        align="end"
      >
        <div className="p-2">
          <p className="mb-1 text-lg font-semibold text-[#042D95]">Notificaciones</p>
          <p className="mb-4 text-xs text-[#B3B3B3]">
            Las notificaciones se eliminarán automáticamente en 30 días.
          </p>
          <hr className="mb-2 border-gray-200" />

          {isLoading && <p className="text-sm text-[#B3B3B3]">Cargando tus notificaciones...</p>}
          {error && (
            <p className="text-sm text-red-500">No se pudieron cargar tus notificaciones</p>
          )}
          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                width={80}
                height={80}
                alt="Sin notificaciones"
                className="rounded-full"
                style={{ objectFit: 'cover' }}
              />
              <span className="text-xs text-[#B3B3B3]">No tienes notificaciones nuevas</span>
            </div>
          )}

          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="mb-2">
              <p
                className={`text-sm font-semibold text-[#042D95] ${
                  section === 'Ayer' ? 'mt-0' : 'mt-4'
                }`}
              >
                {section}
              </p>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer items-center hover:bg-gray-50"
                  onClick={() =>
                    (item.type === 'STOCK' || item.type === 'DEBT') && handleNotificationClick(item)
                  }
                >
                  <p
                    className={
                      'mb-3 ml-3 text-sm ' +
                      (item.read ? 'font-normal text-[#999999]' : 'font-bold')
                    }
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
