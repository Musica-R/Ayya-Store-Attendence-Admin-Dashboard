import React from 'react';
import '../styles/LegalPage.css';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    return (
        <div className="legal-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Terms and Conditions</h1>
            <p className="effective-date"><strong>Effective Date:</strong> 06/08/2026</p>

            <p>Welcome to the <strong>Ayya Store Mobile Application</strong> ("Application"), owned and operated by <strong>Ayya Store Supermarket</strong>. By accessing, registering, or using this Application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these Terms, you must discontinue use of the Application immediately.</p>

            <h2>1. Authorized Access</h2>
            <p>The Ayya Store Application is intended exclusively for authorized users and customers of Ayya Store Supermarket. Unauthorized access, use, or distribution of the Application is strictly prohibited.</p>

            <h2>2. User Account Responsibility</h2>
            <p>Each user is responsible for maintaining the confidentiality of their login credentials. Sharing account credentials or allowing unauthorized access to your account is prohibited.</p>

            <h2>3. Official Use</h2>
            <p>The Application is intended to provide services including product browsing, order placement, order tracking, customer profile management, notifications, promotional offers, and other services provided by Ayya Store Supermarket.</p>

            <h2>4. Accurate Information</h2>
            <p>Users must ensure that all personal, contact, delivery, and account information submitted through the Application is accurate, complete, and up to date. Providing false or misleading information may result in suspension or termination of your account.</p>

            <h2>5. Orders and Deliveries</h2>
            <p>Orders placed through the Application are subject to product availability, order confirmation, and delivery policies of Ayya Store Supermarket. The Company reserves the right to cancel or modify any order due to stock availability, pricing errors, or other operational reasons.</p>

            <h2>6. Data Privacy</h2>
            <p>Ayya Store Supermarket collects and processes user information, including personal details, order history, delivery information, payment-related information (where applicable), and application usage data solely for providing services, processing orders, customer support, business operations, and legal compliance.</p>

            <h2>7. Security</h2>
            <p>Users shall not:</p>
            <ul>
                <li>Access unauthorized information.</li>
                <li>Modify, reverse engineer, or disrupt the Application.</li>
                <li>Upload malicious software or harmful content.</li>
                <li>Misuse confidential company or customer information.</li>
                <li>Attempt to bypass security mechanisms implemented within the Application.</li>
            </ul>
            <p>Ayya Store Supermarket reserves the right to monitor system usage and investigate suspected security violations.</p>

            <h2>8. Intellectual Property</h2>
            <p>The Ayya Store Application, including its software, design, content, trademarks, logos, source code, and related intellectual property, is the exclusive property of Ayya Store Supermarket. Unauthorized reproduction, distribution, modification, or commercial use is strictly prohibited.</p>

            <h2>9. Suspension or Termination</h2>
            <p>Ayya Store Supermarket reserves the right to suspend or terminate user access without prior notice in cases of policy violations, fraudulent activities, misuse of the Application, or any activity that may harm the Company or its users.</p>

            <h2>10. Limitation of Liability</h2>
            <p>Ayya Store Supermarket shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of, or inability to use, the Application, except where required by applicable law.</p>

            <h2>11. Changes to the Terms</h2>
            <p>Ayya Store Supermarket reserves the right to modify these Terms and Conditions at any time. Continued use of the Application after such modifications constitutes acceptance of the revised Terms.</p>

            <h2>12. Governing Law</h2>
            <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India.</p>

            <h2>13. Contact Information</h2>
            <p>For any questions regarding these Terms and Conditions, users may contact our customer support team.</p>
            <p><strong>Company:</strong> Ayya Store Supermarket<br />
            <strong>Application:</strong> Ayya Store<br />
            <strong>Email:</strong> p2pswap786@gmail.com</p>

            <p className="thank-you">Thank you for choosing Ayya Store.</p>
        </div>
    );
};

export default TermsAndConditions;