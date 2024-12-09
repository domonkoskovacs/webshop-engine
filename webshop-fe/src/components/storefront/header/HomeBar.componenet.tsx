import React, {useState} from 'react';
import {Button} from 'src/components/ui/Button';
import {Heart, ShoppingCart} from 'lucide-react';
import {Link} from 'react-router-dom';
import DarkModeToggle from "../../ui/DarkModeToggle";
import {Gender} from "../../../shared/types";
import GenderSelector from "./GenderSelector.component";
import AccountHoverIcon from "./AccountHoverIcon.component";

const ActionsBar: React.FC = () => {
    const [gender, setGender] = useState<Gender>('men');

    return (
        <div className="flex justify-between items-center py-2 px-8">
            <GenderSelector gender={gender} setGender={setGender}/>

            <Link to="/" className="text-xl font-semibold">
                <span className="cursor-pointer">Webshop Name</span>
            </Link>

            <div className="flex space-x-3">
                <AccountHoverIcon/>
                <Button variant="ghost" size="icon">
                    <Heart/>
                </Button>
                <Button variant="ghost" size="icon">
                    <ShoppingCart/>
                </Button>
                <DarkModeToggle/>
            </div>
        </div>
    );
};

export default ActionsBar;
