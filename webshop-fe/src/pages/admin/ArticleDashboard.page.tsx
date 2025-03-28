import React, {useState} from 'react';
import ArticleSlider from "../../components/shared/ArticleSlider.component";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageContent from "../../components/shared/PageContent";
import {Switch} from "../../components/ui/Switch";
import {Label} from "../../components/ui/Label";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import {Button} from "../../components/ui/Button";
import ArticleForm from "../../components/admin/article/ArticleForm.component";

const ArticleDashboard: React.FC = () => {
    const [isAutoplay, setAutoplay] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <PageContainer layout="start">
            <PageHeader variant="full" className="py-2">
                <div className="flex items-center space-x-2">
                    <Switch id="autoplay"
                            checked={isAutoplay}
                            onCheckedChange={setAutoplay}/>
                    <Label htmlFor="autoplay">Autoplay</Label>
                </div>
                <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <SheetTrigger asChild>
                        <Button>Add Slide</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <ArticleForm setIsOpen={setIsFormOpen}/>
                    </SheetContent>
                </Sheet>
            </PageHeader>
            <PageContent className="w-full max-w-[70vw] sm:max-w-[90vw] md:max-w-[65vw] lg:max-w-[70vw] mx-auto">
                <ArticleSlider autoplayEnabled={isAutoplay} variant="admin"/>
            </PageContent>
        </PageContainer>
    );
};

export default ArticleDashboard;
