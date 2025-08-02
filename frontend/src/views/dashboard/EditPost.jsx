import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";

function EditPost() {
    const [post, setEditPost] = useState({ image: "", title: "", description: "", category: parseInt(""), tags: "", status: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [additionalImages, setAdditionalImages] = useState([]);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
    const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useUserData()?.user_id;
    const navigate = useNavigate();
    const param = useParams();

    const fetchPost = async () => {
        const response = await apiInstance.get(`author/dashboard/post-detail/${userId}/${param.id}/`);
        setEditPost(response.data);
        // Set initial image preview when post is fetched
        if (response.data.image) {
            setImagePreview(response.data.image);
        }
        // Set existing additional images
        if (response.data.post_images) {
            setExistingAdditionalImages(response.data.post_images);
        }
    };

    const fetchCategory = async () => {
        const response = await apiInstance.get(`post/category/list/`);
        setCategoryList(response.data);
    };
    useEffect(() => {
        fetchCategory();
        fetchPost();
    }, []);

    const handleCreatePostChange = (event) => {
        setEditPost({
            ...post,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setEditPost({
                    ...post,
                    image: {
                        file: selectedFile,
                        preview: reader.result,
                    },
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAdditionalImagesChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 0) {
            setAdditionalImages(selectedFiles);
            
            // Create previews for all selected images
            const previews = [];
            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews[index] = reader.result;
                    if (previews.length === selectedFiles.length) {
                        setAdditionalImagePreviews([...previews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeAdditionalImage = (index) => {
        const newImages = additionalImages.filter((_, i) => i !== index);
        const newPreviews = additionalImagePreviews.filter((_, i) => i !== index);
        setAdditionalImages(newImages);
        setAdditionalImagePreviews(newPreviews);
    };

    const handleCreatePost = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!post.title || !post.description) {
            Toast("error", "Title and Description are required");
            setIsLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("user_id", userId);
        formdata.append("title", post.title);
        formdata.append("description", post.description);
        formdata.append("tags", post.tags);
        formdata.append("category", post.category?.id || post.category);
        formdata.append("status", post.status);

        // Only append image if a new one is selected
        if (post.image?.file) {
            formdata.append("image", post.image.file);
        }

        // Append additional images
        additionalImages.forEach((image, index) => {
            formdata.append("additional_images", image);
        });

        try {
            const response = await apiInstance.patch(
                `author/dashboard/post-detail/${userId}/${param.id}/`, 
                formdata,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Post Updated Successfully",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate("/posts/");
                });
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.response?.data?.message || "Failed to update post. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <>
                                <section className="py-4 py-lg-6 bg-primary rounded-3">
                                    <div className="container">
                                        <div className="row">
                                            <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                                <div className="d-lg-flex align-items-center justify-content-between">
                                                    <div className="mb-4 mb-lg-0">
                                                        <h1 className="text-white mb-1">Update Blog Post</h1>
                                                        <p className="mb-0 text-white lead">Use the article builder below to update your article.</p>
                                                    </div>
                                                    <div>
                                                        <Link to="/posts/" className="btn" style={{ backgroundColor: "white" }}>
                                                            <i className="fas fa-arrow-left"></i> Back to Posts
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <form onSubmit={handleCreatePost} className="pb-8 mt-5">
                                    <div className="card mb-3">
                                        {/* Basic Info Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">Basic Information</h4>
                                        </div>
                                        <div className="card-body">
                                            <label htmlFor="postTHumbnail" className="form-label">
                                                Preview
                                            </label>
                                            <img 
                                                style={{ 
                                                    width: "100%", 
                                                    height: "330px", 
                                                    objectFit: "cover", 
                                                    borderRadius: "10px" 
                                                }} 
                                                className="mb-4" 
                                                src={imagePreview || post.image} 
                                                alt="Post preview" 
                                            />
                                            <div className="mb-3">
                                                <label htmlFor="postTHumbnail" className="form-label">
                                                    Thumbnail
                                                </label>
                                                <input onChange={handleFileChange} name="image" id="postTHumbnail" className="form-control" type="file" />
                                            </div>

                                            {/* Additional Images Section */}
                                            <div className="mb-3">
                                                <label htmlFor="additionalImages" className="form-label">
                                                    Additional Images (Optional)
                                                </label>
                                                <div className="d-flex gap-2 align-items-center">
                                                    <input 
                                                        onChange={handleAdditionalImagesChange} 
                                                        name="additionalImages" 
                                                        id="additionalImages" 
                                                        className="form-control" 
                                                        type="file" 
                                                        multiple
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary"
                                                        onClick={() => document.getElementById('additionalImages').click()}
                                                    >
                                                        <i className="fas fa-plus me-2"></i>
                                                        Add Images
                                                    </button>
                                                    <span className="text-muted">
                                                        {additionalImages.length > 0 ? `${additionalImages.length} new image(s) selected` : 'No new images selected'}
                                                    </span>
                                                </div>
                                                <small className="text-muted">You can select multiple images. These will be displayed in a gallery on the post detail page.</small>
                                            </div>

                                            {/* Existing Additional Images */}
                                            {existingAdditionalImages.length > 0 && (
                                                <div className="mb-3">
                                                    <label className="form-label">Existing Additional Images</label>
                                                    <div className="row">
                                                        {existingAdditionalImages.map((img, index) => (
                                                            <div key={index} className="col-md-3 col-sm-4 col-6 mb-2">
                                                                <img 
                                                                    src={img.image} 
                                                                    alt={`Existing image ${index + 1}`}
                                                                    className="img-fluid rounded"
                                                                    style={{ height: "120px", objectFit: "cover", width: "100%" }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <small className="text-muted">These images will be replaced if you upload new additional images.</small>
                                                </div>
                                            )}

                                            {/* Additional Images Preview */}
                                            {additionalImagePreviews.length > 0 && (
                                                <div className="mb-3">
                                                    <label className="form-label">New Additional Images Preview</label>
                                                    <div className="row">
                                                        {additionalImagePreviews.map((preview, index) => (
                                                            <div key={index} className="col-md-3 col-sm-4 col-6 mb-2">
                                                                <div className="position-relative">
                                                                    <img 
                                                                        src={preview} 
                                                                        alt={`Additional image ${index + 1}`}
                                                                        className="img-fluid rounded"
                                                                        style={{ height: "120px", objectFit: "cover", width: "100%" }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                                        style={{ margin: "2px" }}
                                                                        onClick={() => removeAdditionalImage(index)}
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input value={post?.title} onChange={handleCreatePostChange} name="title" className="form-control" type="text" placeholder="" />
                                                <small>Write a 60 character post title.</small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Posts category</label>
                                                <select name="category" value={post?.category?.id} onChange={handleCreatePostChange} className="form-select">
                                                    <option value="">-------------</option>
                                                    {categoryList?.map((c, index) => (
                                                        <option value={c?.id}>{c?.title}</option>
                                                    ))}
                                                </select>
                                                <small>Help people find your posts by choosing categories that represent your post.</small>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Post Description</label>
                                                <textarea value={post?.description} onChange={handleCreatePostChange} name="description" className="form-control" id="" cols="30" rows="10"></textarea>
                                                <small>A brief summary of your posts.</small>
                                            </div>
                                            <label className="form-label">Tags</label>
                                            <input value={post?.tags} onChange={handleCreatePostChange} name="tags" className="form-control" type="text" placeholder="health, medicine, fitness" />

                                            <div className="mb-3">
                                                <label className="form-label">Status</label>
                                                <select value={post?.status} onChange={handleCreatePostChange} name="status" className="form-select">
                                                    <option value="Active">Active</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Disabled">Disabled</option>
                                                </select>
                                                <small>Help people find your posts by choosing categories that represent your post.</small>
                                            </div>
                                        </div>
                                    </div>
                                    {isLoading === true ? (
                                        <button className="btn btn-lg btn-secondary w-100 mt-2" disabled>
                                            Updating Post... <i className="fas fa-spinner fa-spin"></i>
                                        </button>
                                    ) : (
                                        <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            Update Post <i className="fas fa-check-circle"></i>
                                        </button>
                                    )}
                                </form>
                            </>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default EditPost;
