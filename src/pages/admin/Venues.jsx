/**
 * AdminVenues Component
 * Handles fetching, displaying, and creating venues for an admin user.
 */
import {useLoggedIn} from '../../context/Context';
import  apiEndpoints from '../../api/endpoints';
import React,{useState, useEffect, useCallback }  from "react";
import UnAuthUser from '../../components/UnAuthUser';
import {Link} from 'react-router-dom';
 /**
   * State to manage form data for creating a venue.
   */
function AdminVenues() {
    const [isLoading,setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { isLoggedIn, token,name,isManager } = useLoggedIn();
    const [bookingData, setBookingData] = useState([]);
    const [formData, setFormData] = useState({
        venueName :'',
        venueDescription :'',
        venuePrice :'',
        venueImage : '',
        venueGuests : '',
        venueRating : '',
        venueWifi : false,
        venueParking : false,
        venueBreakfast : false,
        venuePets : false,
        venueAddress : '',
        venuePostal : '',
        venueCity : '',
        venueCountry : '',
    });

    const url = apiEndpoints(undefined,name).profileVenues;
    /**
     * Fetches venue data from the API.
     * @async
     */
    const getData = useCallback(async () => {
      try {
          setIsError(false);
          setIsLoading(true);
          const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                  'Content-Type': 'application/json',
              },
              mode: "cors",
          });

          const json = await response.json();
          setBookingData(json.data);
      } catch (error) {
          console.log(error);
      } finally {
          setIsLoading(false);
      }
  }, [url, token]);

    useEffect(() => {
      getData();
    }, [getData]);
    /**
     * Handles input changes for both text and checkbox inputs.
     * @param {Object} e - Event object from input change.
     */
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
          }));
    };
    /**
     * Handles form submission to create a new venue.
     * @async
     * @param {Object} e - Event object from form submission.
     */
    const createVenueSubmit = async (e) => {
        e.preventDefault();  // Prevents page refresh
         // Convert formData into the required API format
        const formattedData = {
            name: formData.venueName,
            description: formData.venueDescription,
            media: [
            {
                url: formData.venueImage,  // Assuming venueImage is a URL
                alt: ""  // Optional
            }
            ],
            price: Number(formData.venuePrice),  // Convert to number
            maxGuests: Number(formData.venueGuests),  // Convert to number
            rating: Number(formData.venueRating),  // Convert to number
            meta: {
            wifi: formData.venueWifi,
            parking: formData.venueParking,
            breakfast: formData.venueBreakfast,
            pets: formData.venuePets
            },
            location: {
            address: formData.venueAddress,
            city: formData.venueCity,
            zip: formData.venuePostal,
            country: formData.venueCountry
            }
        };
        // console.log("Submitting Data:", formattedData);
        try {

            const response = await fetch(apiEndpoints().venues, {
            method: "POST",
            body: JSON.stringify(formattedData),
            headers: {
                'Authorization': `Bearer ${token}` ,
                'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                'Content-Type': 'application/json',
            },
            mode: "cors", // Allows cross-origin requests
        });
        if (response.ok) {
            const json = await response.json();
            alert("Venue created successfully");
            console.log("Venue created successfully:", json);
           //Manually fetch new data after successful creation
           getData();
        } else {
            alert("Failed to create venue");
            console.error("Failed to create venue:", response);
        }
        } catch (error) {
            console.log(error);
        }  finally {
          setIsLoading(false);  // Stop loading once data is fetched
      }
    };
            if (!isManager) {
              return (
                  <div className="container mt-5">
                      <div className="alert alert-danger text-center" role="alert">
                          <h4 className="alert-heading">Access Denied</h4>
                          <p className='mb-4'>You are not a Venue Manager. Please change the settings in your profile.</p>
                          <Link to="/admin/profile" className="cta-btn">Go to Profile</Link>
                      </div>
                  </div>
              );
          }
          if (!isLoggedIn) {
            return <UnAuthUser />;
          }
          if (isLoading ) {
            return <div>Loading</div>;
        }

        if (isError) {
            return <div>Error</div>;
        }
    return (
      <div className="section_admin_venues">
          <div className="container">
              <CreateVenueModal formData={formData} handleChange={handleChange} createVenueSubmit={createVenueSubmit}/>
              {bookingData.length === 0 ? (
                    <div className='text-center d-flex flex-column align-items-center justify-content-center vh-100'>
                      <h1 className="fw-bold">My Venues</h1>
                      <button
                        className="cta-btn mt-3 mb-3 px-4 py-2"
                        data-bs-toggle="modal"
                        data-bs-target="#createVenueModal">
                        + Create Venue
                      </button>
                      <p className="text-muted fs-5">No venues found...</p>
                  </div>
              ) : (
                  <div>
                      <div className="d-flex justify-content-between">
                      <h1 className="fw-bold">My Venues</h1>
                      <button
                        className="cta-btn mt-3 mb-3 px-4 py-2"
                        data-bs-toggle="modal"
                        data-bs-target="#createVenueModal">
                        + Create Venue
                      </button>
                      </div>
                      <div className="row">
                      {!bookingData ? (
                        <p>Loading...</p> // Show a loading message while data is fetching
                    ) : Array.isArray(bookingData) && bookingData.length > 0 ? (
                        bookingData.map((booking) => (
                            <div className="col-lg-3" key={booking.id}>
                                <Link to={`/admin/venue/${booking.id}`}>
                                    <div className="card">
                                        <img className="img-fluid" src={booking?.media?.[0]?.url || 'default-image.jpg'} alt={booking.name} />
                                        <div className="card-body">
                                            <h4>{booking.name}</h4>
                                            <div className="row">
                                                <div className="col"><p className='dark-red fw-bold'>$ {booking.price}</p></div>
                                                <div className="col"><p className='fw-bold'>Max Guests: {booking.maxGuests}</p></div>
                                            </div>
                                            Created: {new Date(booking.created).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No bookings available</p> // If bookings are empty after fetching, show this message
                    )}
                  </div>
                  </div>
              )}
        </div>
      </div>
    );
}
export default AdminVenues;

// Modal component
const CreateVenueModal = ({ formData, handleChange, createVenueSubmit }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.venueName.trim()) newErrors.venueName = "Venue name is required";
    if (!formData.venueDescription.trim()) newErrors.venueDescription = "Description is required";
    if (!formData.venuePrice || formData.venuePrice < 0) newErrors.venuePrice = "Price must be a positive number";
    if (!formData.venueGuests || formData.venueGuests < 1) newErrors.venueGuests = "At least 1 guest is required";
    if (!formData.venueRating || formData.venueRating < 0 || formData.venueRating > 5)
      newErrors.venueRating = "Rating must be between 0 and 5";

    // URL validation for images
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!formData.venueImage.trim()) {
      newErrors.venueImage = "Image URL is required";
    } else if (!urlPattern.test(formData.venueImage)) {
      newErrors.venueImage = "Invalid image URL (must end in .jpg, .png, etc.)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
        console.log("Form validation failed:", errors);
        return;
    }
    try {
        await createVenueSubmit(e);
        //Close the modal only after successful submission
        closeModal();
    } catch (error) {
        console.error("Error in createVenueSubmit:", error);
    }
};
/**
 * Closes the modal safely by removing Bootstrap modal classes and backdrop.
 */
