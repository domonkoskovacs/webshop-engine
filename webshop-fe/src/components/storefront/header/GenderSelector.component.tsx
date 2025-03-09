import React from "react";
import {Button} from "../../ui/Button";
import {useGender} from "../../../hooks/useGender";
import {Gender} from "../../../contexts/GenderContext";
import {useNavigate} from "react-router-dom";

const GenderSelector: React.FC = () => {
    const {gender, setGender} = useGender()
    const navigate = useNavigate();

    const handleGenderChange = (newGender: Gender) => {
        setGender(newGender);
        navigate(`/`, { replace: true });
    };

    return (
        <div className="flex">
            <Button
                variant="ghost"
                className={`${
                    gender === 'men' ? 'font-bold text-lg' : 'text-lg opacity-50'
                }`}
                onClick={() => handleGenderChange('men')}
            >
                Men
            </Button>
            <Button
                variant="ghost"
                className={`${
                    gender === 'women' ? 'font-bold text-lg' : 'text-lg opacity-50'
                }`}
                onClick={() => handleGenderChange('women')}
            >
                Women
            </Button>
        </div>
    );
}

export default GenderSelector