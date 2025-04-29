import React from 'react';
import PageContent from '@/components/shared/PageContent';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageTitle from "../../components/shared/PageTitle";

const FrequentlyAskedQuestions: React.FC = () => {
    return (
        <PageContainer layout="readable" className="lg:w-1/2">
            <PageHeader variant="centered">
                <PageTitle>Frequently Asked Questions</PageTitle>
            </PageHeader>
            <PageContent>
                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How do I create an account?</AccordionTrigger>
                        <AccordionContent>
                            Click the "Sign Up" button at the top right corner of the page, fill in your details, and
                            verify
                            your email address to start using your account.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                        <AccordionContent>
                            We accept major credit and debit cards (Visa, MasterCard). Payment methods may vary based on
                            your location.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Can I track my order?</AccordionTrigger>
                        <AccordionContent>
                            Yes, once your order is shipped, you will receive a tracking number via email. You can also
                            track your order from your account dashboard under the "Orders" section.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>What is your return policy?</AccordionTrigger>
                        <AccordionContent>
                            We offer a 30-day return policy for most products. Items must be unused and in their
                            original
                            packaging.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                        <AccordionContent>
                            Click "Forgot Password" on the login page, enter your email address, and follow the
                            instructions
                            sent to your email to reset your password.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                        <AccordionContent>
                            Yes, we offer international shipping to many countries. Shipping fees and delivery times
                            vary
                            based on the destination.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger>Can I modify or cancel my order?</AccordionTrigger>
                        <AccordionContent>
                            You can modify or cancel your order within the first 24 hours of placing it. Contact our
                            support
                            team for assistance.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                        <AccordionTrigger>Do you offer discounts or promotions?</AccordionTrigger>
                        <AccordionContent>
                            Yes, we frequently offer discounts and promotions. Subscribe to our newsletter to stay
                            updated
                            on our latest deals.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-10">
                        <AccordionTrigger>What should I do if I receive a damaged item?</AccordionTrigger>
                        <AccordionContent>
                            If you receive a damaged item, please contact our support team within 7 days of delivery.
                            Provide your order number and photos of the damaged item for a resolution.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </PageContent>
        </PageContainer>
    );
};

export default FrequentlyAskedQuestions;
