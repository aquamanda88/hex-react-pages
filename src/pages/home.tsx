import Header from "../components/header";
import Modal from "../components/modal";

export default function Home() {

  return (
    <>
      <Header title="Components" />
      <div className="layout">
        <Modal/>
      </div>
    </>
  );
}
