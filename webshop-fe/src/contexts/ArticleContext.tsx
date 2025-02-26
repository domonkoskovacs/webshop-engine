import React, {createContext, useEffect, useState} from "react";
import {toast} from "../hooks/UseToast";
import {ArticleResponse} from "../shared/api";
import {articleService} from "../services/ArticleService";

interface ArticleContextType {
    articles: ArticleResponse[];
    create: (name: string, text: string, buttonText: string, buttonLink: string, image: File) => Promise<void>;
    deleteArticle: () => Promise<void>;
    setCurrentId: (id: string) => void;
}

export const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [currentId, setCurrentId] = useState<string>('');

    useEffect(() => {
        (async () => {
            await fetchArticles();
        })();
    }, []);


    const fetchArticles = async () => {
        try {
            const data = await articleService.getAll();
            setArticles(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't get articles. Please try again.",
            });
        }
    };

    const create = async (name: string, text: string, buttonText: string, buttonLink: string, image: File) => {
        try {
            const newArticle = await articleService.create({name, text, buttonText, buttonLink, image});
            setArticles((prev) => [...prev, newArticle]);
        } catch (error) {
            throw error
        }
    };

    const deleteArticle = async () => {
        try {
            await articleService.delete(currentId);
            setArticles((prev) => prev.filter((Article) => Article.id !== currentId));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't delete Article. Please try again.",
            });
        }
    };

    return (
        <ArticleContext.Provider
            value={{articles, create, deleteArticle, setCurrentId}}>
            {children}
        </ArticleContext.Provider>
    );
};