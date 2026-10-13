import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Salon from './pages/Salon.jsx';
import Programme from './pages/Programme.jsx';
import Equipe from './pages/Equipe.jsx';
import Exposants from './pages/Exposants.jsx';
import Partenaires from './pages/Partenaires.jsx';
import Inscription from './pages/Inscription.jsx';
import Contact from './pages/Contact.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import NotFound from './pages/NotFound.jsx';

// Le back-office est chargé à part : les visiteurs ne téléchargent pas son code.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="le-salon" element={<Salon />} />
        <Route path="programme" element={<Programme />} />
        <Route path="equipe" element={<Equipe />} />
        <Route path="exposants" element={<Exposants />} />
        <Route path="partenaires" element={<Partenaires />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="contact" element={<Contact />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin/login"
        element={
          <Suspense fallback={null}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="admin/*"
        element={
          <Suspense fallback={null}>
            <AdminDashboard />
          </Suspense>
        }
      />
    </Routes>
  );
}
