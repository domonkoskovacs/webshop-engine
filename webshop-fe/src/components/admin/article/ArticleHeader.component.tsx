import {Switch} from "../../ui/Switch";
import {Label} from "../../ui/Label";
import {Button} from "../../ui/Button";
import React, {useState} from "react";
import {Sheet, SheetContent, SheetTrigger} from "../../ui/Sheet";
import ArticleForm from "./ArticleForm.component";
import {useArticle} from "../../../hooks/UseArticle";

interface ArticleHeaderProps {
    isAutoplay: boolean;
    setIsAutoplay: (open: boolean) => void;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({isAutoplay, setIsAutoplay}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const {deleteArticle} = useArticle()

    return (
        <div className="flex items-center justify-between py-2 w-full">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                    <Button variant={"destructive"} onClick={() => deleteArticle()}>Delete Slide</Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="autoplay"
                            checked={isAutoplay}
                            onCheckedChange={setIsAutoplay}/>
                    <Label htmlFor="autoplay">Autoplay</Label>
                </div>
            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetTrigger asChild>
                    <Button variant={"outline"}>Add Slide</Button>
                </SheetTrigger>
                <SheetContent>
                    <ArticleForm setIsOpen={setIsFormOpen}/>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default ArticleHeader;