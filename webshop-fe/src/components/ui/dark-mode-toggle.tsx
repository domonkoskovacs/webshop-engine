import React from 'react';
import {Button} from "./button";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "@/hooks/useTheme.ts";

interface DarkModeToggleProps {
    className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className }) => {
    const {theme, setTheme} = useTheme()

    return (
        theme === 'dark' ?
            <Button variant="ghost" size="icon" onClick={() => setTheme("light")} >
                <Moon className={className}/>
            </Button> :
            <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
                <Sun className={className}/>
            </Button>
    );
};

export default DarkModeToggle;