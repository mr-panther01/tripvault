// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Header from './components/Header'; // You'll create this
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import NewTrip from './pages/NewTrip';
// import EditTrip from './pages/EditTrip';
// import PrivateRoute from './components/PrivateRoute'; // You'll create this

// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <main className="">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
          
//           {/* Protected Routes */}
//           <Route path="" element={<PrivateRoute />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/trip/new" element={<NewTrip />} />
//             <Route path="/trip/edit/:id" element={<EditTrip />} />
//           </Route>
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }
// export default App;

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTrip from './pages/NewTrip';
import EditTrip from './pages/EditTrip';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation(); 

  return (
    <>
      <Header />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          // REMOVED: className="container mx-auto p-4"
          // This allows your page components to control their own layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trip/new" element={<NewTrip />} />
              <Route path="/trip/edit/:id" element={<EditTrip />} />
              <Route index element={<Dashboard />} /> 
            </Route>
          </Routes>
        </motion.main>
      </AnimatePresence>
    </>
  );
}

export default App;