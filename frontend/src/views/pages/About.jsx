import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function About() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="pt-4 pb-0">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-9 mx-auto">
                                <h2>About Us</h2>
                                <p className="lead">
                                    We are two students from the Department of Computer Science and Engineering (CSE) at KUET, 
                                    and we have developed this website to support and empower the agricultural community.
                                </p>
                                <p>
                                    Our goal is to bridge the digital gap in farming by offering practical tools such as 
                                    AI-powered plant disease detection, an interactive blogging/forum system, and instant 
                                    Bengali-language chatbot assistance — all in a farmer-friendly, accessible platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default About;
