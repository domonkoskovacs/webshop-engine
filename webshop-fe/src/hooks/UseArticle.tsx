import {useContext} from "react";
import {ArticleContext} from "../contexts/ArticleContext";

export const useArticle = () => {
    const context = useContext(ArticleContext);
    if (!context) {
        throw new Error("useArticle must be used within a ArticleProvider");
    }
    return context;
};