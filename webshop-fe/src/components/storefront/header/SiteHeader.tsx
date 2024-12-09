import React from 'react';
import {Link} from 'react-router-dom';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/Select";

const SiteHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between bg-muted py-1 px-4 text-xs">
            <div>
                <Link to="/faq" className="text-primary hover:underline">
                    FAQ
                </Link>
            </div>

            <div className="flex space-x-2">
                <Select>
                    <SelectTrigger className="h-6 border-none bg-muted">
                        <SelectValue placeholder="USD"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="h-6 border-none bg-muted">
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
