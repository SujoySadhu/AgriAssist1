import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function Contact() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9 mx-auto text-center">
                                <h1 className="fw-bold">Contact us</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pt-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-9 mx-auto">
                                <div className="row mt-5 justify-content-center">
                                    <div className="col-sm-6 text-center mb-4">
                                        <h3>Sujoy Sadhu</h3>
                                        <p>
                                            <a href="mailto:sujoyy19@gmail.com" className="text-reset">
                                                <u>sujoyy19@gmail.com</u>
                                            </a>
                                        </p>
                                    </div>
                                    <div className="col-sm-6 text-center mb-4">
                                        <h3>Shrawosy Modak</h3>
                                        <p>
                                            <a href="mailto:shrawosymodak@gmail.com" className="text-reset">
                                                <u>shrawosymodak@gmail.com</u>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>{" "}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Contact;
