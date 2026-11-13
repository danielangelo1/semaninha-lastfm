import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { PAGES } from "./pages";

const Home = PAGES["/"];
const Privacy = PAGES["/privacy"];
const Wrapped = PAGES["/wrapped"];
const HowToUse = PAGES["/how-to-use"];
const Support = PAGES["/support"];

// Shared by the browser router and the build-time prerender
export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<LayoutDefault />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/wrapped" element={<Wrapped />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Router;
