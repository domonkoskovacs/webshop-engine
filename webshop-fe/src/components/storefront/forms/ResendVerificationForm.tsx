import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import React, {useEffect} from "react";
import {ApiError} from "@/shared/ApiError.ts";
import {ResultEntryReasonCodeEnum} from "@/shared/api";
import {TextInputField} from "../../ui/fields/InputField";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {useResendVerificationEmail} from "@/hooks/user/useResendVerificationEmail.ts";
import {useSearchParams} from "react-router-dom";
import {toast} from "@/hooks/useToast.ts";

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
});

const ResendVerificationEmailForm: React.FC = () => {
    const {mutateAsync: resendEmail, isPending} = useResendVerificationEmail();
    const [searchParams] = useSearchParams();
    const emailFromQuery = searchParams.get("email") ?? "";

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    });

    useEffect(() => {
        if (emailFromQuery) {
            form.setValue("email", emailFromQuery);
        }
    }, [emailFromQuery, form]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            await resendEmail(data.email);
            toast.success("Verification email sent! Please check your inbox.",);
        } catch (error) {
            if (error instanceof ApiError && error.error) {
                const errorMap = new Map(
                    error.error.map((err) => [err.reasonCode, true])
                );

                if (errorMap.get(ResultEntryReasonCodeEnum.AlreadyVerifiedUser)) {
                    form.setError("email", {
                        type: "manual",
                        message: "This email is already verified. Please use the login page to sign in.",
                    }, {shouldFocus: true});
                    return;
                }
            }

            form.setError("email", {
                type: "manual",
                message: "Failed to resend verification email. Try again.",
            });
        }
    };

    return (
        <FormCardContainer
            title="Resend Verification Email"
            description="Enter your email to receive the verification link again."
            form={form}
            formId="resend-verification-form"
            onSubmit={onSubmit}
            submitButtonText={isPending ? "Resending..." : "Resend Email"}
            submitButtonDisabled={isPending}
            singleColumn
            className="w-full"
        >
            <TextInputField
                form={form}
                name="email"
                label="Email"
                placeholder="Enter your email"
                autoComplete="email"
            />
        </FormCardContainer>
    );
};

export default ResendVerificationEmailForm;
