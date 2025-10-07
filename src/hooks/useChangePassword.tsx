import { useState } from 'react';

export const useChangePassword = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    // Có thể thêm logic khác ở đây nếu cần
    console.log('Password changed successfully');
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleSuccess
  };
};