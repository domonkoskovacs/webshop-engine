import React from "react";

const DemoModeBanner: React.FC = () => {
    return (
        <div className="bg-purple-500 text-white dark:bg-purple-400 dark:text-black text-center py-2 text-sm font-semibold px-2">
            Demo Mode: No emails are sent. Users are auto-verified. No real payments processed.
        </div>
    );
};

export default DemoModeBanner;
