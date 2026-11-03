import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="container p-5 mb-5">
            <div className="row text-center">
                <h1 className="mt-5">404 Not Found</h1>
                <p className="text-muted mt-3">
                    Sorry, the page you are looking for does not exist.
                </p>
                <div>
                    <Link to="/" className="btn btn-primary mt-3">
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
