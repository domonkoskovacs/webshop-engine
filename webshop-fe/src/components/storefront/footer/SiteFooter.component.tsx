import React from 'react';
import { Link } from 'react-router-dom';
import {usePublicStore} from "../../../hooks/store/usePublicStore";

const SiteFooter: React.FC = () => {
    const {data: store} = usePublicStore()

    return (
        <div className="shrink-0 border-t border-border bg-muted p-4 text-center text-sm">
            <div className="mb-2 flex justify-center space-x-4">
                <Link to="/about-us" className="hover:underline">
                    About Us
                </Link>
                <Link to="/privacy-policy" className="hover:underline">
                    Privacy Policy
                </Link>
                <Link to="/terms-and-conditions" className="hover:underline">
                    Terms and Conditions
                </Link>
            </div>
            <div className="text-muted-foreground">
                &copy; {new Date().getFullYear()} {store?.name}. All rights reserved.
            </div>
        </div>
    );
};

export default SiteFooter;
