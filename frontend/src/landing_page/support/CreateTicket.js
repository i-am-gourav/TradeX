import React from "react";

function CreateTicket() {
    return (
        <div className="container">
            <div className="row p-5 mt-5 mb-5">
                <h1 className="fs-2 text-muted">
                    To create a ticket, select a relevant topic
                </h1>

                {/* Account Opening */}
                <div className="col-4 p-5 mt-2 mb-2">
                    <h4 className="fs-5">
                        <i className="fa-solid fa-circle-plus me-2"></i> Account Opening
                    </h4>
                    <div className="mt-3" style={{ lineHeight: "2.2" }}>
                        <a href="#online-account" style={{ textDecoration: "none" }}>Online Account Opening</a><br />
                        <a href="#offline-account" style={{ textDecoration: "none" }}>Offline Account Opening</a><br />
                        <a href="#company-account" style={{ textDecoration: "none" }}>Company, Partnership and HUF Account</a><br />
                        <a href="#nri-account" style={{ textDecoration: "none" }}>NRI Account Opening</a><br />
                        <a href="#charges" style={{ textDecoration: "none" }}>Charges at TradeX</a><br />
                        <a href="#bank-account" style={{ textDecoration: "none" }}>TradeX 3-in-1 Account</a><br />
                        <a href="#getting-started" style={{ textDecoration: "none" }}>Getting Started</a><br />
                    </div>
                </div>

                {/* Your TradeX Account */}
                <div className="col-4 p-5 mt-2 mb-2">
                    <h4 className="fs-5">
                        <i className="fa-regular fa-user me-2"></i> Your TradeX Account
                    </h4>
                    <div className="mt-3" style={{ lineHeight: "2.2" }}>
                        <a href="#credentials" style={{ textDecoration: "none" }}>Login Credentials</a><br />
                        <a href="#modification" style={{ textDecoration: "none" }}>Account Modification and Segment Addition</a><br />
                        <a href="#dp-details" style={{ textDecoration: "none" }}>DP ID and bank details</a><br />
                        <a href="#profile" style={{ textDecoration: "none" }}>Your Profile</a><br />
                        <a href="#transfer-shares" style={{ textDecoration: "none" }}>Transfer and conversion of shares</a><br />
                    </div>
                </div>

                {/* Trading and Markets */}
                <div className="col-4 p-5 mt-2 mb-2">
                    <h4 className="fs-5">
                        <i className="fa-solid fa-chart-line me-2"></i> Trading and Markets
                    </h4>
                    <div className="mt-3" style={{ lineHeight: "2.2" }}>
                        <a href="#margins" style={{ textDecoration: "none" }}>Margin/leverage, Product and Order types</a><br />
                        <a href="#kite-web" style={{ textDecoration: "none" }}>Kite Web and Mobile</a><br />
                        <a href="#faqs" style={{ textDecoration: "none" }}>Trading FAQs</a><br />
                        <a href="#corporate-actions" style={{ textDecoration: "none" }}>Corporate Actions</a><br />
                        <a href="#sentinel" style={{ textDecoration: "none" }}>Sentinel</a><br />
                        <a href="#kite-api" style={{ textDecoration: "none" }}>Kite API</a><br />
                        <a href="#gtt" style={{ textDecoration: "none" }}>GTT</a><br />
                    </div>
                </div>

                {/* Funds */}
                <div className="col-4 p-5 mt-2 mb-2">
                    <h4 className="fs-5">
                        <i className="fa-solid fa-wallet me-2"></i> Funds
                    </h4>
                    <div className="mt-3" style={{ lineHeight: "2.2" }}>
                        <a href="#adding-funds" style={{ textDecoration: "none" }}>Adding Funds</a><br />
                        <a href="#withdrawal" style={{ textDecoration: "none" }}>Fund Withdrawal</a><br />
                        <a href="#emandates" style={{ textDecoration: "none" }}>eMandates</a><br />
                        <a href="#bank-accounts" style={{ textDecoration: "none" }}>Adding Bank Accounts</a><br />
                    </div>
                </div>

                {/* Console */}
                <div className="col-4 p-5 mt-2 mb-2">
                    <h4 className="fs-5">
                        <i className="fa-solid fa-circle-notch me-2"></i> Console
                    </h4>
                    <div className="mt-3" style={{ lineHeight: "2.2" }}>
                        <a href="#reports" style={{ textDecoration: "none" }}>Reports</a><br />
                        <a href="#ledger" style={{ textDecoration: "none" }}>Ledger</a><br />
                        <a href="#portfolio" style={{ textDecoration: "none" }}>Portfolio</a><br />
                        <a href="#challenge" style={{ textDecoration: "none" }}>60 Day Challenge</a><br />
                        <a href="#ipo" style={{ textDecoration: "none" }}>IPO</a><br />
                        <a href="#referral" style={{ textDecoration: "none" }}>Referral Program</a><br />
                    </div>
                </div>

                {/* Coin */}
                <div className="col-4 p-5 mt-2 mb-2">
                    <h4 className="fs-5">
                        <i className="fa-regular fa-circle-dot me-2"></i> Coin
                    </h4>
                    <div className="mt-3" style={{ lineHeight: "2.2" }}>
                        <a href="#understanding-mf" style={{ textDecoration: "none" }}>Understanding Mutual Funds</a><br />
                        <a href="#about-coin" style={{ textDecoration: "none" }}>About Coin</a><br />
                        <a href="#buying-selling" style={{ textDecoration: "none" }}>Buying and Selling through Coin</a><br />
                        <a href="#sip" style={{ textDecoration: "none" }}>Starting an SIP</a><br />
                        <a href="#managing-investments" style={{ textDecoration: "none" }}>Managing Investments</a><br />
                        <a href="#coin-app" style={{ textDecoration: "none" }}>Coin App</a><br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;
