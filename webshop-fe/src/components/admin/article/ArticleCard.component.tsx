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
        <Card className="h-full">
            <CardContent
                className="h-full bg-cover bg-center flex flex-col justify-end text-white p-4 sm:p-6 md:p-8"
                style={{backgroundImage: `url(${image})`}}>
                <div className="flex flex-col items-center justify-between">
                    <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                        {text}
                    </h2>
                    <div className="text-center mt-4">
                        <Button variant="secondary">
                            <Link to={buttonLink}>
                                {buttonText}
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ArticleCard;