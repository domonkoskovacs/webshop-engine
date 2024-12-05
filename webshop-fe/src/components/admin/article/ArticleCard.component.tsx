import React from "react";
import { Link } from "react-router-dom";
import {Card, CardContent} from "src/components/ui/Card";
import {Button} from "../../ui/Button";

interface ArticleCardProps {
    image: string;
    text: string;
    buttonText: string;
    buttonLink: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({image, text, buttonText, buttonLink}) => {

    return (
        <Card className="h-64">
            <CardContent className="h-full bg-cover bg-center flex flex-col justify-between text-white p-4 sm:p-6 md:p-8"
                         style={{ backgroundImage: `url(${image})` }}>
                <div className="flex-grow flex items-center justify-center">
                    <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                        {text}
                    </h2>
                </div>

                <div className="text-center mt-4">
                    <Button variant="secondary">
                        <Link to={buttonLink}>
                            {buttonText}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ArticleCard;