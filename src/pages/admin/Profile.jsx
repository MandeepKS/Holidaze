// import apiEndpoints from "../api/endpoints";
import {useLoggedIn} from '../../context/Context';
import UnAuthUser from '../../components/UnAuthUser';
import { useEffect,useState}  from 'react'
import apiEndpoints from '../../api/endpoints';
function Profile() {
    const { isLoggedIn,name,token} = useLoggedIn();
    const url = apiEndpoints(undefined,name).profile;
       // State for holding our loading state
        const [isLoading, setIsLoading] = useState(false);
        // State for holding our error state
        const [isError, setIsError] = useState(false);
        const [getProfileData, setProfileData] = useState([]);
        const [isChecked, setIsChecked] = useState(false);
       useEffect(() => {
            async function getData() {
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
                // Clear the loading state once we've successfully got our data
                setIsLoading(false);
            } catch (error){
                // Clear the loading state if we get an error and then
                // set our error state to true
                setIsLoading(false);
                setIsError(true);
            }
            }
            getData();
        },[url,token]);
    if (!isLoggedIn) {
        return <UnAuthUser />;
      }
      if(isLoading){
        return <div>Loading profile</div>
      }
      if(isError){
        return <div>Error loading data</div>;
      }
      console.log({getProfileData});
    return (
        <div className="container">
            <div className="card">
                <h1>{getProfileData?.name}</h1>
                <p>{getProfileData?.email}</p>
                {/* <img src={avatar} alt="Profile" />
                {isManager} */}
                <div className="form-check form-switch">
                    <label className="form-check-label" >Venue Manager</label>
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"   checked={isChecked}/>
                </div>
                <p>Bookings: {getProfileData?._count?.bookings}</p>
                <p>Venues: {getProfileData?._count?.venues}</p>
            </div>
        </div>
    );

}

export default Profile;