import React from "react";
import {Button} from "../../ui/Button";
import {Gender} from "../../../shared/types";

interface GenderSelectorProps {
    gender: Gender,
    setGender: (gender: Gender) => void
}

const GenderSelector: React.FC<GenderSelectorProps> = ({gender, setGender}) => {
    return (
        <div className="flex">
            <Button
                variant="ghost"
                className={`${
                    gender === 'men' ? 'font-bold text-lg' : 'text-lg opacity-50'
                }`}
                onClick={() => setGender('men')}
            >
                Men
            </Button>
            <Button
                variant="ghost"
                className={`${
                    gender === 'women' ? 'font-bold text-lg' : 'text-lg opacity-50'
                }`}
                onClick={() => setGender('women')}
            >
                Women
            </Button>
        </div>
    );
}

export default GenderSelector