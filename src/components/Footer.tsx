"use client";

import React from "react";
import "../styles/Footer.css";

interface FooterProps {
  schoolName: string;
}

export default function Footer({ schoolName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <h3>{schoolName}</h3>
          <p>Empowering students with quality education and innovative learning experiences.</p>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <h4>Contact</h4>
          <p>Email: info@greenvalleyacademy.com</p>
          <p>Phone: +254 710292540</p>
          <p>Address: Nairobi, Kenya</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f">F</i></a>
            <a href="#"><i className="fab fa-twitter">T</i></a>
            <a href="#"><i className="fab fa-linkedin-in">L</i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} {schoolName}. All rights reserved.</p>
      </div>
    </footer>
  );
}