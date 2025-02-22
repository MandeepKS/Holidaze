import {useLoggedIn} from '../../context/Context';
import  apiEndpoints from '../../api/endpoints';
import React,{useState, useEffect}  from "react";
import Logout from '../../auth/Logout';
function Booking() {
    const [isLoading,setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { isLoggedIn, token,name } = useLoggedIn();
    const [bookingNo, setBookingNo] = useState(0);
    const [bookingData, setBookingData] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const url = apiEndpoints(undefined,name).profileBooking;
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
                console.log(json.data);

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
                    <div>
                    <h1>You have no bookings</h1>
                    <p>Book a venue to get started</p>
                    </div>
                ) : (
                    <div>
                        <h1>My bookings</h1>
                        {bookingData.map((booking) => (
                            <div  className="card mt-5" key={booking.id}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col col-lg-6"><img className="img-fluid" src={booking?.venue.media[0].url} alt="" /></div>
                                        <div className="col col-lg-6"> <h2>{booking.venue.name}</h2>
                                            <h3>From: {booking.dateFrom}</h3>
                                            <h3>To: {booking.dateTo}</h3>
                                            <h3>Guests: {booking.guests}</h3>
                                            {console.log(booking?.venue.media[0].url)}
                                            <button  type="button"  data-bs-toggle="modal" data-bs-target="#deleteBookingModal" className="cta-btn"   onClick={() => setSelectedBooking(booking)}>Cancel Booking</button>
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

