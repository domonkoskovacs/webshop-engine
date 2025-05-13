import React from 'react';
import { Skeleton } from '../../ui/skeleton.tsx';

interface EmptyStateProps {
    title: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title }) => (
    <div className="flex items-center justify-center flex-col space-y-3">
        <h1 className="text-center">{title}</h1>
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
);

export default EmptyState;
