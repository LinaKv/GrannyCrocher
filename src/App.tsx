import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { ConstructorPage } from './pages/constructor/ConstructorPage';
import { CrochingPage } from './pages/croching/CrochingPage';
import { KnitSquarePage } from './pages/croching/KnitSquarePage';
import { CardiganPage } from './pages/cardigan/CardiganPage';

export default function App() {
  return (
    <BrowserRouter basename="/GrannyCrocher">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ConstructorPage />} />
          <Route path="croching" element={<CrochingPage />} />
          <Route path="croching/:id" element={<KnitSquarePage />} />
          <Route path="cardigan" element={<CardiganPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
