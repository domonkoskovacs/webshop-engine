import React from 'react';
import {Link} from "react-router-dom";
import StorefrontPageContainer from 'src/components/storefront/shared/DashboardPageContainer.component';
import {usePublicStore} from "../../hooks/UsePublicStore";

const TermsAndConditions: React.FC = () => {
    const {store} = usePublicStore()
    return (
        <StorefrontPageContainer layout="readable">
            <h1 className="text-3xl font-bold mb-4 text-center">Terms and Conditions</h1>
            <p className="mb-4">
                Welcome to {store?.name}! By accessing and using our platform, you agree to comply with the following
                terms and conditions. Please read these terms carefully before proceeding.
            </p>
            <h2 className="text-2xl font-semibold mb-2">1. Use of Our Platform</h2>
            <p className="mb-4">
                Our platform allows you to browse products, place orders, and manage your account. You agree to
                use our services only for lawful purposes and in compliance with all applicable laws and
                regulations. Any unauthorized use of our platform is strictly prohibited.
            </p>
            <h2 className="text-2xl font-semibold mb-2">2. Account Responsibilities</h2>
            <p className="mb-4">
                Users are responsible for maintaining the confidentiality of their account information,
                including passwords. You are solely responsible for all activities conducted under your account.
                Notify us immediately of any unauthorized use.
            </p>
            <h2 className="text-2xl font-semibold mb-2">3. Product Listings</h2>
            <p className="mb-4">
                We strive to provide accurate product descriptions and prices. However, errors may occur, and we
                reserve the right to correct them. Prices and availability are subject to change without notice.
            </p>
            <h2 className="text-2xl font-semibold mb-2">4. Limitation of Liability</h2>
            <p className="mb-4">
                To the fullest extent permitted by law, {store?.name} shall not be liable for any direct, indirect,
                incidental, or consequential damages arising from your use of our platform or services.
            </p>
            <h2 className="text-2xl font-semibold mb-2">5. Changes to Terms</h2>
            <p className="mb-4">
                We reserve the right to update these terms at any time. Continued use of the platform after
                changes indicates your acceptance of the revised terms.
            </p>
            <h2 className="text-2xl font-semibold mb-2">6. Governing Law</h2>
            <p className="mb-4">
                These terms shall be governed by and construed in accordance with the laws of Hungary.
            </p>
            <p className="mt-6">
                If you have any questions about these terms, please <strong><Link to="/contact"
                                                                                  className="hover:underline">contact
                us</Link></strong>.
            </p>
        </StorefrontPageContainer>
    );
};

export default TermsAndConditions;
