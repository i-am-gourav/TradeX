
import React from "react";
import "./Pricing.css";

function Pricing() {
    return (
        <div className="container mt-5">
            {/* Heading */}
            <div className="text-center mb-5">
                <h1 className="fs-2">Pricing</h1>
                <p className="text-muted">
                    Free equity investments and flat ₹20 intraday and F&O trades.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="row text-center mt-5">
                <div className="col-md-4 p-4">
                    <img
                        src="/media/images/pricing0.svg"
                        alt="Free equity delivery"
                        className="pricing-img mb-4"
                    />
                    <h2 className="fs-4">Free equity delivery</h2>
                    <p className="text-muted">
                        All equity delivery investments (NSE, BSE) are absolutely free —
                        ₹0 brokerage.
                    </p>
                </div>

                <div className="col-md-4 p-4">
                    <img
                        src="/media/images/pricingEquity.svg"
                        alt="Intraday trading"
                        className="pricing-img mb-4"
                    />
                    <h2 className="fs-4">Intraday and F&O trades</h2>
                    <p className="text-muted">
                        Flat ₹20 or 0.03% (whichever is lower) per executed order
                        for intraday and F&O trades.
                    </p>
                </div>

                <div className="col-md-4 p-4">
                    <img
                        src="/media/images/pricingMF.svg"
                        alt="Mutual funds"
                        className="pricing-img mb-4"
                    />
                    <h2 className="fs-4">Free direct mutual funds</h2>
                    <p className="text-muted">
                        All direct mutual fund investments are completely free,
                        with no commission or brokerage.
                    </p>
                </div>
            </div>

            {/* Additional Information */}
            <div className="text-center mt-5 mb-5">
                <h2 className="fs-4">Open a TradeX account for free</h2>
                <p className="text-muted">
                    Start investing with a simple and transparent pricing structure.
                </p>
                <a href="/signup" className="btn btn-primary mt-2">
                    Sign up now
                </a>
            </div>
        </div>
    );
}

export default Pricing;
