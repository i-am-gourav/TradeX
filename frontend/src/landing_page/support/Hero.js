import React from "react";

function Hero() {
    return (
        <section className="container-fluid" id="supportHero">
            <div className="p-5" id="supportWrapper">
                <h4>Support Portal</h4>
                <a href="#track-tickets">Track tickets</a>
            </div>
            <div className="row p-5 m-3">
                <div className="col-6 p-3">
                    <h1 className="fs-3 mb-4">
                        Search for an answer or browse help topics to fix issues
                    </h1>
                    <input
                        placeholder="Eg: how do i activate F&O, why is my order getting rejected ..."
                        className="form-control mb-3"
                        style={{ height: "55px", borderRadius: "4px" }}
                    />
                    <br />
                    <a href="#track-account" className="me-3">Track account opening</a>
                    <a href="#segment-activation" className="me-3">Track segment activation</a>
                    <a href="#intraday-margins" className="me-3">Intraday margins</a>
                    <a href="#kite-manual">Kite user manual</a>
                </div>
                <div className="col-6 p-3">
                    <h1 className="fs-3 mb-4">Featured</h1>
                    <ol style={{ lineHeight: "2.4" }}>
                        <li>
                            <a href="#surveillance">
                                Current Takeovers and Delisting - January 2024
                            </a>
                        </li>
                        <li>
                            <a href="#leverage">
                                Latest Intraday leverages and Square-off timings
                            </a>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    );
}

export default Hero;
