/**
 * Generates API endpoints for the Holidaze application.
 *
 * @param {string|number} id - The unique identifier for a venue or booking.
 * @param {string} name - The username or profile name.
 * @returns {Object} An object containing various API endpoint URLs.
 */
function apiEndpoints(id,name){
    const url = 'https://v2.api.noroff.dev';
    const endpoints = {
        register: `${url}/auth/register`,
        login: `${url}/auth/login?_holidaze=true`,
        venues: `${url}/holidaze/venues/`,
        singleVenue: `${url}/holidaze/venues/${id}`,
        updateVenue: `${url}/holidaze/venues/${id}`,
        deleteVenue: `${url}/holidaze/venues/${id}`,
        profile: `${url}/holidaze/profiles/${name}`,
        profileBooking: `${url}/holidaze/profiles/${name}/bookings?_venue=true`,
        profileVenues: `${url}/holidaze/profiles/${name}/venues`,
        showVenuesBooking: `${url}/holidaze/venues/search?_bookings=true&q=${name}`,
        registerAsManager: `${url}/holidaze/profiles/${name}`,
        makeBooking: `${url}/holidaze/bookings`,
        deleteBooking: `${url}/holidaze/bookings/${id}`,
    };
    return endpoints; // Ensure to return the endpoints object.
}
export default apiEndpoints;