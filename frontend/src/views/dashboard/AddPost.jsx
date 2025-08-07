// import React, { useEffect, useState } from "react";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import { Link, useNavigate } from "react-router-dom";

// import apiInstance from "../../utils/axios";
// import useUserData from "../../plugin/useUserData";
// import Toast from "../../plugin/Toast";
// import Swal from "sweetalert2";

// function AddPost() {
//     const [post, setCreatePost] = useState({ image: "", title: "", description: "", category: parseInt(""), tags: "", status: "" });
//     const [imagePreview, setImagePreview] = useState("");
//     const [additionalImages, setAdditionalImages] = useState([]);
//     const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
//     const [categoryList, setCategoryList] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const userId = useUserData()?.user_id;
//     const userName = useUserData()?.username;
//     const navigate = useNavigate();

//     const fetchCategory = async () => {
//         try {
//             const response = await apiInstance.get(`post/category/list/`);
//             setCategoryList(response.data);
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//             Toast("error", "Failed to load categories");
//         }
//     };

//     useEffect(() => {
//         fetchCategory();
//     }, []);

//     const handleCreatePostChange = (event) => {
//         setCreatePost({
//             ...post,
//             [event.target.name]: event.target.value,
//         });
//     };

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         if (selectedFile) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//                 setCreatePost({
//                     ...post,
//                     image: {
//                         file: selectedFile,
//                         preview: reader.result,
//                     },
//                 });
//             };
//             reader.readAsDataURL(selectedFile);
//         }
//     };

//     const handleAdditionalImagesChange = (event) => {
//         const selectedFiles = Array.from(event.target.files);
//         if (selectedFiles.length > 0) {
//             setAdditionalImages(selectedFiles);
            
//             // Create previews for all selected images
//             const previews = [];
//             selectedFiles.forEach((file, index) => {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     previews[index] = reader.result;
//                     if (previews.length === selectedFiles.length) {
//                         setAdditionalImagePreviews([...previews]);
//                     }
//                 };
//                 reader.readAsDataURL(file);
//             });
//         }
//     };

//     const removeAdditionalImage = (index) => {
//         const newImages = additionalImages.filter((_, i) => i !== index);
//         const newPreviews = additionalImagePreviews.filter((_, i) => i !== index);
//         setAdditionalImages(newImages);
//         setAdditionalImagePreviews(newPreviews);
//     };

//     const handleCreatePost = async (e) => {
//         setIsLoading(true);
//         e.preventDefault();
//         if (!post.title || !post.description || !post.image) {
//             Toast("error", "All Fields Are Required To Create A Post");
//             setIsLoading(false);
//             return;
//         }

//         const formdata = new FormData();
//         formdata.append("user_id", userId);
//         formdata.append("username", userName);
//         formdata.append("title", post.title);
//         formdata.append("image", post.image.file);
//         formdata.append("description", post.description);
//         formdata.append("tags", post.tags);
//         formdata.append("category", post.category);
//         formdata.append("status", post.status);

//         // Append additional images
//         additionalImages.forEach((image, index) => {
//             formdata.append("additional_images", image);
//         });

