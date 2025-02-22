import { Link ,useNavigate} from 'react-router-dom'
import myImage from '../css/images/travelmap.jpg'
import {useState} from 'react';
import  {useLoggedIn} from '../context/Context';
import apiEndpoints from '../api/endpoints';
function Login() {
    const navigate = useNavigate();
    const {
      setIsLoggedIn,
      setIsManager,
      setToken,
      setAvatar,
      setName,
      setEmail,
    } = useLoggedIn();
    const [formData, setFormData] = useState({
            email :'',
            password :'',
    });
    const [errors,setErrors] = useState({});
    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };
    const validate = () => {
        const validationErrors = {};
         // Email validation
         if (!formData.email) {
          validationErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          validationErrors.email = 'Enter a valid email address';
        }
        // Password validation
        if (!formData.password.trim()) {
            validationErrors.password = 'Password is required';
        }else if (formData.password.length < 8 ) {
          validationErrors.password = 'Minimum 8 characters required';
        }
        return validationErrors;
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
          try{
            const requestBody = {
              email: formData.email,
              password: formData.password,
          };

            const response = await fetch(apiEndpoints().login, {
              method: "POST",
              body: JSON.stringify(requestBody),
              headers: {
                "Content-Type": "application/json",
            },
            mode: "cors", // Allows cross-origin requests
          });
          console.log({response});

          if (!response.ok) {
            const errorResponse = await response.text(); // Read error message
            throw new Error(errorResponse);
          }
           // Reset form fields after successful submission
           const responseData = await response.json();
           setFormData({
            name: '',
            email: '',
            password: '',
          });
          setErrors({});
          console.log(" Login Response Status:", response.status);
      if (response.status === 200) {
          setIsLoggedIn(true);
          setIsManager(responseData.data.venueManager);
          setToken(responseData.data.accessToken);
          setAvatar(responseData.data.avatar);
          setName(responseData.data.name);
          setEmail(responseData.data.email);
          setTimeout(() => {
            navigate("/");
        }, 1000);
      }
        } catch (error){
          console.error(error);
        }
      }
    };
  return (
    <div>
        <div className="section_login">
            <div className="row">
                <div className="col-6">
                    <div className="section_login_group">
                        <h3>Welcome to Holidaze!</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Email</label>
                            <div className="mb-3 section_login_input">
                                <input type="email"  id="email" className="section_email" placeholder="student@stud.noroff.no" value={formData.email} onChange={handleChange}/>
                            </div>
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                            <label>Password</label>
                            <div className="mb-3 section_login_input">
                                <input type="password" id="password" className="section_password" placeholder="your password" value={formData.password} onChange={handleChange}/>
                            </div>
                            {errors.password && <p className="text-danger">{errors.password}</p>}
                            <button className='cta-btn' type="submit">Login</button>
                        <p>Don't have an account? <span><Link to='/register'>Register here</Link></span></p>
                        </form>
                    </div>
                </div>
                <div className="col-6">
                <img src={myImage} className='img-fluid' alt="Description" />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Login;

