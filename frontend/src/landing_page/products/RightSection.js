import React from "react";

function RightSection({
    imageURL,
    productName,
    productDescription,
    learnMore,
}) {
    return (
        <div className="container mt-5 mb-5">
            <div className="row align-items-center">
                <div className="col-6 p-5">
                    <h1>{productName}</h1>
                    <p className="text-muted mt-3" style={{ lineHeight: "1.8", fontSize: "1.1em" }}>
                        {productDescription}
                    </p>
                    <div className="mt-3">
                        <a href={learnMore || "#"} style={{ textDecoration: "none" }}>
                            Learn More <i className="fa-solid fa-arrow-right-long"></i>
                        </a>
                    </div>
                </div>
                <div className="col-6 p-4 text-center">
                    <img src={imageURL} alt={productName} className="img-fluid" />
                </div>
            </div>
        </div>
    );
}

export default RightSection;
