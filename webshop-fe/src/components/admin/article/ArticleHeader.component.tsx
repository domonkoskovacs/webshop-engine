import {Search} from "lucide-react";
import {Input} from "../../ui/Input";
import {Switch} from "../../ui/Switch";
import {Label} from "../../ui/Label";
import {Button} from "../../ui/Button";
import React from "react";

const ArticleHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                    <Search className="h-5 w-5 shrink-0 opacity-50"/>
                    <Input
                        type="text"
                        placeholder="Search articles..."
                        className=" w-full max-w-xs"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="autoplay"/>
                    <Label htmlFor="autoplay">Autoplay</Label>
                </div>
            </div>
            <Button variant={"outline"}>Add Article</Button>
        </div>
    )
}

export default ArticleHeader;