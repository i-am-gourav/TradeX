
import React from "react";

function Education() {
    return (
        <div className="container mt-5 mb-5">
            <div className="row p-5 align-items-center">

                {/* Left Section - Education Image */}
                <div className="col-md-6 p-5">
                    <img
                        src="/media/images/education.svg"
                        alt="Trading Education"
                        style={{ width: "85%" }}
                    />
                </div>

                {/* Right Section - Education Content */}
                <div className="col-md-6 p-5">
                    <h2 className="fs-2 mb-4">
                        Free and open market education
                    </h2>

                    <p className="text-muted">
                        Varsity, the largest online stock market education
                        book in the world covering everything from the
                        basics to advanced trading.
                    </p>

                    <a
                        href="https://zerodha.com/varsity/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                    >
                        Varsity
                        <i className="fa-solid fa-arrow-right-long ms-2"></i>
                    </a>

                    <p className="text-muted mt-4">
                        TradingQ&A, the most active trading and investment
                        community in India for all your market related queries.
                    </p>

                    <a
                        href="https://tradingqna.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                    >
                        Trading Q&A
                        <i className="fa-solid fa-arrow-right-long ms-2"></i>
                    </a>
                </div>

            </div>
        </div>
    );
}

export default Education;
