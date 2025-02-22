import {useLoggedIn} from '../../context/Context';
import  apiEndpoints from '../../api/endpoints';
import React,{useState, useEffect}  from "react";
import Logout from '../../auth/Logout';
import {Link} from 'react-router-dom';
function AdminVenues() {
    const [isLoading,setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { isLoggedIn, token,name } = useLoggedIn();
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
    useEffect(() => {
        async function getData() {
            try{
                setIsError(false);
                setIsLoading(true);
                const response = await fetch(url,{
                    method: 'GET',
                    headers: {
                     'Authorization': `Bearer ${token}` ,
                     'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                     'Content-Type': 'application/json',
                },
                mode: "cors", // Allows cross-origin requests
            });
                 const json = await response.json();
                setBookingData(json.data);

            } catch (error){
                console.log(error);
            } finally{
                setIsLoading(false);
            }
        }
        getData();
    },[url,token]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
          }));
    };
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
        console.log("Submitting Data:", formattedData);
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
        const json = await response.json();
        console.log({json});
        } catch (error) {
            console.log(error);
        };
    };
          if (!isLoggedIn) {
            return <Logout />;
          }
          if (isLoading ) {
            return <div>Loading</div>;
        }

        if (isError) {
            return <div>Error</div>;
        }
        console.log({bookingData});

    return (
        <div className="container">
        <CreateVenueModal formData={formData} handleChange={handleChange} createVenueSubmit={createVenueSubmit} />
        {bookingData.length === 0 ? (
            <div>
                <h1>My Venues</h1>
                <button className="cta-btn mt-2" data-bs-toggle="modal" data-bs-target="#createVenueModal">
                Create Venue
                </button>
                <p>No venues found...</p>
            </div>
        ) : (
            <div>
                <div className="d-flex justify-content-between">
                <h1>My Venues</h1>
                <button className="cta-btn mt-2" data-bs-toggle="modal" data-bs-target="#createVenueModal">
                Create Venue
                </button>
                </div>
                <div className="row">
                {bookingData.map((booking) => (
                <div className="col-lg-3" key={booking.id}>
                    <Link to={`/admin/venue/${booking.id}`}>
                        <div className="card">
                            <img className="img-fluid" src={booking?.media[0]?.url} alt={booking.name} />
                            <div className="card-body">
                                <h4>{booking.name}</h4>
                                <div className="row">
                                <div className="col">
                                <p>Price: {booking.price}</p>
                                </div>
                                <div className="col"> <p>Max Guests: {booking.maxGuests}</p></div>
                                </div>
                                Created: {new Date(booking.created).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                </div>
                ))}
            </div>
            </div>
        )}
      </div>

    );
}
export default AdminVenues;

// Modal component
const CreateVenueModal = ({ formData, handleChange, createVenueSubmit }) => {
    return (
      <div
        className="modal fade"
        id="createVenueModal"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <form onSubmit={createVenueSubmit}>
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
                <button type="submit" className="cta-btn" data-bs-dismiss="modal">
                  Create Venue
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };