import React from 'react';

export const handleBackdropClick = (
  e: React.MouseEvent<HTMLDivElement | HTMLElement>,
  onClose: () => void
) => {
  if (e.target == e.currentTarget) {
    onClose();
  }
};
