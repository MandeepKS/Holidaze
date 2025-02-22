import './sass/styles.scss';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Venue from './pages/Venue';
import Login from './auth/Login';
import Register from './auth/Register';
import { Routes,Route} from "react-router-dom";
import Profile from './pages/admin/Profile';
import { AuthProvider } from "./context/Context";
import Booking from './pages/admin/Booking';
import ProfileVenues from './pages/admin/Venues';
import ProfileVenue from './pages/admin/Venue';
function App() {
  return (
    <div className="App">

      <main>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/venue/:id" element={<Venue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/booking" element={<Booking />} />
        <Route path="/admin/venues" element={<ProfileVenues />} />
        <Route path="/admin/venue/:id" element={<ProfileVenue />} />
      </Routes>
      </AuthProvider>
      </main>
    </div>
  );
}

export default App;
