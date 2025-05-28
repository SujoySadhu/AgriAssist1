import React, { useState } from 'react';
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Toast from "../../plugin/Toast";
import useAxios from '../../utils/useAxios';
import { useAuthStore } from "../../store/auth";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { allUserData } = useAuthStore();
  const api = useAxios();

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Toast("error", "Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous results
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      Toast("warning", "Please select an image first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('user_id', allUserData?.user_id);

      const response = await api.post('plant/detect-disease/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        Toast("error", response.data.error);
        return;
      }

      setResult(response.data);
      Toast("success", "Analysis completed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      let errorMessage = "Failed to analyze image";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.error || error.response.data?.detail || errorMessage;
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please try again.";
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }

      if(error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      }
      
      Toast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatConfidence = (confidence) => {
    return (confidence * 100).toFixed(2) + '%';
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Plant Disease Detection</h2>
                
                <div className="text-center mb-4">
                  <p className="text-muted">
                    Upload a clear image of your plant's affected area to detect diseases and get treatment recommendations.
                  </p>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-center">
                    <div className="upload-area p-4 border rounded-3 text-center" style={{ width: '100%', maxWidth: '500px' }}>
                      {previewUrl ? (
                        <div className="position-relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="img-fluid rounded-3 mb-3"
                            style={{ maxHeight: '300px' }}
                          />
                          <button 
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                            onClick={() => {
                              setSelectedImage(null);
                              setPreviewUrl(null);
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="p-5 border-2 border-dashed rounded-3">
                          <i className="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                          <h5>Drag & Drop or Click to Upload</h5>
                          <p className="text-muted">Supported formats: JPG, PNG (Max 5MB)</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="d-none"
                            id="imageUpload"
                          />
                          <label htmlFor="imageUpload" className="btn btn-primary mt-3">
                            Select Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {previewUrl && (
                  <div className="text-center">
                    <button 
                      className="btn btn-primary btn-lg px-5"
                      onClick={handleAnalyze}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-microscope me-2"></i>
                          Analyze Image
                        </>
                      )}
                    </button>
                  </div>
                )}

                {result && (
                  <div className="mt-5">
                    <div className={`card ${result.is_healthy ? 'border-success' : 'border-danger'}`}>
                      <div className={`card-header ${result.is_healthy ? 'bg-success' : 'bg-danger'} text-white`}>
                        <h4 className="mb-0">
                          {result.is_healthy ? (
                            <><i className="fas fa-check-circle me-2"></i>Healthy Plant</>
                          ) : (
                            <><i className="fas fa-exclamation-circle me-2"></i>Disease Detected</>
                          )}
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <h5 className="text-primary">Plant Information</h5>
                          <p className="lead">
                            <strong>Plant:</strong> {result.plant_name}
                          </p>
                          <p className="lead">
                            <strong>Status:</strong> {result.disease_name}
                          </p>
                          <p className="text-muted">
                            <strong>Confidence:</strong> {formatConfidence(result.confidence)}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-primary">Top Predictions</h5>
                          <div className="list-group">
                            {Object.entries(result.top_3_predictions).map(([disease, confidence], index) => (
                              <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                  <i className={`fas ${index === 0 ? 'fa-trophy text-warning' : 'fa-chart-line text-secondary'} me-2`}></i>
                                  {disease.split('___')[1]}
                                </span>
                                <span className="badge bg-primary rounded-pill">
                                  {formatConfidence(confidence)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!result.is_healthy && (
                          <div className="alert alert-warning">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            This plant appears to be affected by a disease. Please consult with a plant expert for proper treatment.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DiseaseDetection; 