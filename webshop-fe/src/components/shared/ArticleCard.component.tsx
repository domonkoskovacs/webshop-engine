import React from "react";
import {Link} from "react-router-dom";
import {Card, CardContent} from "src/components/ui/Card";
import {Button} from "src/components/ui/Button";
import {useDeleteArticle} from "src/hooks/article/useDeleteArticle";
import {Trash} from "lucide-react";
import {toast} from "../../hooks/useToast";
import {handleGenericApiError} from "../../shared/ApiError";

interface ArticleCardProps {
    id: string;
    image: string;
    text: string;
    buttonText: string;
    buttonLink: string;
    variant?: "admin" | "storefront";
}

const ArticleCard: React.FC<ArticleCardProps> = ({
                                                     image,
                                                     text,
                                                     buttonText,
                                                     buttonLink,
                                                     variant,
                                                     id,
                                                 }) => {
    const {mutateAsync: deleteArticle, isPending} = useDeleteArticle();

    const handleDelete = async () => {
        try {
            await deleteArticle(id);
            toast.success('Article deleted successfully!');
        } catch (error) {
            handleGenericApiError(error);
        }
    };

    return (
        <Card className="h-full relative">
            <CardContent
                className="h-full bg-cover bg-center flex flex-col justify-end p-4 sm:p-6 md:p-8"
                style={{backgroundImage: `url(${image})`}}
            >
                <div className="flex flex-col items-center justify-between">
                    <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                        {text}
                    </h2>

                    <div className="text-center mt-4">
                        <Button variant="secondary" asChild>
                            <Link to={buttonLink}>{buttonText}</Link>
                        </Button>
                    </div>

                    {variant === "admin" && (
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isPending}
                            className="absolute top-2 right-2"
                            onClick={handleDelete}
                        >
                            <Trash className="w-4 h-4"/>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ArticleCard;
