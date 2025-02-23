/**
 * @file Booking Component
 * @description This component fetches and displays a user's bookings.
 * Users can view, and delete their bookings. If the user is not logged in, they are redirected to the Logout component.
 */
import {useLoggedIn} from '../../context/Context';
import  apiEndpoints from '../../api/endpoints';
import React,{useState, useEffect}  from "react";
import Logout from '../../auth/Logout';
import {Link} from 'react-router-dom';

/**
 * Booking Component
 * @returns {JSX.Element} The Booking component UI.
 */
function Booking() {
    const [isLoading,setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { isLoggedIn, token,name } = useLoggedIn();
    const [bookingNo, setBookingNo] = useState(0);
    const [bookingData, setBookingData] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const url = apiEndpoints(undefined,name).profileBooking;
    /**
     * Fetches booking data from the API.
     * @returns {Promise<void>}
     */
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
                 setBookingNo(json.data.length);
                 setBookingData(json.data);
            } catch (error){
                console.log(error);
            } finally{
                setIsLoading(false);
            }
        }
        getData();
    },[url,token]);

          if (!isLoggedIn) {
            return <Logout />;
          }
          if (isLoading ) {
            return <div>Loading</div>;
        }

        if (isError) {
            return <div>Error</div>;
        }
         /**
         * Handles booking deletion.
         * Deletes the selected booking from the API and updates the state.
         */
        const handleDelete = async () => {
            if (selectedBooking) {
              try {
                const response = await fetch(apiEndpoints(selectedBooking.id).deleteBooking, {
                  method: "DELETE",
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                    'Content-Type': 'application/json',
                  },
                });

                if (response.ok) {
                  // Remove the booking from state if the API request was successful
                  const updatedBookings = bookingData.filter(
                    (booking) => booking.id !== selectedBooking.id
                  );
                  setBookingData(updatedBookings);
                     // If no bookings are left, show a message
                    if (updatedBookings.length === 0) {
                        setBookingNo(0);
                    }
                } else {
                  console.error("Failed to delete booking");
                }
              } catch (error) {
                console.error("Error deleting booking:", error);
              }
            }
          };
        return (
            <div className="container">
                {bookingNo === 0 ? (
                    <div className='text-center  d-flex flex-column align-items-center justify-content-center vh-100'>
                        <h1 className="fw-bold">My Venues</h1>
                        <p className="text-muted fs-5">Book a venue to get started</p>
                        <Link to="/" className="cta-btn mt-3">Book a venue</Link>
                    </div>
                ) : (
                    <div>
                        <h1 className='mt-5'>My bookings</h1>
                        {bookingData.map((booking) => (
                            <div  className="card mt-5" key={booking.id}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col col-12 col-lg-6"><img className="img-fluid" src={booking?.venue.media[0].url} alt="" /></div>
                                        <div className="col col-12 col-lg-6">
                                            <div className="card-inner mt-3">
                                                <h2>{booking.venue.name}</h2>
                                                <p>From: {new Date(booking.dateFrom).toLocaleString()}</p>
                                                <p>To: {new Date(booking.dateTo).toLocaleString()}</p>
                                                <p>Guests: {booking.guests}</p>
                                                <button  type="button"  data-bs-toggle="modal" data-bs-target="#deleteBookingModal" className="cta-btn mb-5"   onClick={() => setSelectedBooking(booking)}>Cancel Booking</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal fade" id="deleteBookingModal" tabIndex="-1" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
                                        <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">

                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div className="modal-body">  Are you sure you want to delete this booking? </div>
                                            <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                data-bs-dismiss="modal"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
}
export default Booking;

