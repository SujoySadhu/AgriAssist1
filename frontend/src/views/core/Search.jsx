
// // import React, { useState, useEffect } from "react";
// // import Header from "../partials/Header";
// // import Footer from "../partials/Footer";
// // import { useSearchParams } from "react-router-dom";
// // import apiInstance from "../../utils/axios";

// // function Search() {
// //     const [searchParams] = useSearchParams();
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const [posts, setPosts] = useState([]);
// //     const [filteredPosts, setFilteredPosts] = useState([]);

// //     const fetchPosts = async () => {
// //         try {
// //             const res = await apiInstance.get('post/lists/'); // ✅ Use the API that returns ALL posts
// //             const allPosts = res?.data || [];
// //             setPosts(allPosts);

// //             const query = searchParams.get("query")?.toLowerCase() || "";
// //             if (query) {
// //                 const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query));
// //                 setFilteredPosts(filtered);
// //                 setSearchQuery(query);
// //             } else {
// //                 setFilteredPosts(allPosts);
// //             }
// //         } catch (error) {
// //             console.error("Error fetching posts:", error);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchPosts();
// //     }, []);

// //     const handleSearch = (e) => {
// //         e.preventDefault();
// //         const query = searchQuery.toLowerCase();
// //         const filtered = posts.filter(post =>
// //             post.title.toLowerCase().includes(query)
// //         );
// //         setFilteredPosts(filtered);

// //         const params = new URLSearchParams();
// //         if (searchQuery) params.set("query", searchQuery);
// //         window.history.replaceState({}, '', `?${params.toString()}`);
// //     };

// //     return (
// //         <div>
// //             <Header />
// //             <section className="p-0">
// //                 <div className="container">
// //                     <div className="row">
// //                         <div className="col">
// //                             <h2 className="text-start d-block mt-1">
// //                                 <i className="fas fa-search"></i> Search All Articles
// //                             </h2>
// //                             <form onSubmit={handleSearch}>
// //                                 <input 
// //                                     type="text" 
// //                                     className="form-control" 
// //                                     placeholder="Search All Articles" 
// //                                     value={searchQuery}
// //                                     onChange={(e) => setSearchQuery(e.target.value)}
// //                                 />
// //                             </form>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </section>

// //             <section className="pt-4 pb-0 mt-4">
// //                 <div className="container">
// //                     <div className="row g-4">
// //                         {filteredPosts.length > 0 ? (
// //                             filteredPosts.map((post) => (
// //                                 <div className="col-sm-6 col-lg-3" key={post.id}>
// //                                     <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-all" style={{ minHeight: "100%" }}>
// //                                         <div className="ratio ratio-4x3">
// //                                             <img
// //                                                 src={post.image}
// //                                                 className="card-img-top object-fit-cover"
// //                                                 alt={post.title}
// //                                                 style={{ objectFit: "cover", width: "100%", height: "100%" }}
// //                                             />
// //                                         </div>
// //                                         <div className="card-body d-flex flex-column justify-content-between">
// //                                             <h5 className="card-title text-truncate" title={post.title}>{post.title}</h5>
// //                                             <p className="card-text text-muted mb-1" style={{ fontSize: "0.9rem" }}>
// //                                                 By {post.author} on {post.date}
// //                                             </p>
// //                                             <p className="card-text mb-0" style={{ fontSize: "0.8rem" }}>
// //                                                 <small className="text-muted">{post.views} views</small>
// //                                             </p>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             ))
// //                         ) : (
// //                             <div className="col-12 text-center py-5">
// //                                 <h3>No articles found matching your search criteria</h3>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             </section>


// //             <Footer />
// //         </div>
// //     );
// // }

// // export default Search;
// import React, { useState, useEffect } from "react";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import { useSearchParams } from "react-router-dom";
// import apiInstance from "../../utils/axios";

// function Search() {
//     const [searchParams] = useSearchParams();
//     const [searchQuery, setSearchQuery] = useState("");
//     const [posts, setPosts] = useState([]);
//     const [filteredPosts, setFilteredPosts] = useState([]);

//     const fetchPosts = async () => {
//         try {
//             const res = await apiInstance.get('post/lists/');
//             const allPosts = res?.data || [];
//             setPosts(allPosts);

//             const query = searchParams.get("query")?.toLowerCase() || "";
//             if (query) {
//                 const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query));
//                 setFilteredPosts(filtered);
//                 setSearchQuery(query);
//             } else {
//                 setFilteredPosts(allPosts);
//             }
//         } catch (error) {
//             console.error("Error fetching posts:", error);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const handleSearch = (e) => {
//         e.preventDefault();
//         const query = searchQuery.toLowerCase();
//         const filtered = posts.filter(post =>
//             post.title.toLowerCase().includes(query)
//         );
//         setFilteredPosts(filtered);

//         const params = new URLSearchParams();
//         if (searchQuery) params.set("query", searchQuery);
//         window.history.replaceState({}, '', `?${params.toString()}`);
//     };

//     return (
//         <div>
//             <Header />