const closeModal = () => {
  const modalElement = document.getElementById("createVenueModal");
  if (modalElement) {
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
  }
};
    return (
      <div
        className="modal fade"
        id="createVenueModal"
        tabIndex="-1"
        data-bs-backdrop="static"
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Create new venue</h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="venueName"
                    placeholder="Hotel California"
                    value={formData.venueName}
                    onChange={handleChange}
                  />
                  {errors.venueName && <small className="text-danger">{errors.venueName}</small>}
                </div>
                <div className="form-group mt-3">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    name="venueDescription"
                    rows="4"
                    placeholder="A lovely hotel with a great view."
                    value={formData.venueDescription}
                    onChange={handleChange}
                  />
                   {errors.venueDescription && <small className="text-danger">{errors.venueDescription}</small>}
                </div>
                <div className="form-group mt-3">
                  <label>Price per night</label>
                  <input
                    type="number"
                    className="form-control"
                    name="venuePrice"
                    placeholder="1500"
                    min="0"
                    value={formData.venuePrice}
                    onChange={handleChange}
                  />
                  {errors.venuePrice && <small className="text-danger">{errors.venuePrice}</small>}
                </div>
                <div className="form-group mt-3">
                  <label>Images</label>
                  <textarea
                    className="form-control"
                    name="venueImage"
                    rows="4"
                    placeholder="https://www.example.com/image"
                    value={formData.venueImage}
                    onChange={handleChange}
                  />
                  {errors.venueImage && <small className="text-danger">{errors.venueImage}</small>}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group mt-3">
                      <label>Max guests</label>
                      <input
                        type="number"
                        className="form-control"
                        name="venueGuests"
                        placeholder="4"
                        min="0"
                        value={formData.venueGuests}
                        onChange={handleChange}
                      />
                      {errors.venueGuests && <small className="text-danger">{errors.venueGuests}</small>}
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group mt-3">
                      <label>Rating out of 5</label>
                      <input
                        type="number"
                        className="form-control"
                        name="venueRating"
                        placeholder="2"
                        min="0"
                        value={formData.venueRating}
                        onChange={handleChange}
                      />
                       {errors.venueRating && <small className="text-danger">{errors.venueRating}</small>}
                    </div>
                  </div>
                </div>
                <hr className="mt-5" />
                <h5>Facilities</h5>
                <div className="row">
                  {[
                    { label: "Wifi", name: "venueWifi" },
                    { label: "Parking", name: "venueParking" },
                    { label: "Breakfast", name: "venueBreakfast" },
                    { label: "Pets", name: "venuePets" },
                  ].map((facility) => (
                    <div className="col-3" key={facility.name}>
                      <div className="form-check">
                        <input
                          className="form-check-input custom-checkbox"
                          type="checkbox"
                          name={facility.name}
                          checked={formData[facility.name]}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">{facility.label}</label>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="mt-5" />
                <h5>Location</h5>
                <div className="form-group mt-3">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="venueAddress"
                    placeholder="123 Main St."
                    value={formData.venueAddress}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <div className="col-3">
                    <div className="form-group mt-3">
                      <label>Postal code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="venuePostal"
                        placeholder="12345"
                        value={formData.venuePostal}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-9">
                    <div className="form-group mt-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="venueCity"
                        placeholder="San Francisco"
                        value={formData.venueCity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group mt-3 mb-5">
                  <label>Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="venueCountry"
                    placeholder="United States"
                    value={formData.venueCountry}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="cta-btn">
                  Create Venue
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };