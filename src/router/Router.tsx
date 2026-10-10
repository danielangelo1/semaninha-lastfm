import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const Home = lazy(() => import("../pages/Home/Home"));
const Privacy = lazy(() => import("../pages/Privacy/Privacy"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<LayoutDefault />}>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* <Route path="/wrapped" element={<Wrapped />} /> */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
