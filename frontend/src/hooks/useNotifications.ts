import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../api/notificationService';
import type { NotificationType } from '../types/notification';

export const useNotifications = () =>
  useQuery<NotificationType[], Error>({
    queryKey: ['notifications'],
    queryFn: notificationService.getAllNotifications,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

export const useMarkReadNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
