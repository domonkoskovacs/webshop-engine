import {FC} from "react";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "src/components/ui/Dialog";
import CategoryForm from "./CategoryForm.component";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

interface CreateCategoryDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CreateCategoryDialog: FC<CreateCategoryDialogProps> = ({isOpen, setIsOpen}) => {
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <VisuallyHidden><DialogTitle>Create a new category</DialogTitle></VisuallyHidden>
            <DialogContent>
                <CategoryForm setIsOpen={setIsOpen}/>
                <VisuallyHidden><DialogDescription>Enter the name of the category</DialogDescription></VisuallyHidden>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryDialog;
