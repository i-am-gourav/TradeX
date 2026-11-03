import React from "react";

function OpenAccount() {
    return (
        <div className="container p-5 mb-5">
            <div className="row text-center">
                <h1 className="mt-4">Open a free demat account</h1>
                <p className="text-muted mt-3">
                    Join 2+ million investors and traders on TradeX. Set up your account
                    for free and start investing today. No maintenance charges, no hidden fees.
                </p>
                <div>
                    <a
                        href="/signup"
                        className="btn btn-primary mt-3 fs-5 p-2"
                        style={{ width: "20%", minWidth: "180px" }}
                    >
                        Sign up for free
                    </a>
                </div>
            </div>
        </div>
    );
}

export default OpenAccount;
