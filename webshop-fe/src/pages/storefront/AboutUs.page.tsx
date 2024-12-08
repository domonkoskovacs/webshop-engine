import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <div className="flex items-center justify-center p-6">
            <div className="max-w-4xl text-left">
                <h1 className="text-2xl font-bold text-center">About Us</h1>
                <br/>
                <p>
                    Welcome to WebshopName, your one-stop destination for quality products and excellent service! At
                    WebshopName, we are passionate about providing a seamless online shopping experience, offering a
                    curated selection of goods to meet all your needs.
                </p>
                <br/>
                <h2 className="text-xl font-semibold">Our Mission</h2>
                <br/>
                <p>
                    Our mission is to combine convenience, affordability, and reliability into a single platform.
                    Whether you're shopping for the latest tech gadgets, trendy clothing, or everyday essentials, we
                    aim
                    to make your online shopping journey enjoyable and stress-free.
                </p>
                <br/>
                <h2 className="text-xl font-semibold">Why Choose Us?</h2>
                <br/>
                <ul className="list-disc pl-6 space-y-2">
                    <li>High-quality products sourced from trusted suppliers.</li>
                    <li>Fast and secure shipping options tailored to your location.</li>
                    <li>Dedicated customer service ready to assist you 24/7.</li>
                    <li>Exclusive deals and discounts for our loyal customers.</li>
                </ul>
                <br/>
                <h2 className="text-xl font-semibold">Disclaimer</h2>
                <br/>
                <p>
                    Please note that WebshopName is not a real, functional webshop. This website is part of a thesis
                    project created to explore the rapid development of online shopping habits and consumer
                    behavior.
                    The platform was developed using modern web technologies, including Spring for the backend and
                    React
                    for the frontend, and serves as a demonstration of my technical skills and understanding of
                    e-commerce systems.
                </p>
                <p>
                    No actual transactions are conducted through this website, and any products or services
                    mentioned
                    are purely fictional.
                </p>
                <br/>
                <h2 className="text-xl font-semibold">Contact Us</h2>
                <br/>
                <p>
                    If you have any questions or feedback about this project, feel free to reach out via
                    the <strong>Contact</strong> page. Your input is valuable in helping me refine my work and
                    further
                    develop my expertise.
                </p>
                <p>
                    Thank you for visiting WebshopName. We hope you enjoy exploring this thesis project as much as I
                    enjoyed creating it!
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
