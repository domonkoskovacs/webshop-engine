import React from "react";
import {Button} from "../../ui/Button";
import {Gender} from "../../../contexts/GenderContext";

const GenderSelector: React.FC = () => {
    const [gender, setGender] = React.useState<Gender>()

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