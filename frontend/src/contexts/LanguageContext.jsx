import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Translations
const translations = {
  en: {
    // Navigation
    home: "Home",
    category: "Category",
    aiTools:"AI Tools",
    agriAssist: "AgriAssist",
    pages: "Pages",
    about: "About",
    contact: "Contact",
    diseaseDetection: "Disease Detection",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    profile: "Profile",
    user: "User",
    search: "Search",
    searchPlaceholder: "Search Articles...",
    menu: "Menu",
    createPost: "Create Post",
    
    // Disease Detection
    plantDiseaseDetection: "Plant Disease Detection",
    uploadDescription: "Upload a clear image of your plant's leaf to detect diseases and get treatment recommendations.",
    dragDropText: "Drag & Drop or Click to Upload",
    supportedFormats: "Supported formats: JPG, PNG (Max 5MB)",
    selectImage: "Select Image",
    analyzeImage: "Analyze Image",
    analyzing: "Analyzing...",
    healthyPlant: "Healthy Plant",
    diseaseDetected: "Disease Detected",
    plantInformation: "Plant Information",
    plant: "Plant",
    status: "Status",
    confidence: "Confidence",
    careInformation: "Care Information",
    diseaseInformation: "Disease Information",
    description: "Description",
    careTips: "Care Tips",
    treatmentRemedies: "Treatment Remedies",
    cautionMessage: "This AI system can sometimes make mistakes. Please consult an agricultural expert for final decisions.",
    bestForTomatoPotato: "This system works best for detecting diseases in tomatoes and potatoes.",
    expertConsultation: "This plant appears to be affected by a disease. Please consult with a plant expert for proper treatment.",
    
    // Auth
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
    signIn: "Sign In",
    signUp: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    fullName: "Full Name",
    allFieldsRequired: "All fields are required",
    passwordsDoNotMatch: "Passwords do not match",
    passwordMinLength: "Password must be at least 8 characters",
    accountCreatedSuccess: "Account Created Successfully!",
    accountVerifiedMessage: "Your account has been verified. Please login to continue.",
    registrationSuccess: "Registration successful! Please login.",
    verificationFailed: "Verification failed",
    anErrorOccurred: "An error occurred. Please try again.",
    enterOTP: "Enter OTP",
    verifyEmail: "Verify Email",
    resendOTP: "Resend OTP",
    backToLogin: "Back to Login",
    loggedOut: "You have been logged out",
    thanksForVisiting: "Thanks for visiting our website, come back anytime!",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    submit: "Submit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    open: "Open",
    yes: "Yes",
    no: "No",
    ok: "OK",
    
    // Language Switcher
    language: "Language",
    english: "English",
    bangla: "বাংলা",

    // Search page translations
    searchArticles: "Search Articles",
    searchSubtitle: "Search through article titles and descriptions",
    searching: "Searching...",
    foundResults: "Found {count} results",
    searchingFor: "Searching for:",
    readMore: "Read More",
    anonymous: "Anonymous",
    views: "views",
    noResultsFound: "No results found",
    tryAdjustingSearch: "Try adjusting your search terms",
    searchSuggestions: "Try searching for:",
    agriculture: "Agriculture",
    farming: "Farming",
    crops: "Crops",
    fertilizer: "Fertilizer",
    trendingPosts: "Trending Posts",
    latestPosts: "Latest Posts",
    popularArticles: "Popular Articles",
    recentArticles: "Recent Articles",
    featuredPosts: "Featured Posts",
    topArticles: "Top Articles",
    mostViewed: "Most Viewed",
    newestFirst: "Newest First",
    allCategories: "All Categories",
    filterByCategory: "Filter by Category",
    sortBy: "Sort By",
    relevance: "Relevance",
    date: "Date",
    popularity: "Popularity",
    clearFilters: "Clear Filters",
    applyFilters: "Apply Filters",
    page: "Page",
    of: "of",
    showing: "Showing",
    to: "to",
    entries: "entries",
    noData: "No data available",
    
    // Category page translations
    categories: "Categories",
    searchCategories: "Search categories...",
    searchPostsInCategory: "Search posts in this category...",
    posts: "posts",
    found: "found",
    backToCategories: "Back to Categories",
    selectCategory: "Select a Category",
    selectCategoryToViewPosts: "Select a category to view its posts",
    noPostsFound: "No posts found",
    noPostsInCategory: "No posts in this category",
    selectAnotherCategory: "Select another category or try different search terms",
    //Add post 
     createNewPost: "Create New Post",
    fillFormToPublish: "Fill out the form below to publish your article.",
    backToPosts: "Back to Posts",
    postContent: "Post Content",
    postTitle: "Post Title *",
    descriptionLabel: "Description *",
    writeArticlePlaceholder: "Write your article content here...",
    featuredImage: "Featured Image *",
    uploadThumbnail: "Upload a thumbnail for your post.",
    imageGallery: "Image Gallery (Optional)",
    galleryDescription: "Add more images to be displayed in a gallery within your post.",
    addImages: "Add Images",
    organization: "Organization",
    categoryLabel: "Category *",
    selectCategoryPlaceholder: "Select a category...",
    tagsLabel: "Tags",
    tagsPlaceholder: "Add a tag and press Enter",
    tagsHint: "Press Enter to add a new tag",
    statusLabel: "Status *",
    publish: "Publish",
    saveAsDraft: "Save as Draft",
    draftNotice: "Draft posts won't be visible to the public",
    creatingPost: "Creating Post...",
    createPostButton: "Create Post",
    //My Account
    user: "User",
    failedLoadDashboard: "Failed to load dashboard data",
    adminOptions: "Admin Options",
    docProcessing: "Document Processing",
    docProcessingDesc: "Upload and process Word documents for the chatbot knowledge base.",
    uploadDocument: "Upload Document",
    userManagement: "User Management",
    userManagementDesc: "Manage user accounts, permissions, and roles.",
    manageUsers: "Manage Users",
    userManagementComing: "User management feature coming soon!",
    totalViews: "Total Views",
    posts: "Posts",
    likes: "Likes",
    bookmarks: "Bookmarks",
    latestPosts: "Latest Posts",
    viewAll: "View All",
    views: "views",
    noPostsFound: "No posts found",
    createFirstPost: "Create Your First Post",
    notifications: "Notifications",
    noNotifications: "No notifications yet",
    notificationLike: "Someone liked your post \"{title}\"",
    notificationComment: "New comment on \"{title}\"",
    notificationBookmark: "Your post \"{title}\" was bookmarked",
    active: "Active",
    draft: "Draft",
    selectDocFile: "Please select a Word document.",
    processingDoc: "Processing...",
    docProcessedSuccess: "Document processed and saved to vector store!",
    docProcessError: "Error processing document.",
    processDocTitle: "Process Word Document",
    cancel: "Cancel",
    processDocument: "Process Document",
    like: "Like",
    comment: "Comment",
    bookmark: "Bookmark",
      fillRequiredFields: "Please fill all required fields",
    titleRequired: "Post title is required",
    descriptionRequired: "Description is required",
    imageRequired: "Featured image is required",
    categoryRequired: "Category is required",
    statusRequired: "Status is required",
  },
  bn: {
    // Navigation
    home: "হোম",
    category: "বিভাগ",
    aiTools:"এ আই টুলস",
    agriAssist: "কৃষি সহায়ক",
    pages: "পৃষ্ঠাসমূহ",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    diseaseDetection: "রোগ শনাক্তকরণ",
    login: "লগইন",
    register: "নিবন্ধন",
    logout: "লগআউট",
    dashboard: "ড্যাশবোর্ড",
    profile: "প্রোফাইল",
    user: "ব্যবহারকারী",
    search: "অনুসন্ধান",
    searchPlaceholder: "নিবন্ধ অনুসন্ধান...",
    menu: "মেনু",
    createPost: "নিবন্ধ তৈরি করুন",
    
    // Disease Detection
    plantDiseaseDetection: "উদ্ভিদ রোগ শনাক্তকরণ",
    uploadDescription: "রোগ শনাক্তকরণ এবং চিকিৎসার পরামর্শ পেতে আপনার উদ্ভিদের পাতার একটি স্পষ্ট ছবি আপলোড করুন।",
    dragDropText: "টেনে আনুন বা আপলোড করতে ক্লিক করুন",
    supportedFormats: "সমর্থিত ফরম্যাট: JPG, PNG (সর্বোচ্চ ৫MB)",
    selectImage: "ছবি নির্বাচন করুন",
    analyzeImage: "ছবি বিশ্লেষণ করুন",
    analyzing: "বিশ্লেষণ হচ্ছে...",
    healthyPlant: "সুস্থ উদ্ভিদ",
    diseaseDetected: "রোগ শনাক্ত হয়েছে",
    plantInformation: "উদ্ভিদের তথ্য",
    plant: "উদ্ভিদ",
    status: "অবস্থা",
    confidence: "আত্মবিশ্বাস",
    careInformation: "যত্নের তথ্য",
    diseaseInformation: "রোগের তথ্য",
    description: "বিবরণ",
    careTips: "যত্নের পরামর্শ",
    treatmentRemedies: "চিকিৎসার প্রতিকার",
    cautionMessage: "এই এআই সিস্টেমটি মাঝে মাঝে ভুল করতে পারে। চূড়ান্ত সিদ্ধান্তের জন্য একজন কৃষি বিশেষজ্ঞের পরামর্শ নিন।",
    bestForTomatoPotato: "এই সিস্টেমটি টমেটো ও আলুর রোগ শনাক্তকরণে সবচেয়ে ভালো কাজ করে।",
    expertConsultation: "এই উদ্ভিদটি রোগে আক্রান্ত বলে মনে হচ্ছে। সঠিক চিকিৎসার জন্য একজন উদ্ভিদ বিশেষজ্ঞের সাথে পরামর্শ করুন।",
    
    // Auth
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    rememberMe: "আমাকে মনে রাখুন",
    signIn: "সাইন ইন",
    signUp: "সাইন আপ",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    dontHaveAccount: "অ্যাকাউন্ট নেই?",
    fullName: "পূর্ণ নাম",
    allFieldsRequired: "সব ক্ষেত্রগুলি প্রয়োজন",
    passwordsDoNotMatch: "পাসওয়ার্ড মেলে না",
    passwordMinLength: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে",
    accountCreatedSuccess: "অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে!",
    accountVerifiedMessage: "আপনার অ্যাকাউন্টটি যাচাই করা হয়েছে। অনুগ্রহ করে লগইন করে চালিয়ে যান।",
    registrationSuccess: "নিবন্ধন সফলভাবে হয়েছে! অনুগ্রহ করে লগইন করুন।",
    verificationFailed: "যাচাই ব্যর্থ",
    anErrorOccurred: "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পরবর্তীতে চেষ্টা করুন।",
    enterOTP: "OTP লিখুন",
    verifyEmail: "ইমেইল যাচাই করুন",
    resendOTP: "OTP পুনরায় পাঠান",
    backToLogin: "লগইনে ফেরত যান",
    loggedOut: "আপনি লগআউট করেছেন",
    thanksForVisiting: "আমাদের ওয়েবসাইটে আপনার ভ্রমণের জন্য ধন্যবাদ, যাতে আবার আসতে পারেন!",
    
    // Common
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    success: "সফল",
    warning: "সতর্কতা",
    info: "তথ্য",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    submit: "জমা দিন",
    back: "পিছনে",
    next: "পরবর্তী",
    previous: "পূর্ববর্তী",
    close: "বন্ধ",
    open: "খুলুন",
    yes: "হ্যাঁ",
    no: "না",
    ok: "ঠিক আছে",
    
    // Language Switcher
    language: "ভাষা",
    english: "English",
    bangla: "বাংলা",

    // Search page translations
    searchArticles: "নিবন্ধ অনুসন্ধান",
    searchSubtitle: "নিবন্ধের শিরোনাম এবং বিবরণ অনুসন্ধান করুন",
    searching: "অনুসন্ধান করা হচ্ছে...",
    foundResults: "{count}টি ফলাফল পাওয়া গেছে",
    searchingFor: "অনুসন্ধান করা হচ্ছে:",
    readMore: "আরও পড়ুন",
    anonymous: "অজ্ঞাত",
    views: "দর্শন",
    noResultsFound: "কোন ফলাফল পাওয়া যায়নি",
    tryAdjustingSearch: "আপনার অনুসন্ধানের শব্দগুলি পরিবর্তন করে দেখুন",
    searchSuggestions: "এই শব্দগুলি দিয়ে অনুসন্ধান করুন:",
    agriculture: "কৃষি",
    farming: "চাষাবাদ",
    crops: "ফসল",
    fertilizer: "সার",
    trendingPosts: "জনপ্রিয় পোস্ট",
    latestPosts: "সর্বশেষ পোস্ট",
    popularArticles: "জনপ্রিয় নিবন্ধ",
    recentArticles: "সাম্প্রতিক নিবন্ধ",
    featuredPosts: "বৈশিষ্ট্যযুক্ত পোস্ট",
    topArticles: "শীর্ষ নিবন্ধ",
    mostViewed: "সবচেয়ে বেশি দেখা",
    newestFirst: "নতুন প্রথম",
    allCategories: "সব বিভাগ",
    filterByCategory: "বিভাগ অনুযায়ী ফিল্টার করুন",
    sortBy: "সাজান",
    relevance: "প্রাসঙ্গিকতা",
    date: "তারিখ",
    popularity: "জনপ্রিয়তা",
    clearFilters: "ফিল্টার মুছুন",
    applyFilters: "ফিল্টার প্রয়োগ করুন",
    page: "পৃষ্ঠা",
    of: "এর",
    showing: "দেখানো হচ্ছে",
    to: "থেকে",
    entries: "এন্ট্রি",
    noData: "কোন ডেটা নেই",
    
    // Category page translations
    categories: "বিভাগসমূহ",
    searchCategories: "বিভাগ অনুসন্ধান করুন...",
    searchPostsInCategory: "এই বিভাগে পোস্ট অনুসন্ধান করুন...",
    posts: "পোস্ট",
    found: "পাওয়া গেছে",
    backToCategories: "বিভাগে ফিরে যান",
    selectCategory: "একটি বিভাগ নির্বাচন করুন",
    selectCategoryToViewPosts: "পোস্ট দেখতে একটি বিভাগ নির্বাচন করুন",
    noPostsFound: "কোন পোস্ট পাওয়া যায়নি",
    noPostsInCategory: "এই বিভাগে কোন পোস্ট নেই",
    selectAnotherCategory: "অন্য একটি বিভাগ নির্বাচন করুন বা ভিন্ন অনুসন্ধানের শব্দ ব্যবহার করুন",
    //add post 
    createNewPost: "নতুন পোস্ট তৈরি করুন",
    fillFormToPublish: "আপনার নিবন্ধ প্রকাশ করতে নীচের ফর্মটি পূরণ করুন।",
    backToPosts: "পোস্টে ফিরে যান",
    postContent: "পোস্ট বিষয়বস্তু",
    postTitle: "পোস্ট শিরোনাম *",
    descriptionLabel: "বিবরণ *",
    writeArticlePlaceholder: "আপনার নিবন্ধের বিষয়বস্তু এখানে লিখুন...",
    featuredImage: "প্রধান ছবি *",
    uploadThumbnail: "আপনার পোস্টের জন্য একটি থাম্বনেইল আপলোড করুন।",
    imageGallery: "ছবির গ্যালারি (ঐচ্ছিক)",
    galleryDescription: "আপনার পোস্টের মধ্যে একটি গ্যালারিতে প্রদর্শনের জন্য আরও ছবি যোগ করুন।",
    addImages: "ছবি যোগ করুন",
    organization: "সংগঠন",
    categoryLabel: "বিভাগ *",
    selectCategoryPlaceholder: "একটি বিভাগ নির্বাচন করুন...",
    tagsLabel: "ট্যাগ",
    tagsPlaceholder: "একটি ট্যাগ যোগ করুন এবং এন্টার চাপুন",
    tagsHint: "নতুন ট্যাগ যোগ করতে এন্টার চাপুন",
    statusLabel: "অবস্থা *",
    publish: "প্রকাশ করুন",
    saveAsDraft: "খসড়া হিসাবে সংরক্ষণ করুন",
    draftNotice: "খসড়া পোস্টগুলি জনসাধারণের কাছে দৃশ্যমান হবে না",
    creatingPost: "পোস্ট তৈরি হচ্ছে...",
    createPostButton: "পোস্ট তৈরি করুন",
    //My Account 
    user: "ব্যবহারকারী",
    failedLoadDashboard: "ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ হয়েছে",
    adminOptions: "অ্যাডমিন অপশন",
    docProcessing: "ডকুমেন্ট প্রসেসিং",
    docProcessingDesc: "চ্যাটবট জ্ঞানভাণ্ডারের জন্য ওয়ার্ড ডকুমেন্ট আপলোড এবং প্রক্রিয়া করুন।",
    uploadDocument: "ডকুমেন্ট আপলোড",
    userManagement: "ব্যবহারকারী ব্যবস্থাপনা",
    userManagementDesc: "ব্যবহারকারী অ্যাকাউন্ট, অনুমতি এবং ভূমিকা পরিচালনা করুন।",
    manageUsers: "ব্যবহারকারী ব্যবস্থাপনা",
    userManagementComing: "ব্যবহারকারী ব্যবস্থাপনা বৈশিষ্ট্য শীঘ্রই আসছে!",
    totalViews: "মোট দেখা",
    posts: "পোস্ট",
    likes: "লাইক",
    bookmarks: "বুকমার্ক",
    latestPosts: "সর্বশেষ পোস্ট",
    viewAll: "সব দেখুন",
    views: "দর্শন",
    noPostsFound: "কোন পোস্ট পাওয়া যায়নি",
    createFirstPost: "আপনার প্রথম পোস্ট তৈরি করুন",
    notifications: "বিজ্ঞপ্তি",
    noNotifications: "এখনও কোন বিজ্ঞপ্তি নেই",
    notificationLike: "কেউ আপনার পোস্ট \"{title}\" লাইক করেছে",
    notificationComment: "নতুন মন্তব্য \"{title}\" পোস্টে",
    notificationBookmark: "আপনার পোস্ট \"{title}\" বুকমার্ক করা হয়েছে",
    active: "সক্রিয়",
    draft: "খসড়া",
    selectDocFile: "অনুগ্রহ করে একটি ওয়ার্ড ডকুমেন্ট নির্বাচন করুন।",
    processingDoc: "প্রক্রিয়াকরণ হচ্ছে...",
    docProcessedSuccess: "ডকুমেন্ট সফলভাবে প্রক্রিয়াকরণ করা হয়েছে এবং ভেক্টর স্টোরে সংরক্ষণ করা হয়েছে!",
    docProcessError: "ডকুমেন্ট প্রসেস করতে ত্রুটি হয়েছে।",
    processDocTitle: "ওয়ার্ড ডকুমেন্ট প্রসেস করুন",
    cancel: "বাতিল",
    processDocument: "ডকুমেন্ট প্রসেস করুন",
    like: "লাইক",
    comment: "মন্তব্য",
    bookmark: "বুকমার্ক",
    fillRequiredFields: "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
    titleRequired: "পোস্ট শিরোনাম প্রয়োজন",
    descriptionRequired: "বিবরণ প্রয়োজন",
    imageRequired: "প্রধান ছবি প্রয়োজন",
    categoryRequired: "বিভাগ প্রয়োজন",
    statusRequired: "অবস্থা প্রয়োজন",
  }
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'en' || newLanguage === 'bn') {
      setLanguage(newLanguage);
    }
  };

  // Get translation function
  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    
    // Replace placeholders with actual values
    Object.keys(params).forEach(param => {
      const placeholder = `{${param}}`;
      translation = translation.replace(new RegExp(placeholder, 'g'), params[param]);
    });
    
    // Handle special case for foundResults with count
    if (key === 'foundResults' && params.count !== undefined) {
      const count = params.count;
      if (language === 'en') {
        translation = `Found ${count} result${count !== 1 ? 's' : ''}`;
      } else {
        translation = `${count}টি ফলাফল পাওয়া গেছে`;
      }
    }
    
    return translation;
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 