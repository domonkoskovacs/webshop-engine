import {FC} from "react";
import {Dialog, DialogContent} from "src/components/ui/Dialog";
import CategoryForm from "./category/CategoryForm.component";

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
            <DialogContent>
                <CategoryForm setIsOpen={setIsOpen}/>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryDialog;
