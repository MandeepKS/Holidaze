import React, {useState, useEffect,useCallback } from "react";
import {useParams } from 'react-router-dom';
import  apiEndpoints from '../../api/endpoints'
import {useLoggedIn} from '../../context/Context';

/**
 * Component to fetch and display a single Venue item.
 * Allows updating and deleting venues, as well as fetching bookings.
 * @returns {JSX.Element} The Venue component.
 */
function Venue() {
    const { id } = useParams();
    const url = apiEndpoints(id).singleVenue;
    const [data,setData] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const {token} = useLoggedIn();
    const [isError, setIsError] = useState(false);
    const [venueBooking, setVenueBooking] = useState(null);
    // Form data state
    const [formData, setFormData] = useState({
      venueName: "",
      venueDescription: "",
      venuePrice: "",
      venueImage: "",
      venueGuests: "",
      venueRating: "",
      venueWifi: false,
      venueParking: false,
      venueBreakfast: false,
      venuePets: false,
      venueAddress: "",
      venuePostal: "",
      venueCity: "",
      venueCountry: "",
  });
     /**
     * Fetches venue data from the API and updates state.
     */
    const getData = useCallback(async () => {
      setIsLoading(true);
      setIsError(false);
            try{
                const response = await fetch(url);
                const json = await response.json();
                setData(json.data);
                  // Update state with fetched data
                  if (json) {
                    setFormData((prev) => ({
                        ...prev,  // Preserve existing state
                        venueName: json.data.name || "",
                        venueDescription: json.data.description || "",
                        venuePrice: json.data.price || "",
                        venueGuests: json.data.maxGuests || "",
                        venueRating: json.data.rating || "",
                        venueImage: json.data.media?.[0]?.url || "",
                        venueWifi: json.data.meta?.wifi || false,
                        venueParking: json.data.meta?.parking || false,
                        venueBreakfast: json.data.meta?.breakfast || false,
                        venuePets: json.data.meta?.pets || false,
                        venueAddress: json.data.location?.address || "",
                        venuePostal: json.data.location?.zip || "",
                        venueCity: json.data.location?.city || "",
                        venueCountry: json.data.location?.country || "",
                    }));
                  }
            } catch (error){
                console.log(error);
            } finally{
                setIsLoading(false);
            }
        },[url]);
    // Fetch data when the component mounts
    useEffect(() => {
      getData();
  }, [getData]);
    /**
     * Handles form input changes.
     * @param {React.ChangeEvent} e - The event object.
     */
    const handleChange = (e) => {
      const { name, type, checked, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: type === "checkbox" ? checked : value,
        }));
  };
  /**
   * Updates a venue in the API.
   * @param {React.FormEvent} e - The form event.
   */
  const updateVenueSubmit = async (e) => {
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
    try {

        const response = await fetch(apiEndpoints(id).updateVenue, {
        method: "PUT",
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
    getData();
};

/**
 * Deletes a venue from the API.
 */
const handleDelete = async () => {
  if (!id) {
    console.error("Venue ID is missing");
    return;
  }
// Send a DELETE request to the API
  try {
    const response = await fetch(apiEndpoints(id).deleteVenue, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log("Venue deleted successfully");
      setData(null); // Clear venue data after deletion
      setTimeout(() => {
        window.location.href = "/"; // Redirect to the venues page
      }, 1000);
    } else {
      console.error("Failed to delete venue");
    }
  } catch (error) {
    console.error("Error deleting venue:", error);
  }
};
/**
 * Fetches venue booking details.
 */
const handleVenueBooking = useCallback(async  () => {
  if (!data) return;
 const booking = data.name;
  console.log({booking});

  try {
    const response = await fetch(apiEndpoints(undefined,booking).showVenuesBooking, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
        'Content-Type': 'application/json',
      },
      mode: "cors", // Allows cross-origin requests
    });
    const json = await response.json();
    console.log({json});
    setVenueBooking(json);  // Update state with fetched data
  } catch (error) {
    console.error("Error fetching venue bookings:", error);
  }
},[data,token]);
  // Fetch data when modal opens
  useEffect(() => {
    if(data){
      handleVenueBooking();
    }
  }, [data,handleVenueBooking]);

    if (isLoading || !data) {
        return <div>Loading</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    let rating = data.rating;
    let updated =  new Date(data.updated).toLocaleDateString();
    return (
      <div className="section_admin_venue">
            <div className="container">
              {/* Edit Modal */}
                <EditVenueModal formData={formData} handleChange={handleChange} updateVenueSubmit={updateVenueSubmit}/>
                {/* Delete Modal */}
                <DeleteVenueModal handleDelete={handleDelete}/>
                <ShowVenueBooking venueBooking={venueBooking}/>
                <div className="row">
                    <div className="col col-md-12">
                        <h4 className="d-flex justify-content-center ms-5 mt-5 mb-3 fw-bolder" >{data.name}</h4>
                    </div>
                    <div className="col-md-6 d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                      <button className="cta-btn btn-sm" data-bs-toggle="modal" data-bs-target="#editVenueModal">
                        Edit
                      </button>
                      <button className="cta-btn--outline btn-sm" data-bs-toggle="modal" data-bs-target="#deleteVenueModal">
                        Delete
                      </button>
                      <button className="cta-btn--outline btn-sm" data-bs-toggle="modal" data-bs-target="#showVenueBookingModal">
                        Show Venue Booking
                      </button>
                    </div>
                    <div className="col-md-6">
                        <h5 className="d-flex justify-content-center justify-content-md-end mt-3 mt-md-0"> {rating} Stars <span className=" ms-3 "> <StarRating count={rating} /></span></h5>
                    </div>
                    <div className="col-md-12 mt-5 d-flex justify-content-center"><img className='img-fluid' src={data.media?.[0]?.url ? data.media[0].url : ''} alt={data.title} />
                    </div>
                    <div className="col-md-12">

                        <div className="d-flex justify-content-between  mt-3" data-bs-toggle="collapse" data-bs-target="#hotel_info"  style={{ cursor: "pointer" }} >
                            <h3 className="d-flex justify-content-start mt-3" >Information</h3>
                            <div className="d-flex align-items-center" >
                                <svg
                                    data-accordion-icon="true"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                    style={{ width: "12px", height: "12px", stroke: "black" }}
                                    >
                                    <path
                                    stroke="black"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l4 4 4-4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div id="hotel_info" className="collapse">
                            <div className="card card-body bg-grey">
                              <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Hotel : </span> {data.name}</p>
                              <p  className="d-flex justify-content-start ms-3 "><span className="fw-bold me-1">Description : </span> {data.description}</p>
                              <p  className="d-flex justify-content-start ms-3"><span className="fw-bold me-1">Max Guests :</span> {data.maxGuests}</p>
                              <p  className="d-flex justify-content-start ms-3"><span className="fw-bold me-1">Updated :</span> {updated}</p>
                            </div>
                        </div>

                        <hr className="d-flex justify-content-start"/>
                        <div className="d-flex justify-content-between mt-3" data-bs-toggle="collapse" data-bs-target="#hotel_facilities"  style={{ cursor: "pointer" }} >
                            <h3 className="d-flex justify-content-start mt-3" >Facilities </h3>
                            <div className="d-flex align-items-center" >
                                <svg
                                    data-accordion-icon="true"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                    style={{ width: "12px", height: "12px", stroke: "black" }}
                                    >
                                    <path
                                    stroke="black"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l4 4 4-4"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div id="hotel_facilities" className="collapse">
                            <div className="card card-body bg-grey">
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Breakfast : </span>{data.meta.breakfast ? 'Yes' :'No'}</p>
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Parking : </span>{data.meta.parking  ? 'Yes' :'No'}</p>
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Wifi :  </span>{data.meta.wifi ? 'Yes' : 'No'}</p>
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Pets : </span>{data.meta.pets ? 'Yes':'No'}</p>
                            </div>
                        </div>
                        <hr className="d-flex justify-content-start"/>
                        <div className="d-flex justify-content-between mt-3" data-bs-toggle="collapse" data-bs-target="#hotel_location"  style={{ cursor: "pointer" }} >
                            <h3 className="d-flex justify-content-start mt-3" >Location </h3>
                            <div className="d-flex align-items-center" >
                                <svg
                                    data-accordion-icon="true"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                    style={{ width: "12px", height: "12px", stroke: "black" }}
                                    >
                                    <path
                                    stroke="black"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l4 4 4-4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div id="hotel_location" className="collapse">
                            <div className="card card-body bg-grey">
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Address : </span>{data.location?.address}</p>
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">City : </span>{data.location?.city}</p>
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Zip :  </span>{data.location?.zip}</p>
                                <p  className="d-flex justify-content-start ms-3 mt-2"><span className="fw-bold me-1">Country : </span>{data.location?.country}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="d-flex justify-content-start"/>
            </div>
          </div>
        );
}
/**
 * Component for displaying a star rating.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.count - The number of filled stars (out of 5).
 * @returns {JSX.Element} The StarRating component.
 */
function StarRating(props){
    const stars = [];
    const emptyStars = [];
    const totalStars = 5;
    const remainingStars = totalStars - props.count;
    for(let i = 0; i < props.count; i++){
        stars.push(<i className="bi bi-star-fill fs-5 ms-1" key={i} style={{ color: 'var(--dark-red)' }}></i>);
    }
    for(let j = 0; j < remainingStars; j++){
        emptyStars.push(<i className="bi bi-star-fill fs-5 ms-1" key={j} style={{ color: "var(--dark-grey)" }}></i>);
    }
    return <div>{[stars,emptyStars]}</div>
}
export default Venue;

/**
 * EditVenueModal component displays a modal for editing venue details.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.formData - The current state of the form data for the venue.
 * @param {Function} props.handleChange - Function to handle input field changes.
 * @param {Function} props.updateVenueSubmit - Function to handle the form submission.
 *
 * @returns {JSX.Element} The modal for editing venue details.
 */
const EditVenueModal = ({ formData, handleChange, updateVenueSubmit }) => {
    return (
      <div
        className="modal fade"
        id="editVenueModal"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <form onSubmit={updateVenueSubmit}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Edit venue</h3>
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
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };
/**
 * DeleteVenueModal component displays a confirmation modal for deleting a venue.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleDelete - Function to execute when the delete button is clicked.
 *
 * @returns {JSX.Element} The modal for confirming venue deletion.
 */
const DeleteVenueModal = ({ handleDelete }) => {
    return (
      <div
        className="modal fade"
        id="deleteVenueModal"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Are you sure you want to delete this venue?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
 };
/**
 * ShowVenueBooking component displays venue booking details in a Bootstrap modal.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.venueBooking - The venue booking data.
 * @param {Array} props.venueBooking.data - Array of venue objects containing bookings.
 * @param {string} props.venueBooking.data[].name - Name of the venue.
 * @param {Array} props.venueBooking.data[].bookings - Array of booking objects.
 * @param {string} props.venueBooking.data[].bookings[].dateFrom - Booking check-in date (ISO string).
 * @param {string} props.venueBooking.data[].bookings[].dateTo - Booking check-out date (ISO string).
 * @param {number} props.venueBooking.data[].bookings[].guests - Number of guests for the booking.
 *
 * @returns {JSX.Element} The modal displaying venue booking details.
 */
 const ShowVenueBooking = ({ venueBooking }) => {
  return (
    <div
      className="modal fade"
      id="showVenueBookingModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            {venueBooking?.data && venueBooking.data.length > 0 ? (
              <div>
                <h3 className="mb-3">Venue Bookings</h3>
                {venueBooking.data.map((venue, index) =>
                  venue.bookings && venue.bookings.length > 0 ? (
                    venue.bookings.map((booking, idx) => (
                      <div key={`${index}-${idx}`} className="card mb-3">
                        <div className="card-body">
                          <h5 className="card-title fw-bold">{venue.name}</h5>
                          <p className="card-text">
                            <strong>Check-in:</strong>{" "}
                            {new Date(booking.dateFrom).toLocaleDateString()}
                          </p>
                          <p className="card-text">
                            <strong>Check-out:</strong>{" "}
                            {new Date(booking.dateTo).toLocaleDateString()}
                          </p>
                          <p className="card-text">
                            <strong>Guests:</strong>{" "}
                            {booking.guests}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p key={index} className="text-muted">
                      No bookings available for {venue.name}.
                    </p>
                  )
                )}
              </div>
            ) : (
              <p>Venue has not been booked yet!</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
