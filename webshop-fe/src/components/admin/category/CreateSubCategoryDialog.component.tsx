import {FC} from "react";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "src/components/ui/Dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import SubCategoryForm from "./SubCategoryForm.component";

interface CreateSubCategoryDialogProps {
    id: string,
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CreateSubCategoryDialog: FC<CreateSubCategoryDialogProps> = ({id, isOpen, setIsOpen}) => {
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <VisuallyHidden><DialogTitle>Create a new subcategory</DialogTitle></VisuallyHidden>
            <DialogContent>
                <SubCategoryForm id={id} setIsOpen={setIsOpen}/>
                <VisuallyHidden><DialogDescription>Enter the name of the subcategory</DialogDescription></VisuallyHidden>
            </DialogContent>
        </Dialog>
    );
};

export default CreateSubCategoryDialog;
