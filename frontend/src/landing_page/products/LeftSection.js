import React from "react";

function LeftSection({
    imageURL,
    productName,
    productDescription,
    tryDemo,
    learnMore,
    googlePlay,
    appStore,
}) {
    return (
        <div className="container mt-5">
            <div className="row align-items-center">
                <div className="col-6 p-4 text-center">
                    <img src={imageURL} alt={productName} className="img-fluid" />
                </div>
                <div className="col-6 p-5">
                    <h1>{productName}</h1>
                    <p className="text-muted mt-3" style={{ lineHeight: "1.8", fontSize: "1.1em" }}>
                        {productDescription}
                    </p>
                    <div className="mt-3">
                        <a href={tryDemo || "#"} style={{ textDecoration: "none" }}>
                            Try Demo <i className="fa-solid fa-arrow-right-long"></i>
                        </a>
                        <a
                            href={learnMore || "#"}
                            style={{ marginLeft: "50px", textDecoration: "none" }}
                        >
                            Learn More <i className="fa-solid fa-arrow-right-long"></i>
                        </a>
                    </div>
                    <div className="mt-4">
                        <a href={googlePlay || "#"}>
                            <img
                                src="/media/images/googlePlayBadge.svg"
                                alt="Google Play"
                            />
                        </a>
                        <a href={appStore || "#"} style={{ marginLeft: "30px" }}>
                            <img
                                src="/media/images/appstoreBadge.svg"
                                alt="App Store"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSection;
