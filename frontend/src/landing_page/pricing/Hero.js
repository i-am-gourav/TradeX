import React from "react";

function Hero() {
    return (
        <div className="container">
            <div className="row p-5 mt-5 border-bottom text-center">
                <h1>Pricing</h1>
                <h3 className="text-muted mt-3 fs-5">
                    Free equity investments and flat ₹20 intraday and F&O trades
                </h3>
            </div>
            <div className="row p-5 mt-5 text-center">
                <div className="col-4 p-4">
                    <img
                        src="/media/images/pricingEquity.svg"
                        alt="Free equity delivery"
                        style={{ width: "70%" }}
                    />
                    <h1 className="fs-3 mt-4">Free equity delivery</h1>
                    <p className="text-muted mt-3">
                        All equity delivery investments (NSE, BSE), are absolutely
                        free — ₹ 0 brokerage.
                    </p>
                </div>
                <div className="col-4 p-4">
                    <img
                        src="/media/images/intradayTrades.svg"
                        alt="Intraday and F&O trades"
                        style={{ width: "70%" }}
                    />
                    <h1 className="fs-3 mt-4">Intraday and F&O trades</h1>
                    <p className="text-muted mt-3">
                        Flat ₹ 20 or 0.03% (whichever is lower) per executed order on
                        intraday trades across equity, currency, and commodity trades.
                        Flat ₹20 on all option trades.
                    </p>
                </div>
                <div className="col-4 p-4">
                    <img
                        src="/media/images/pricing0.svg"
                        alt="Free direct MF"
                        style={{ width: "70%" }}
                    />
                    <h1 className="fs-3 mt-4">Free direct MF</h1>
                    <p className="text-muted mt-3">
                        All direct mutual fund investments are absolutely free — ₹ 0
                        commissions & DP charges.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Hero;
