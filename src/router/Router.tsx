import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/Home/Home";
import Privacy from "../pages/Privacy/Privacy";
import About from "../pages/About/About";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutDefault />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
