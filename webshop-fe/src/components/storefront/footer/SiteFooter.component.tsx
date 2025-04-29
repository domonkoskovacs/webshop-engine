import React from 'react';
import {Link} from 'react-router-dom';
import {usePublicStore} from "@/hooks/store/usePublicStore.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const SiteFooter: React.FC = () => {
    const {data: store} = usePublicStore()

    return (
        <div className="shrink-0 border-t border-border bg-muted p-4 text-center text-sm">
            <div className="mb-2 flex justify-center space-x-4">
                <Link to={AppPaths.ABOUT} className="hover:underline">
                    About Us
                </Link>
                <Link to={AppPaths.PRIVACY_POLICY} className="hover:underline">
                    Privacy Policy
                </Link>
                <Link to={AppPaths.TERMS} className="hover:underline">
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
