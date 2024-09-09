import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-blue-600">Welcome to the Home Page!</h1>
            <p className="mt-4 text-xl text-gray-700">
                This is the home page of the web shop!
            </p>
        </div>
    );
};

export default Home;
