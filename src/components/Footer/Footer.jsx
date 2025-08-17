import React from "react";
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <footer className="app-footer">
        <p className="footer-msg">
          School Governance and Operations Management |{" "}
          {/* <a href="/terms" className="footer-link">Terms of Use</a> |{""} */}
          {/* <a href="/privacy" className="footer-link">Privacy Statement</a> |{" "} */}
          <a href="https://youtu.be/dQw4w9WgXcQ?si=mC_w6S2KfhzRkoey" className="footer-link">Terms of Use</a> |{" "}
          <a href="https://youtu.be/fC7oUOUEEi4?si=bQKbY-qFa2yhORns" className="footer-link">Privacy Statement</a> |{" "}
          September 2025
        </p>
      </footer>
    </div>
  );
};

export default Footer;