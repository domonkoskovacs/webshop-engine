import React from 'react';
import {Button} from 'src/components/ui/Button';
import {Heart, ShoppingCart} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import DarkModeToggle from "../../ui/DarkModeToggle";
import GenderSelector from "./GenderSelector.component";
import AccountHoverIcon from "./AccountHoverIcon.component";

const ActionsBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-6 gap-4 sm:gap-2">
            <GenderSelector/>

            <Link to="/" className="text-xl font-semibold">
                <span className="cursor-pointer">Webshop Name</span>
            </Link>

            <div className="flex space-x-4 sm:space-x-2">
                <AccountHoverIcon/>
                <Button variant="ghost" size="icon" onClick={() => navigate("/saved")}>
                    <Heart/>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
                    <ShoppingCart/>
                </Button>
                <DarkModeToggle/>
            </div>
        </div>
    );
};

export default ActionsBar;
