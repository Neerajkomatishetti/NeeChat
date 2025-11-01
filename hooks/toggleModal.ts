import { useState } from "react";

export const useToggleModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = (mode: boolean) => setOpenModal(mode);

  return { openModal, toggleModal };
};
