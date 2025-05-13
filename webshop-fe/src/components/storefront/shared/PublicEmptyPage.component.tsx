import React from 'react';
import EmptyState from "./EmptyPage.component";
import {Link} from "react-router-dom";
import {Button} from "../../ui/button.tsx";
import {AppPaths} from "@/routing/AppPaths.ts";

interface EmptyStateWithButtonProps {
    emptyStateTitle: string;
    buttonTitle: string;
}

const PublicEmptyPage: React.FC<EmptyStateWithButtonProps> = ({emptyStateTitle, buttonTitle}) => (
    <div className="flex flex-col gap-10 sm:flex-row justify-between items-center mb-4 p-4">
        <EmptyState title={emptyStateTitle}/>
        <div>
            <h1 className="text-center text-xl">
                {buttonTitle}
            </h1>
            <div className="flex justify-center my-4">
                <Link to={{ pathname: AppPaths.AUTHENTICATION, search: '?type=login' }}>
                    <Button>
                        Log In
                    </Button>
                </Link>
            </div>
        </div>
    </div>
);

export default PublicEmptyPage;
