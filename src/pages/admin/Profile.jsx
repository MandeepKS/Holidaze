/**
 * Profile component for displaying and managing user profile details.
 * Allows users to view their profile, update their profile picture, and toggle the Venue Manager status.
 *
 * @module Profile
 */
import {useLoggedIn} from '../../context/Context';
import UnAuthUser from '../../components/UnAuthUser';
import { useEffect,useState,useCallback }  from 'react'
import apiEndpoints from '../../api/endpoints';
/**
 * Profile Component
 * @returns {JSX.Element} Profile UI
 */
function Profile() {
    const { isLoggedIn,name,token, setIsManager} = useLoggedIn();
    const url = apiEndpoints(undefined,name).profile;
        /** @state {boolean} isLoading - Indicates if the API call is in progress */
        const [isLoading, setIsLoading] = useState(false);
        /** @state {boolean} isError - Tracks if an API call resulted in an error */
        const [isError, setIsError] = useState(false);
        /** @state {Object} getProfileData - Holds profile details from the API */
        const [getProfileData, setProfileData] = useState([]);
         /** @state {boolean} isChecked - Stores Venue Manager status */
        const [isChecked, setIsChecked] = useState(false);
         /** @state {string} image - Stores user profile image URL */
        const [image, setImage] = useState("https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500");
        /**
         * Fetches user profile data from the API
         * @async
         */
        const getData = useCallback(async () => {
            try{
                // Reset the error state in case there as an error previously
                setIsError(false);
                // Turn on the loading state each time we do an API call
                setIsLoading(true);
                const response = await fetch(url,{
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}` ,
                        'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                        'Content-Type': 'application/json',
                  },
                  mode: "cors", // Allows cross-origin requests
                });
                const json = await response.json();
               setProfileData(json.data);
               setIsChecked(json.data.venueManager);
               setIsManager(json.data.venueManager);
                // Clear the loading state once we've successfully got our data
                setIsLoading(false);
            } catch (error){
                setIsError(true);
            }
        },[url,token,setIsManager]);
            /**
            * Fetches profile data when the component mounts
            */
            useEffect(() => {
              getData();
          }, [getData]);
        /**
        * Updates the image state when `getProfileData` changes
        */
        useEffect(() => {
        if (getProfileData?.avatar?.url) {
            setImage(getProfileData.avatar.url);
        }
    }, [getProfileData]);
        /**
         * Handles image change by updating the profile avatar URL in the API
         * @async
         */
        const handleImageChange = async() => {
            const newImage = prompt("Enter new image URL:");
            const formattedImage = {
                avatar: {
                    url: newImage,
                },
            };
            if (newImage) {
                try{
                    const response = await fetch(apiEndpoints(undefined,name).profile,{
                        method: "PUT",
                        body: JSON.stringify(formattedImage),
                        headers: {
                            'Authorization': `Bearer ${token}` ,
                            'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                            'Content-Type': 'application/json',
                        },
                        mode: "cors", // Allows cross-origin requests

                        });
                        if (response.ok) {
                            alert("Image updated successfully");
                            const json = await response.json();
                            setImage(json.data.avatar.url);
                        }else{
                            alert("Image update failed");
                        }
                    }
                    catch (error){
                        console.log(error);
                    }
                };
        }
        /**
         * Handles checkbox change to update Venue Manager status in API
         * @async
         */
        const handleCheckboxChange = async () => {
            const newCheckedValue = !isChecked; // Toggle the value
            setIsChecked(newCheckedValue); // Update UI immediately

            try {
                const response = await fetch(url, {
                    method: "PUT",  // Assuming you need to update the value
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Noroff-API-Key': 'a2b95a14-3583-40bb-96ae-9213db9c23c2',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ venueManager: newCheckedValue }), // Send updated value
                    mode: "cors",
                });

                if (!response.ok) {
                    throw new Error("Failed to update venue manager status");
                } else {
                    alert("Venue manager status updated successfully");
                    console.log("Successfully updated venue manager status");
                    getData(); // Refresh the data after successful update
                }

            } catch (error) {
                console.error("Error updating venue manager:", error);
                setIsChecked(!newCheckedValue); // Revert the state if API fails
            }
        };
         // If the user is not logged in, show UnAuthUser component
        if (!isLoggedIn) {
            return <UnAuthUser />;
        }
        // Show loading state while fetching data
        if(isLoading){
            return <div>Loading profile</div>
        }
        // Show error state if API call fails
        if(isError){
            return <div>Error loading data</div>;
        }
        //   console.log({getProfileData});
        return (
            <div className="container py-5">
            <div className="section_admin_profile">
              <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                  <div className="card shadow-lg p-4 text-center">
                    {/* Profile Image */}
                    <div className="circle mx-auto mb-3" onClick={handleImageChange} style={{ cursor: "pointer" }}>
                      <img src={image} alt="Profile" className="rounded-circle border border-secondary" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                    </div>

                    {/* Profile Info */}
                    <h2 className="fw-bold dark-red">{getProfileData?.name}</h2>
                    <p className="text-muted">{getProfileData?.email}</p>

                    {/* Venue Manager Toggle */}
                    <div className="form-check form-switch d-flex align-items-center justify-content-center mt-3">
                      <label className="form-check-label me-5 fw-semibold" htmlFor="flexSwitchCheckDefault">Venue Manager</label>
                      <input className="form-check-input custom-switch" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={handleCheckboxChange} checked={isChecked} />
                    </div>

                    {/* Bookings & Venues Count */}
                    <div className="mt-4">
                      <p className="mb-1 fw-semibold">Bookings: <span className="dark-red">{getProfileData?._count?.bookings}</span></p>
                      <p className="fw-semibold">Venues: <span className="dark-red">{getProfileData?._count?.venues}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
}

export default Profile;
