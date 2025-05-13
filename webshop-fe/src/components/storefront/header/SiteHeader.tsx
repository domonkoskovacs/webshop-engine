import React from 'react';
import {Link} from 'react-router-dom';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/select.tsx";
import {AppPaths} from "@/routing/AppPaths.ts";

const SiteHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between bg-muted py-1 px-4 text-xs">
            <div>
                <Link to={AppPaths.FAQ} className="text-primary hover:underline">
                    FAQ
                </Link>
            </div>

            <div className="flex space-x-2">
                <Select>
                    <SelectTrigger size="sm" className="text-xs border-none bg-muted shadow-none">
                        <SelectValue placeholder="USD"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger size="sm" className="text-xs border-none bg-muted shadow-none">
                        <SelectValue placeholder="EN"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">EN</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default SiteHeader;
