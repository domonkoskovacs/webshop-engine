import React, {useEffect} from "react";
import {Button} from "../../ui/Button";
import {TrashIcon} from "lucide-react";

interface ImageCardProps {
    image: File | string;
    onDelete: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({image, onDelete}) => {
    const [preview, setPreview] = React.useState<string>("");

    useEffect(() => {
        if (typeof image === "string") {
            setPreview(image);
        } else {
            const objectUrl = URL.createObjectURL(image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [image]);

    return (
        <div className="relative">
            <img
                src={preview}
                alt="uploaded"
                className="object-cover rounded border"
            />
            <Button
                variant="ghost"
                type="button"
                onClick={onDelete}
                className="absolute top-0 right-0 p-1 shadow rounded-tr-none"
            >
                <TrashIcon className="w-4 h-4 text-red-500"/>
            </Button>
        </div>
    );
};

export default ImageCard;