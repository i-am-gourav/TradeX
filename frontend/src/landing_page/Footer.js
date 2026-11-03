
import React from "react";
import { Link } from "react-router-dom";


function Footer() {
    return (
        <footer className="border-top mt-5">
            <div className="container mt-5">
                <div className="row p-3">
                    {/* Logo and social links */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <Link to="/">
                            <img
                                src="/media/images/logo.svg"
                                alt="TradeX"
                                style={{ width: "150px" }}
                            />
                        </Link>

                        <p className="text-muted small mt-4">
                            © 2026 TradeX. All rights reserved.
                        </p>

                        <div className="d-flex gap-3 fs-5">
                            <a href="https://linkedin.com" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="https://instagram.com" aria-label="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://github.com" aria-label="GitHub">
                                <i className="fa-brands fa-github"></i>
                            </a>
                            <a href="https://youtube.com" aria-label="YouTube">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="fs-6 mb-3">Company</h5>
                        <ul className="list-unstyled text-muted">
                            <li className="mb-2">
                                <Link to="/about" className="footer-link">About</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/products" className="footer-link">Products</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/pricing" className="footer-link">Pricing</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/careers" className="footer-link">Careers</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="fs-6 mb-3">Support</h5>
                        <ul className="list-unstyled text-muted">
                            <li className="mb-2">
                                <Link to="/support" className="footer-link">Contact support</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/faq" className="footer-link">FAQs</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/support" className="footer-link">Help center</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="fs-6 mb-3">Resources</h5>
                        <ul className="list-unstyled text-muted">
                            <li className="mb-2">
                                <a
                                    href="https://zerodha.com/varsity/"
                                    className="footer-link"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Trading education
                                </a>
                            </li>
                            <li className="mb-2">
                                <Link to="/privacy" className="footer-link">Privacy policy</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/terms" className="footer-link">Terms and conditions</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-top p-3 mt-3">
                    <p className="text-muted small">
                        TradeX is an educational project demonstrating investing
                        interfaces and simulated trading. It is not a brokerage
                        service or financial advice.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