//             <section className="p-0">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col">
//                             <h2 className="text-start d-block mt-1">
//                                 <i className="fas fa-search"></i> Search All Articles
//                             </h2>
//                             <form onSubmit={handleSearch}>
//                                 <input 
//                                     type="text" 
//                                     className="form-control" 
//                                     placeholder="Search All Articles" 
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                 />
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section className="pt-4 pb-0 mt-4">
//                 <div className="container">
//                     <div className="row g-4">
//                         {filteredPosts.length > 0 ? (
//                             filteredPosts.map((post) => (
//                                 <div className="col-sm-6 col-lg-3" key={post.id}>
//                                     <div className="card custom-card h-100">
//                                         <div className="ratio ratio-4x3">
//                                             <img
//                                                 src={post.image}
//                                                 className="card-img-top object-fit-cover"
//                                                 alt={post.title}
//                                             />
//                                         </div>
//                                         <div className="card-body d-flex flex-column justify-content-between">
//                                             <h5 className="card-title text-truncate" title={post.title}>
//                                                 {post.title}
//                                             </h5>
//                                             <p className="card-text text-muted mb-1" style={{ fontSize: "0.9rem" }}>
//                                                 By {post.author} on {post.date}
//                                             </p>
//                                             <p className="card-text mb-0" style={{ fontSize: "0.8rem" }}>
//                                                 <small className="text-muted">{post.views} views</small>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="col-12 text-center py-5">
//                                 <h3>No articles found matching your search criteria</h3>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </section>

//             <Footer />

//             {/* Style tag with custom CSS */}
//             <style>{`
//                 .custom-card {
//                     border: none;
//                     border-radius: 1rem;
//                     box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
//                     overflow: hidden;
//                     transition: transform 0.3s ease, box-shadow 0.3s ease;
//                 }

//                 .custom-card:hover {
//                     transform: translateY(-5px);
//                     box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
//                 }

//                 .card-title {
//                     font-size: 1rem;
//                     font-weight: 600;
//                 }

//                 .card-img-top {
//                     object-fit: cover;
//                     height: 100%;
//                     width: 100%;
//                 }

//                 .ratio {
//                     width: 100%;
//                     padding-top: 75%; /* 4:3 ratio */
//                     position: relative;
//                 }

//                 .ratio img {
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     height: 100%;
//                     width: 100%;
//                     object-fit: cover;
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default Search;
import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { useSearchParams, Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";

function Search() {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await apiInstance.get('post/lists/');
            const allPosts = res?.data || [];
            setPosts(allPosts);

            const query = searchParams.get("query")?.toLowerCase() || "";
            if (query) {
                const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query));
                setFilteredPosts(filtered);
                setSearchQuery(query);
            } else {
                setFilteredPosts(allPosts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.toLowerCase();
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(query)
        );
        setFilteredPosts(filtered);

        const params = new URLSearchParams();
        if (searchQuery) params.set("query", searchQuery);
        window.history.replaceState({}, '', `?${params.toString()}`);
    };

    return (
        <div>
            <Header />

            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h2 className="text-start d-block mt-1">
                                <i className="fas fa-search"></i> Search All Articles
                            </h2>
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search All Articles"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0 mt-4">
                <div className="container">
                    <div className="row">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <div className="col-sm-6 col-lg-3 mb-4" key={post.id}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="position-relative">
                                            <img
                                                className="card-img-top"
                                                src={post.image}
                                                alt="Card image"
                                                style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div className="card-body px-3 pt-3">
                                            <h5 className="card-title">
                                                <Link to={post.slug || "#"} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                    {post.title}
                                                </Link>
                                            </h5>

                                            <div className="d-flex gap-2 mt-2 mb-2">
                                                <button style={{ border: "none", background: "none" }}>
                                                    <i className="fas fa-bookmark text-danger"></i>
                                                </button>
                                                <button style={{ border: "none", background: "none" }}>
                                                    <i className="fas fa-thumbs-up text-primary"></i>
                                                </button>
                                            </div>

                                            <ul className="list-style-none ps-0" style={{ listStyle: "none" }}>
                                                <li>
                                                    <a href="#" className="text-dark text-decoration-none">
                                                        <i className="fas fa-user me-1"></i> {post?.profile?.full_name || "shrawosy"}
                                                    </a>
                                                </li>
                                                <li className="mt-2">
                                                    <i className="fas fa-calendar me-1"></i> <Moment format="LL">{post.date}</Moment>
                                                </li>
                                                <li className="mt-2">
                                                    <i className="fas fa-eye me-1"></i> {post?.view || 0} Views
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h3>No articles found matching your search criteria</h3>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                .card-title {
                    font-size: 1rem;
                    font-weight: 600;
                    line-height: 1.4;
                    min-height: 3rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .card {
                    transition: transform 0.2s ease, box-shadow 0.3s ease;
                    border-radius: 12px;
                }

                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                }

                .pagination .page-item.disabled .page-link {
                    cursor: not-allowed;
                    background-color: #f0f0f0;
                    border-color: #ddd;
                }

                .pagination .page-link {
                    color: #333;
                }

                .pagination .page-item.active .page-link {
                    background-color: #007bff;
                    border-color: #007bff;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}

export default Search;
