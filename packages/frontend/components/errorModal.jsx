import { useRouter } from "next/router";
import Modal from "../components/modal";
export default function ErrorModal(params) {
  const router = useRouter();
  const onModalClose = () => {
    router.push("/meeting");
  };
  return (
    <Modal title="Oops..." onClose={onModalClose}>
      <p>
        Opps.... Your browser does not support required features to record video. <br /> We recommend using latest
        version of chrome dekstop.
      </p>
    </Modal>
  );
}