//         try {
//             const response = await apiInstance.post("author/dashboard/post-create/", formdata, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             Swal.fire({
//                 icon: "success",
//                 title: "Post created successfully",
//                 showConfirmButton: false,
//                 timer: 1500
//             }).then(() => {
//                 navigate("/posts/");
//             });
//         } catch (error) {
//             console.error("Error creating post:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Failed to create post",
//                 text: error.response?.data?.message || "Please try again",
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="d-flex flex-column min-vh-100">
//             <Header />
//             <div className="flex-grow-1">
//                 <section className="pt-5 pb-5">
//                     <div className="container">
//                         <div className="row mt-0 mt-md-4">
//                             <div className="col-lg-12 col-md-8 col-12">
//                                 <section className="py-4 py-lg-6 bg-primary rounded-3">
//                                     <div className="container">
//                                         <div className="row">
//                                             <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
//                                                 <div className="d-lg-flex align-items-center justify-content-between">
//                                                     <div className="mb-4 mb-lg-0">
//                                                         <h1 className="text-white mb-1">Create Blog Post</h1>
//                                                         <p className="mb-0 text-white lead">Use the article builder below to write your article.</p>
//                                                     </div>
//                                                     <div>
//                                                         <Link to="/posts/" className="btn" style={{ backgroundColor: "white" }}>
//                                                             <i className="fas fa-arrow-left"></i> Back to Posts
//                                                         </Link>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </section>
//                                 <form onSubmit={handleCreatePost} className="pb-8 mt-5">
//                                     <div className="card mb-3">
//                                         <div className="card-header border-bottom px-4 py-3">
//                                             <h4 className="mb-0">Basic Information</h4>
//                                         </div>
//                                         <div className="card-body">
//                                             <label htmlFor="postTHumbnail" className="form-label">
//                                                 Preview
//                                             </label>
//                                             <img 
//                                                 style={{ 
//                                                     width: "100%", 
//                                                     height: "400px", 
//                                                     objectFit: "cover", 
//                                                     borderRadius: "10px" 
//                                                 }} 
//                                                 className="mb-4" 
//                                                 src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"} 
//                                                 alt="Post preview" 
//                                             />
//                                             <div className="mb-3">
//                                                 <label htmlFor="postTHumbnail" className="form-label">
//                                                     Thumbnail
//                                                 </label>
//                                                 <input 
//                                                     onChange={handleFileChange} 
//                                                     name="file" 
//                                                     id="postTHumbnail" 
//                                                     className="form-control" 
//                                                     type="file" 
//                                                 />
//                                             </div>

//                                             {/* Additional Images Section */}
//                                             <div className="mb-3">
//                                                 <label htmlFor="additionalImages" className="form-label">
//                                                     Additional Images (Optional)
//                                                 </label>
//                                                 <div className="d-flex gap-2 align-items-center">
//                                                     <input 
//                                                         onChange={handleAdditionalImagesChange} 
//                                                         name="additionalImages" 
//                                                         id="additionalImages" 
//                                                         className="form-control" 
//                                                         type="file" 
//                                                         multiple
//                                                         accept="image/*"
//                                                         style={{ display: 'none' }}
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-outline-primary"
//                                                         onClick={() => document.getElementById('additionalImages').click()}
//                                                     >
//                                                         <i className="fas fa-plus me-2"></i>
//                                                         Add Images
//                                                     </button>
//                                                     <span className="text-muted">
//                                                         {additionalImages.length > 0 ? `${additionalImages.length} image(s) selected` : 'No images selected'}
//                                                     </span>
//                                                 </div>
//                                                 <small className="text-muted">You can select multiple images. These will be displayed in a gallery on the post detail page.</small>
//                                             </div>

//                                             {/* Additional Images Preview */}
//                                             {additionalImagePreviews.length > 0 && (
//                                                 <div className="mb-3">
//                                                     <label className="form-label">Additional Images Preview</label>
//                                                     <div className="row">
//                                                         {additionalImagePreviews.map((preview, index) => (
//                                                             <div key={index} className="col-md-3 col-sm-4 col-6 mb-2">
//                                                                 <div className="position-relative">
//                                                                     <img 
//                                                                         src={preview} 
//                                                                         alt={`Additional image ${index + 1}`}
//                                                                         className="img-fluid rounded"
//                                                                         style={{ height: "120px", objectFit: "cover", width: "100%" }}
//                                                                     />
//                                                                     <button
//                                                                         type="button"
//                                                                         className="btn btn-danger btn-sm position-absolute top-0 end-0"
//                                                                         style={{ margin: "2px" }}
//                                                                         onClick={() => removeAdditionalImage(index)}
//                                                                     >
//                                                                         <i className="fas fa-times"></i>
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             <div className="mb-3">
//                                                 <label className="form-label">Title</label>
//                                                 <input 
//                                                     onChange={handleCreatePostChange} 
//                                                     name="title" 
//                                                     className="form-control" 
//                                                     type="text" 
//                                                     placeholder="" 
//                                                 />
//                                                 <small>Write a 60 character post title.</small>
//                                             </div>
//                                             <div className="mb-3">
//                                                 <label className="form-label">Posts category</label>
//                                                 <select 
//                                                     name="category" 
//                                                     onChange={handleCreatePostChange} 
//                                                     className="form-select"
//                                                 >
//                                                     <option value="">-------------</option>
//                                                     {categoryList?.map((c) => (
//                                                         <option key={c.id} value={c.id}>{c.title}</option>
//                                                     ))}
//                                                 </select>
//                                                 <small>Help people find your posts by choosing categories that represent your post.</small>
//                                             </div>

