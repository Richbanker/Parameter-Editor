import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Notification } from '../../types/models';

interface NotificationsProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onRemove }) => {
  React.useEffect(() => {
    notifications.forEach(notification => {
      toast[notification.type](notification.message, {
        toastId: notification.id,
        onClose: () => onRemove(notification.id),
      });
    });
  }, [notifications, onRemove]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}; 