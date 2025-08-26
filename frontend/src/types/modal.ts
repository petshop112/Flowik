export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  id?: number | string;
};
