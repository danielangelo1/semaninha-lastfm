import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/Home/Home";
import Privacy from "../pages/Privacy/Privacy";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutDefault />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
