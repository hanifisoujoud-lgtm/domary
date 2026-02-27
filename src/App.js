import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import GLightbox from 'glightbox';
import 'aos/dist/aos.css';
import 'glightbox/dist/css/glightbox.css';

// Import Components (Header and Footer)
import Header from './components/Header';
import Footer from './components/Footer';

// Import Pages (The converted HTML pages)
import Home from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import BlogDetails from './components/BlogDetails';
import Contact from './components/Contact';
import AdminPage from './components/Admin.jsx';
import Heavy from './components/heavy.jsx';
import Farmland from './components/farmland.jsx';
import Fertilizer from './components/fertilizers.jsx';
import Accessorie from './components/accessories.jsx';
import AuthForm from './components/Auth.jsx';
import Productpage from './components/Productpage.jsx';
import Reservation from './components/Reservation.jsx';
import Adduserproduct from './components/Adduserproduct.jsx';
import Adminblog from './components/adminbolg.jsx';
import Recalamtionadmin from './components/reclamtionadmin.jsx';

function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

// This component handles the rendering and side effects within the Router context
const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, mirror: false });
    GLightbox({ selector: '.glightbox' });
    window.scrollTo(0, 0);
    AOS.refresh();
  }, [location.pathname]);

return (
  <Routes>
    {/* Auth Page without Header/Footer */}
    <Route path='/' element={<AuthForm />} />
        <Route path="/products/:category" element={ <Productpage /> } />

    {/* Pages with Header/Footer */}
    <Route path="/home" element={<DefaultLayout><Home /></DefaultLayout>} />
    <Route path="/about" element={<DefaultLayout><About /></DefaultLayout>} />
    <Route path="/blog" element={<DefaultLayout><Blog /></DefaultLayout>} />
    <Route path="/blog-details" element={<DefaultLayout><BlogDetails /></DefaultLayout>} />
    <Route path="/contact" element={<DefaultLayout><Contact /></DefaultLayout>} />
    <Route path="/heavy" element={<DefaultLayout><Heavy/></DefaultLayout>} />
    <Route path="/farmland" element={<DefaultLayout><Farmland/></DefaultLayout>} />
    <Route path="/fertilizers" element={<DefaultLayout><Fertilizer/></DefaultLayout>}/>
    <Route path="/accessories" element={<DefaultLayout><Accessorie/></DefaultLayout>}/>
    <Route path='addproduct' element={<DefaultLayout><Adduserproduct/></DefaultLayout>}/>


    {/* Admin sans Header/Footer */}
    <Route path='/admin' element={<AdminPage/>}/>
    <Route path='/reservation' element={<Reservation/>}/>
    <Route path='/adminblogs' element={<Adminblog/>}/>   
    <Route path='/reclamation' element={<Recalamtionadmin/>}/>  
  </Routes>
);
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
