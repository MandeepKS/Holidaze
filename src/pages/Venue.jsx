import React, {useState, useEffect} from "react";
import {Link,useParams } from 'react-router-dom';
import  apiEndpoints from '../api/endpoints'
import {useLoggedIn} from '../context/Context';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// This function fetch the single Venue item
function Venue() {
    let nights =  0;
    let fromDate = new Date();
    let toDate = new Date();
    const { id } = useParams();
    const url = apiEndpoints(id).singleVenue;
    const [data,setData] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { isLoggedIn,token} = useLoggedIn();
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [guests, setGuests] = useState(1); // Default to 1 guests
    const maxGuests = 5;
    const minGuests = 1;
    fromDate = new Date(Date.UTC(dateRange[0].getFullYear(),dateRange[0].getMonth(),dateRange[0].getDate(),
        0, 0, 0, 0
    )).toISOString();
    toDate = new Date(Date.UTC(dateRange[1].getFullYear(),dateRange[1].getMonth(),dateRange[1].getDate(),
        23, 59, 59, 999
    )).toISOString();
    const makeReservation = async() => {
       const reservationDetails = {
        dateFrom:fromDate,
        dateTo: toDate,
        venueId:id,
        guests:guests
    };
    console.log(reservationDetails);
    try {
        const response = await fetch(apiEndpoints().makeBooking, {
            method: "POST",
            body: JSON.stringify(reservationDetails),
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
    }
}
    const increment = () => {
        if (guests < maxGuests) setGuests(guests + 1);
      };
    const decrement = () => {
    if (guests > minGuests) setGuests(guests - 1);
    };
    useEffect(() => {
        async function getData(url) {
            try{
                setIsError(false);
                setIsLoading(true);
                const response = await fetch(url);
                const json = await response.json();
                console.log({json});
                setData(json.data);
            } catch (error){
                console.log(error);
            } finally{
                setIsLoading(false);
            }
        }
        getData(url);
    },[url]);

    if (isLoading || !data) {
        return <div>Loading</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    let rating = data.rating;
    let updated =  new Date(data.updated).toLocaleDateString();
    return (
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-md-6 mt-5">
                        <p className="d-flex justify-content-start fw-bold ">Price : $ {data.price}</p>
                    </div>
                    <div className="col col-12 col-md-6 mt-5">
                        <h5 className="d-flex justify-content-end ms-5 "> {rating} Stars <span className=" ms-3 "> <StarRating count={rating} /></span></h5>
                    </div>
                    <div className="col-md-12 mt-5 d-flex justify-content-center"><img className='img-fluid' src={data.media?.[0]?.url ? data.media[0].url : ''} alt={data.title} />
                    </div>
                    <div className="col-md-12">

                        <div className="d-flex justify-content-between mt-3" data-bs-toggle="collapse" data-bs-target="#hotel_info"  style={{ cursor: "pointer" }} >
                            <h3 className="d-flex justify-content-start  mt-3" >Information</h3>
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
                            <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Hotel : </span> {data.name}</p>
                            <p  className="d-flex justify-content-start ms-5 "><span className="fw-bold me-1">Description : </span> {data.description}</p>
                            <p  className="d-flex justify-content-start ms-5"><span className="fw-bold me-1">Max Guests :</span> {data.maxGuests}</p>
                            <p  className="d-flex justify-content-start ms-5"><span className="fw-bold me-1">Updated :</span> {updated}</p>
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
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Breakfast : </span>{data.meta.breakfast ? 'Yes' :'No'}</p>
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Parking : </span>{data.meta.parking  ? 'Yes' :'No'}</p>
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Wifi :  </span>{data.meta.wifi ? 'Yes' : 'No'}</p>
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Pets : </span>{data.meta.pets ? 'Yes':'No'}</p>
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
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Address : </span>{data.location?.address}</p>
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">City : </span>{data.location?.city}</p>
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Zip :  </span>{data.location?.zip}</p>
                                <p  className="d-flex justify-content-start ms-5 mt-2"><span className="fw-bold me-1">Country : </span>{data.location?.country}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="d-flex justify-content-start"/>
                <div className="row">
                    <div className="col-md-12">
                    {!isLoggedIn ? <div><p>To create a booking you need to login</p> <Link to='/login'><button className='cta-btn' type="submit">Login</button></Link> </div> :
                    <div>

                    <h4 className="mt-5 ms-5 mb-3">Make Reservation</h4>
                    <Calendar
                            onChange={setDateRange}
                            value={dateRange}
                            selectRange={true}  // Enables range selection
                            minDate= {new Date()} // Disable past dates
                        />
                         <p>From: {dateRange[0]?.toDateString() }</p>
                        <p>To: {dateRange[1]?.toDateString() }</p>
                        {nights = parseInt(Math.abs(dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24))}
                        <p>Guests: </p>
                        <div className="guest-counter">
                        <button className="counter-btn" onClick={decrement} disabled={guests === minGuests}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-minus" className="svg-inline--fa fa-circle-minus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path></svg>
                        </button>
                        <span className="guest-count">{guests}</span>
                        <button className="counter-btn" onClick={increment} disabled={guests === maxGuests}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-plus" className="svg-inline--fa fa-circle-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path></svg>
                        </button>
                        <span className="guest-info">Max. {maxGuests} guests</span>
                        </div>
                        <p>{nights} nights x ${data.price} per night   ----- ${nights* data.price}</p>
                        <p>Total : ${nights* data.price}</p>
                        <button className='cta-btn' onClick={makeReservation}>Make reseravation</button>
                    </div>
                   }
                    </div>
                </div>
            </div>
        );
}

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