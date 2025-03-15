import React from 'react';
import {Link} from "react-router-dom";
import {Facebook, Instagram, Twitter} from "lucide-react";
import StorefrontPageContainer from "../../components/storefront/shared/DashboardPageContainer.component";

const ContactUs: React.FC = () => {
    return (
        <StorefrontPageContainer layout="readable">
            <h1 className="text-3xl font-bold text-center mb-4">Contact Us</h1>
            <p className="text-center mb-6">
                Have a question, concern, or feedback? We're here to help. Reach out to us using the details below.
            </p>
            <div className="space-y-4">
                <p className="text-lg">
                    <strong>Address:</strong> <br/>
                    1234 Thesis City, Research Street 99, Hungary
                </p>
                <p className="text-lg">
                    <strong>Email:</strong> <br/>
                    <a href="mailto:contact@webshop.com" className="text-blue-500 hover:underline">
                        contact@webshop.com
                    </a>
                </p>
                <p className="text-lg">
                    <strong>Phone:</strong> <br/>
                    <a href="tel:+3610000000" className="text-blue-500 hover:underline">
                        +36 1 000 0000
                    </a>
                </p>
                <p className="text-lg">
                    <strong>Website:</strong> <br/>
                    <a href="http://www.example.com" target="_blank" rel="noopener noreferrer"
                       className="text-blue-500 hover:underline">
                        www.example.com
                    </a>
                </p>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Customer Support Hours</h2>
                <p>
                    Monday - Friday: 9:00 AM - 6:00 PM (CET) <br/>
                    Saturday: 10:00 AM - 4:00 PM (CET) <br/>
                    Sunday: Closed
                </p>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
                <p>
                    Stay connected with us through social media for updates, promotions, and news:
                </p>
                <div className="flex items-center space-x-4 mt-4">
                    <Link to="/" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                        <Facebook size={24}/>
                    </Link>
                    <Link to="/" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                        <Twitter size={24}/>
                    </Link>
                    <Link to="/" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                        <Instagram size={24}/>
                    </Link>
                </div>
            </div>
        </StorefrontPageContainer>
    );
};

export default ContactUs;