//                                             <div className="mb-3">
//                                                 <label className="form-label">Post Description</label>
//                                                 <textarea 
//                                                     onChange={handleCreatePostChange} 
//                                                     name="description" 
//                                                     className="form-control" 
//                                                     cols="30" 
//                                                     rows="10"
//                                                 ></textarea>
//                                                 <small>A brief summary of your posts.</small>
//                                             </div>
//                                             <label className="form-label">Tags</label>
//                                             <input 
//                                                 onChange={handleCreatePostChange} 
//                                                 name="tags" 
//                                                 className="form-control" 
//                                                 type="text" 
//                                                 placeholder="fruit, rog, bangladesh" 
//                                             />

//                                             <div className="mb-3">
//                                                 <label className="form-label">Status</label>
//                                                 <select 
//                                                     onChange={handleCreatePostChange} 
//                                                     name="status" 
//                                                     className="form-select" 
//                                                     value={post.status}
//                                                 >
//                                                     <option value="" disabled>Select Status</option>
//                                                     <option value="Active">Active</option>
//                                                     <option value="Draft">Draft</option>
//                                                     <option value="Disabled">Disabled</option>
//                                                 </select>
//                                                 <small>Help people find your posts by choosing categories that represent your post.</small>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {isLoading ? (
//                                         <button className="btn btn-lg btn-secondary w-100 mt-2" disabled>
//                                             Creating Post... <i className="fas fa-spinner fa-spin"></i>
//                                         </button>
//                                     ) : (
//                                         <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
//                                             Create Post <i className="fas fa-check-circle"></i>
//                                         </button>
//                                     )}
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default AddPost;
import React, { useEffect, useState, useRef } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";

