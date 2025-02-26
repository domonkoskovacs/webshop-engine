import React from "react";
import { Link } from "react-router-dom";
import {Card, CardContent} from "src/components/ui/Card";
import {Button} from "../../ui/Button";
import {useArticle} from "../../../hooks/UseArticle";
import {Trash} from "lucide-react";

interface ArticleCardProps {
    id: string;
    image: string;
    text: string;
    buttonText: string;
    buttonLink: string;
    variant?: "admin" | "storefront";
}

const ArticleCard: React.FC<ArticleCardProps> = ({image, text, buttonText, buttonLink, variant, id}) => {
    const {deleteArticle} = useArticle()
    return (
        <Card className="h-full">
            <CardContent
                className="h-full bg-cover bg-center flex flex-col justify-end p-4 sm:p-6 md:p-8"
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
                    {variant === "admin" && (
                        <Button variant="destructive" size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => deleteArticle(id)}
                        >
                            <Trash className="p-1"/>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default ArticleCard;