import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyNavbar from './Components/Navbar/Navbar';
import UserLogin from './Pages/UserLogin/UserLogin';
import Home from './Pages/Home/Home';
import InputForm from './Pages/Form/Form';
import List from './Pages/List/List';
import UpdateModal from './Pages/UpdateModal/UpdateModal';
import Error from './Pages/Error/Error';
import PrivateRoutes from './Components/PrivateRoute/PrivateRoute';
import UserProvider from './Components/UserContext/UserProvider';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <UserProvider>
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/form" element={<PrivateRoutes element={InputForm} />} />
          <Route path="/list" element={<PrivateRoutes element={List} />} />
          <Route path="/list/:id" element={<PrivateRoutes element={UpdateModal} />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
      </UserProvider>
    </div>
  );
}

export default App;
