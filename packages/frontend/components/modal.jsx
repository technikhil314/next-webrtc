import { useState } from "react";

export default function Modal({ title, children, onClose = () => {} }) {
  const [isOpen, setIsOpen] = useState(true);
  const dialogProp = isOpen
    ? {
        open: isOpen,
      }
    : {};
  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };
  return (
    <section className="fixed inset-0 flex items-center w-screen h-screen">
      <div className="fixed inset-0 bg-black bg-opacity-25 filter blur-lg backdrop-filter backdrop-blur-lg"></div>
      <dialog
        {...dialogProp}
        className="relative w-10/12 pt-10 rounded-md shadow-xl md:w-1/4 bg"
      >
        <h3
          className="absolute top-0 w-10/12 py-4 text-lg font-semibold"
          title={title}
        >
          {title}
        </h3>
        <button onClick={closeModal} className="absolute right-3 top-3">
          &times;
        </button>
        <div className="mt-5">{children}</div>
      </dialog>
    </section>
  );
}
