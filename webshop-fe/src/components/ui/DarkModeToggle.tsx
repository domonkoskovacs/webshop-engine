import React from 'react';
import {Button} from "./Button";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "src/contexts/theme-provider";

const DarkModeToggle: React.FC = () => {
    const {theme, setTheme} = useTheme()

    return (
        theme === 'dark' ?
            <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
                <Moon/>
            </Button> :
            <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
                <Sun/>
            </Button>
    );
};

export default DarkModeToggle;