import { Link} from "react-router-dom";
import {useLoggedIn} from '../context/Context';
import { Dropdown } from 'react-bootstrap';
import logo from "../css/images/logo.png";
// import UnAuthUser from '../components/UnAuthUser';
/**
 * Navbar component renders the navigation bar for the application.
 *
 * The navigation bar includes links to the Home, Contact Us, and Login pages.
 * It is responsive and collapses into a toggleable menu on smaller screens.
 *
 * @component
 * @example
 * return (
 *   <Navbar />
 * )
 */
function Navbar() {
    const { isLoggedIn,setIsLoggedIn,name} = useLoggedIn();
  return (
    <header>
         <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand" to="/"> <img src={logo} alt="logo" className="logo" /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-lg-0">
                        {!isLoggedIn ?  (
                        <li className="nav-item">
                            <Link className="cta-btn desktop"  to="/login">Login</Link>
                            <Link className="nav-link mobile"  to="/login"><i className="bi bi-person fs-4"></i> Login</Link>
                        </li>) :
                        <Dropdown>
                        <Dropdown.Toggle as={Link} to="#" className="nav-link dropdown-toggle" role="button"><i className="bi bi-person-circle fs-4 me-2"></i>{name}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/admin/profile">My Profile</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/admin/booking">My Bookings</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/admin/venues">My Venues</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setIsLoggedIn(false)}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                     }
                    </ul>
                    </div>
                </div>
            </nav>
    </header>
  );
}
export default Navbar;
