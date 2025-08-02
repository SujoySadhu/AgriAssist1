import React, { useState } from 'react';
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Toast from "../../plugin/Toast";
import useAxios from '../../utils/useAxios';
import { useAuthStore } from "../../store/auth";
import { useLanguage } from "../../contexts/LanguageContext";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { allUserData } = useAuthStore();
  const { t, language } = useLanguage();
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
      formData.append('language', language); // Send current language preference

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
                <h2 className="text-center mb-4">{t('plantDiseaseDetection')}</h2>
                
                <div className="text-center mb-4">
                  <p className="text-muted">
                    {t('uploadDescription')}
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
                          <h5>{t('dragDropText')}</h5>
                          <p className="text-muted">{t('supportedFormats')}</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="d-none"
                            id="imageUpload"
                          />
                          <label htmlFor="imageUpload" className="btn btn-primary mt-3">
                            {t('selectImage')}
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
                          {t('analyzing')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-microscope me-2"></i>
                          {t('analyzeImage')}
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
                            <><i className="fas fa-check-circle me-2"></i>{t('healthyPlant')}</>
                          ) : (
                            <><i className="fas fa-exclamation-circle me-2"></i>{t('diseaseDetected')}</>
                          )}
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <h5 className="text-primary">{t('plantInformation')}</h5>
                          <p className="lead">
                            <strong>{t('plant')}:</strong> {result.plant_name}
                          </p>
                          <p className="lead">
                            <strong>{t('status')}:</strong> {result.disease_name}
                          </p>
                          <p className="text-muted">
                            <strong>{t('confidence')}:</strong> {formatConfidence(result.confidence)}
                          </p>
                        </div>

                        {/* Additional Information from Gemini API */}
                        {result.additional_info && (
                          <div className="mb-4">
                            <h5 className="text-primary">
                              {result.is_healthy ? (
                                <><i className="fas fa-leaf me-2"></i>{t('careInformation')}</>
                              ) : (
                                <><i className="fas fa-info-circle me-2"></i>{t('diseaseInformation')}</>
                              )}
                            </h5>
                            
                            {result.additional_info.description && (
                              <div className="mb-3">
                                <h6 className="text-secondary">{t('description')}:</h6>
                                <p className="text-muted">{result.additional_info.description}</p>
                              </div>
                            )}

                            {result.is_healthy ? (
                              // Care tips for healthy plants
                              result.additional_info.care_tips && result.additional_info.care_tips.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="text-secondary">{t('careTips')}:</h6>
                                  <ul className="list-group list-group-flush">
                                    {result.additional_info.care_tips.map((tip, index) => (
                                      <li key={index} className="list-group-item d-flex align-items-start">
                                        <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            ) : (
                              // Remedies for diseased plants
                              result.additional_info.remedies && result.additional_info.remedies.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="text-secondary">{t('treatmentRemedies')}:</h6>
                                  <ul className="list-group list-group-flush">
                                    {result.additional_info.remedies.map((remedy, index) => (
                                      <li key={index} className="list-group-item d-flex align-items-start">
                                        <i className="fas fa-medkit text-warning me-2 mt-1"></i>
                                        <span>{remedy}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Caution messages */}
                        <div className="alert alert-warning d-flex align-items-center mb-2" role="alert">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {t('cautionMessage')}
                        </div>
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                          <i className="fas fa-info-circle me-2"></i>
                          {t('bestForTomatoPotato')}
                        </div>

                        {!result.is_healthy && (
                          <div className="alert alert-warning">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {t('expertConsultation')}
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