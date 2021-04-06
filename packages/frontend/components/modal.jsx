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
    <section className="fixed inset-0 w-screen h-screen flex items-center">
      <div className="fixed inset-0 filter blur-lg backdrop-filter backdrop-blur-lg bg-black bg-opacity-25"></div>
      <dialog
        {...dialogProp}
        className="w-10/12 md:w-1/4 shadow-xl relative pt-10 rounded-md bg"
      >
        <h3
          className="w-10/12 text-lg font-semibold absolute py-4 top-0"
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
