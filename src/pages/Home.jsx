import  apiEndpoints from '../api/endpoints'
import React, { useEffect, useState }  from 'react'
import { Link} from 'react-router-dom'

function Home() {
     // Fetch the venues endpoint
    const url = apiEndpoints().venues;
    const [posts,setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // State for holding our loading state
    const [isLoading, setIsLoading] = useState(false);
    // State for holding our error state
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        async function getData() {
        try{
            // Reset the error state in case there as an error previously
            setIsError(false);
            // Turn on the loading state each time we do an API call
            setIsLoading(true);
            const response = await fetch(url);
            const json = await response.json();
            // console.log(json.data[0].media[0].url);
            setPosts(json.data);
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
    },[url]);
    const filteredPosts = posts.filter((post) =>
        post.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    if(isLoading){
        return <div>Loading posts</div>
      }
      if(isError){
        return <div>Error loading data</div>;
      }
      return (
        <div>
            <div className="section_hero">
              <div className="container">
                <h1 className="hero-title fw-bold"> Discover Your Next Getaway</h1>
                <p className="hero-subtitle"> Find the best deals on the latest products.</p>
              </div>
              </div>
            <div className="section_products"  id="section_products">
              <div className="container">

                <div className="row">
                <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search for products" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search for products"/>
                <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
              </div>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  let sale = parseFloat(post.price) - parseFloat(post.discountedPrice);
                    return (
                    <div className="col-md-4 mb-4" key={post.id} style={{ display: post.media && post.media.length > 0 ? 'block' : 'none' }}>
                      <Link to={`/venue/${post.id}`} style={{ textDecoration: 'none' }}>
                        <div className="card">
                          <img className="card-img-top img-fluid" src={post.media?.[0]?.url ? post.media[0].url : ''} alt={post.media[0]?.alt ? post.media[0].alt : ''}  style={{ maxHeight: '250px', objectFit: 'cover' }}/>
                          {(sale > 0) ? <span className="sale-badge">SALE</span>: <span/>}
                          <div className="card-body">
                            <p className="card-text">{post.location.city==="" || post.location.city == null ? 'Unknown City': post.location.city }, {post.location.country==="" || post.location.country==null ? 'Country ?' :post.location.country}</p>
                            <h5 className="card-title fw-bold">{post.name}</h5>
                            <p className="card-text">$ {post.price} / night</p>
                            </div>
                        </div>
                      </Link>
                    </div>
                    );
                  })
              ) : (
                <div className="col-md-12">
                  <h2>No products found</h2>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      );
}

export default Home;