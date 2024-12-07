import React from 'react';
import {ScrollArea} from "../../components/ui/ScrollArea";

const PrivacyPolicy: React.FC = () => {
    return (
        <ScrollArea className="scroll-content h-full overflow-y-auto scrollbar-hide p-4">
            <div className="flex items-center justify-center h-full p-6">
                <div className="max-w-4xl text-left">
                    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                    <p className="mb-4">
                        At Webshop, we value your privacy and are committed to protecting your personal data. This
                        Privacy
                        Policy explains how we collect, use, and safeguard your information.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
                    <p className="mb-4">
                        We may collect the following types of information when you use our platform:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Personal details such as your name, email address, and contact information.</li>
                        <li>Order history and payment details for transactions made on our platform.</li>
                        <li>Usage data including IP addresses and browser information for analytics purposes.</li>
                    </ul>
                    <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use your data to provide and improve our services, process orders, communicate with you, and
                        ensure the security of our platform.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">3. Sharing Your Information</h2>
                    <p className="mb-4">
                        We do not sell your personal data. However, we may share information with trusted partners and
                        service providers for order processing, delivery, and analytics.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
                    <p className="mb-4">
                        We implement appropriate technical and organizational measures to safeguard your data against
                        unauthorized access, alteration, or destruction.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
                    <p className="mb-4">
                        You have the right to access, correct, or delete your personal data. Contact us at
                        contact@webshop.com to exercise these rights.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">6. Cookies</h2>
                    <p className="mb-4">
                        We use cookies to enhance your browsing experience. You can adjust your cookie preferences in
                        your
                        browser settings.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">7. Changes to This Policy</h2>
                    <p className="mb-4">
                        We reserve the right to update this Privacy Policy. Please check back periodically for updates.
                    </p>
                    <p className="mt-6">
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <br/>
                    <p>
                        Address: 1234 Thesis City, Research Street 99, Hungary
                    </p>
                    <p>
                        Email: contact@webshop.com
                    </p>
                    <p>
                        Phone: +36 1 000 0000
                    </p>
                    <p>
                        Website: www.example.com
                    </p>
                </div>
            </div>
        </ScrollArea>
    );
};

export default PrivacyPolicy;
