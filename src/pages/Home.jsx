import apiEndpoints from '../api/endpoints';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hotelVideo from '../css/images/HotelVideo.mp4';

/**
 * Home component for displaying a list of venues.
 * Fetches data from an API and allows users to search venues.
 * @component
 */
function Home() {
    /**
     * API endpoint for fetching venues.
     * @type {string}
     */
    const url = apiEndpoints().venues;

    /**
     * State for storing venue posts.
     * @type {Array}
     */
    const [posts, setPosts] = useState([]);

    /**
     * State for storing search query.
     * @type {string}
     */
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Loading state.
     * @type {boolean}
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Error state.
     * @type {boolean}
     */
    const [isError, setIsError] = useState(false);

    /**
     * Fetches venue data from API on component mount.
     * Handles loading and error states.
     * @async
     */
    useEffect(() => {
        async function getData() {
            try {
                setIsError(false);
                setIsLoading(true);
                const response = await fetch(url);
                const json = await response.json();
                setPosts(json.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setIsError(true);
            }
        }
        getData();
    }, [url]);

    /**
     * Filters posts based on search query.
     * @type {Array}
     */
    const filteredPosts = posts.filter((post) =>
        post.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <div>Loading posts</div>;
    }
    if (isError) {
        return <div>Error loading data</div>;
    }

    return (
        <div>
            <div className="section_hero">
              <div className="section_hero_image">
                <video class="introVideo" autoplay="" loop="" muted="" playsinline="">
                  <source src={hotelVideo} type="video/mp4" />
              </video>
                {/* <img src={plane} alt="plane" /> */}
                <div className="container">
                  <div className="hero_group">
                    <h1 className="hero-title fw-bold">Discover Your Next Getaway</h1>
                    <p className="hero-subtitle">Find the best place to travel around the world.</p>
                    <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search hotels"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search hotels"
                            />
                            <button className="cta-btn" type="button" id="button-addon2">Search</button>
                        </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section_products" id="section_products">
                <div className="container">
                    <div className="row">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => {
                                let sale = parseFloat(post.price) - parseFloat(post.discountedPrice);
                                return (
                                    <div
                                        className="col-md-4 mb-4"
                                        key={post.id}
                                        style={{ display: post.media && post.media.length > 0 ? 'block' : 'none' }}
                                    >
                                        <Link to={`/venue/${post.id}`} style={{ textDecoration: 'none' }}>
                                            <div className="card">
                                                <img
                                                    className="card-img-top img-fluid"
                                                    src={post.media?.[0]?.url || null}
                                                    alt={post.media?.[0]?.alt || post.name}
                                                    style={{ maxHeight: '250px', objectFit: 'cover' }}
                                                />
                                                {sale > 0 ? <span className="sale-badge">SALE</span> : <span />}
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        {post.location.city === "" || post.location.city == null ? 'Unknown City' : post.location.city},
                                                        {post.location.country === "" || post.location.country == null ? 'Country ?' : post.location.country}
                                                    </p>
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