function AddPost() {
    // State for the main post data
    const [post, setCreatePost] = useState({
        title: "",
        description: "",
        category: "",
        status: "Draft", // Default to Draft for safety
    });

    // State for the main featured image
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // State for the additional image gallery
    const [additionalImages, setAdditionalImages] = useState([]);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
    
    // State for interactive tags
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // State for categories and loading status
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const userId = useUserData()?.user_id;
    const navigate = useNavigate();

    // Ref for the hidden file input
    const additionalImagesInputRef = useRef(null);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await apiInstance.get(`post/category/list/`);
                setCategoryList(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                Toast("error", "Failed to load categories");
            }
        };
        fetchCategory();
    }, []);

    // Handler for general input changes
    const handleCreatePostChange = (event) => {
        setCreatePost({
            ...post,
            [event.target.name]: event.target.value,
        });
    };

    // Handler for the main featured image file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handler for the additional gallery images
    const handleAdditionalImagesChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = [...additionalImages, ...files];
        setAdditionalImages(newImages);

        // Generate previews for newly added images
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
    };
    
    // Function to remove an image from the gallery
    const removeAdditionalImage = (index) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(additionalImagePreviews[index]);
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
        setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // --- Handlers for the interactive tag input ---
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim().toLowerCase())) {
                setTags([...tags, tagInput.trim().toLowerCase()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    // --- End of tag handlers ---

    // Form submission handler
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!post.title || !post.description || !image || !post.category || !post.status) {
            Toast("error", "Please fill all required fields.");
            return;
        }
        setIsLoading(true);

        const formdata = new FormData();
        formdata.append("user_id", userId);
        formdata.append("title", post.title);
        formdata.append("image", image); // The main image file
        formdata.append("description", post.description);
        formdata.append("category", post.category);
        formdata.append("status", post.status);
        formdata.append("tags", tags.join(',')); // Join tags into a comma-separated string

        // Append additional gallery images
        additionalImages.forEach((img) => {
            formdata.append("additional_images", img);
        });

        try {
            await apiInstance.post("author/dashboard/post-create/", formdata, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Post created successfully!",
                showConfirmButton: false,
                timer: 1500
            }).then(() => navigate("/posts/"));
        } catch (error) {
            console.error("Error creating post:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to create post",
                text: error.response?.data?.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
                <section className="py-5">
                    <div className="container">
                        {/* Page Header */}
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h1 className="mb-0">Create New Post</h1>
                                        <p className="mb-0 text-muted">Fill out the form below to publish your article.</p>
                                    </div>
                                    <Link to="/posts/" className="btn btn-light">
                                        <i className="fas fa-arrow-left me-2"></i>Back to Posts
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Form starts here, centered on the page */}
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <form onSubmit={handleCreatePost}>
                                    {/* Card 1: Main Content */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header">
                                            <h5 className="mb-0">Post Content</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label htmlFor="title" className="form-label">Post Title</label>
                                                <input
                                                    onChange={handleCreatePostChange}
                                                    name="title"
                                                    id="title"
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="e.g.,New disease detected"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="form-label">Description</label>
                                                <textarea
                                                    onChange={handleCreatePostChange}
                                                    name="description"
                                                    id="description"
                                                    className="form-control"
                                                    rows="8"
                                                    placeholder="Write your article content here..."
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2: Featured Image */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header">
                                            <h5 className="mb-0">Featured Image</h5>
                                        </div>
                                        <div className="card-body">
                                            <label htmlFor="postThumbnail" className="form-label">Upload a thumbnail for your post.</label>
                                            <input
                                                onChange={handleFileChange}
                                                name="file"
                                                id="postThumbnail"
                                                className="form-control"
                                                type="file"
                                                accept="image/*"
                                                required
                                            />
                                            {imagePreview && (
                                                <div className="mt-3">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Featured image preview"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Card 3: Additional Image Gallery */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header">
                                            <h5 className="mb-0">Image Gallery (Optional)</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="text-muted small">Add more images to be displayed in a gallery within your post.</p>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={() => additionalImagesInputRef.current.click()}
                                            >
                                                <i className="fas fa-plus me-2"></i>Add Images
                                            </button>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                ref={additionalImagesInputRef}
                                                onChange={handleAdditionalImagesChange}
                                            />
                                            {additionalImagePreviews.length > 0 && (
                                                <div className="mt-3 row g-2">
                                                    {additionalImagePreviews.map((preview, index) => (
                                                        <div key={index} className="col-lg-3 col-md-4 col-6">
                                                            <div className="position-relative">
                                                                <img src={preview} alt={`Gallery preview ${index + 1}`} className="img-fluid rounded" style={{ height: "120px", width: "100%", objectFit: "cover" }} />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1"
                                                                    style={{ lineHeight: 1, padding: '0.2rem 0.4rem' }}
                                                                    onClick={() => removeAdditionalImage(index)}
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    {/* Card 4: Organization */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header">
                                            <h5 className="mb-0">Organization</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label htmlFor="category" className="form-label">Category</label>
                                                <select name="category" id="category" onChange={handleCreatePostChange} className="form-select" required>
                                                    <option value="">Select a category...</option>
                                                    {categoryList?.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            {/* --- New Interactive Tag Input --- */}
                                            <div className="mb-3">
                                                <label htmlFor="tags" className="form-label">Tags</label>
                                                <div className="form-control" style={{ height: 'auto' }}>
                                                    {tags.map((tag, index) => (
                                                        <span key={index} className="badge bg-secondary me-2 mb-1">
                                                            {tag}
                                                            <button type="button" className="btn-close btn-close-white ms-1" style={{ fontSize: '0.6em' }} onClick={() => removeTag(tag)}></button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        value={tagInput}
                                                        onChange={handleTagInputChange}
                                                        onKeyDown={handleTagKeyDown}
                                                        placeholder="Add a tag and press Enter"
                                                        className="border-0 p-0 m-0"
                                                        style={{ outline: 'none', background: 'transparent' }}
                                                    />
                                                </div>
                                                <div className="form-text">Press Enter to add a new tag.</div>
                                            </div>
                                            {/* --- End of Tag Input --- */}
                                            
                                            <div>
                                                <label htmlFor="status" className="form-label">Status</label>
                                                <select name="status" id="status" onChange={handleCreatePostChange} className="form-select" value={post.status} required>
                                                    <option value="Active">Publish</option>
                                                    <option value="Draft">Save as Draft</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-lg" type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <span><i className="fas fa-spinner fa-spin me-2"></i>Creating Post...</span>
                                            ) : (
                                                <span><i className="fas fa-check-circle me-2"></i>Create Post</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default AddPost;