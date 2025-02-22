import { Link ,useNavigate} from 'react-router-dom'
import myImage from '../css/images/travelmap.jpg'
import  apiEndpoints from '../api/endpoints'
import React,{useState} from 'react';
function Register() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(""); // State for authentication error
    const [formData, setFormData] = useState({
        name :'',
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
        if(!formData.name.trim()){
          validationErrors.name = 'Please enter your name';
        } else if (formData.name.length < 3) {
          validationErrors.name ='Minimum 3 characters required';
        }
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
        setAuthError(""); // Reset auth error before validating
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
          try{
            const requestBody = {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              venueManager: true,
          };
            console.log({requestBody});

            const response = await fetch(apiEndpoints().register, {
              method: "POST",
              body: JSON.stringify(requestBody),
              headers: {
                'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                "Content-Type": "application/json",
            },
            mode: "cors", // Allows cross-origin requests
          });
          console.log({response});

          if (!response.ok) {
            setAuthError("Invalid registration!"); // Set authentication error
            return;
        }
         // Reset form fields after successful submission
              setFormData({
                name: '',
                email: '',
                password: '',
              });
              setErrors({});
              console.log("Registration Response Status:", response.status);
          if (response.ok) {
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }

        } catch(error){
          console.log('Error:', error);
        }
      }
      };
  return (
    <div>
        <div className="section_login">
            <div className="row">
                <div className="col col-12 col-lg-6">
                    <div className="section_login_group">
                        <h3>Welcome to Holidaze!</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Name</label>
                            <div className="mb-3 section_login_input">
                                <input type="text"  id="name" className="section_name" placeholder="enter your name" value={formData.name} onChange={handleChange}/>
                            </div>
                            {errors.name && <p className="text-danger">{errors.name}</p>}
                            <label>Email</label>
                            <div className="mb-3 section_login_input">
                                <input type="email"  id="email" className="section_email" placeholder="student@stud.noroff.no" value={formData.email} onChange={handleChange}/>
                            </div>
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                            <label>Password</label>
                            <div className="mb-3 section_login_input">
                                <input type="password" id="password" className="section_password" placeholder="your password"  value={formData.password} onChange={handleChange} />
                            </div>
                            {errors.password && <p className="text-danger">{errors.password}</p>}
                            <label>Avtar</label>
                            <div className="mb-3 section_login_input">
                                <input type="text" id="avtar" className="section_avtar" placeholder="https://example.com/avtar.png" />
                            </div>
                            <button className='cta-btn' type="submit">Register</button>
                            {authError && (
                            <div className="error-box mt-2">
                              <p className="text-danger">{authError}</p>
                            </div>
                          )}
                        <p className='section_login_registration'>Already have an account? <span><Link to='/login'>Login here</Link></span></p>
                        </form>
                    </div>
                </div>
                <div className="col col-12 col-lg-6">
                <img src={myImage} className='img-fluid' alt="Description" />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Register;

