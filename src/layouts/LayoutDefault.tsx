import { Outlet } from "react-router";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { usePageMeta } from "../hooks/usePageMeta";

const LayoutDefault = () => {
  usePageMeta();

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutDefault;
