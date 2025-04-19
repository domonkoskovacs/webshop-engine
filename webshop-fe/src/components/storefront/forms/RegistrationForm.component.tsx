import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import React from "react";
import {toast, unexpectedErrorToast} from "../../../hooks/useToast";
import {Link, useNavigate} from "react-router-dom";
import {ApiError} from "../../../shared/ApiError";
import {RegistrationRequestGenderEnum, ResultEntryReasonCodeEnum} from "../../../shared/api";
import {TextInputField} from "../../ui/fields/InputField";
import {SwitchField} from "../../ui/fields/SwitchField";
import {RadioGroupField} from "../../ui/fields/RadioGroupField";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {useRegister} from "../../../hooks/user/useRegister";
import {AppPaths} from "../../../routing/AppPaths";

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    firstname: z.string().min(1, {
        message: "Please add your firstname."
    }),
    lastname: z.string().min(1, {
        message: "Please add your lastname."
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    passwordAgain: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    phoneNumber: z.string().min(1, {
        message: "Please add your phone number.",
    }),
    gender: z.enum(["men", "women"], {
        required_error: "You need to select your gender.",
    }).optional(),
    subscribe: z.boolean().default(false).optional(),
    privacyPolicy: z.boolean().default(false).refine(value => value, {
        message: "You must accept the privacy policy.",
    }),
    termsAndConditions: z.boolean().default(false).refine(value => value, {
        message: "You must accept the terms and conditions.",
    }),
}).refine((data) => data.password === data.passwordAgain, {
    path: ["passwordAgain"],
    message: "Passwords do not match",
});

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate()
    const {mutateAsync: register, isPending} = useRegister();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            passwordAgain: "",
            phoneNumber: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await register({
                registrationRequest: {
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    password: data.password,
                    phoneNumber: data.phoneNumber,
                    subscribedToEmail: data.subscribe,
                    gender: data.gender === "men"
                        ? RegistrationRequestGenderEnum.Male
                        : data.gender === "women"
                            ? RegistrationRequestGenderEnum.Female
                            : undefined,
                },
            });
            toast.success("Successful registration.")
            navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } catch
            (error) {
            if (error instanceof ApiError && error.error) {
                const errorMap = new Map(
                    error.error.map(err => [err.reasonCode, true])
                );

                if (errorMap.get(ResultEntryReasonCodeEnum.EmailTaken)) {
                    form.setError("email", {
                        type: "manual",
                        message: "Email is already taken. Please try again."
                    }, {shouldFocus: true});
                }
            } else {
                unexpectedErrorToast()
            }
        }
    }

    return <FormCardContainer title="Registration"
                              description="Please fill the form with your data to register."
                              form={form}
                              formId="register-form"
                              onSubmit={onSubmit}
                              submitButtonText={isPending ? "Registering..." : "Register"}
                              submitButtonDisabled={isPending}
                              singleColumn={false}
                              className="w-full">
        <div className="flex flex-col justify-between gap-2">
            <TextInputField form={form} name="email" label="Email"
                            placeholder="Please enter your email" autoComplete="email"/>
            <TextInputField form={form} name="firstname" label="Firstname"
                            placeholder="Please enter your firstname" autoComplete="given-name"/>
            <TextInputField form={form} name="lastname" label="Lastname"
                            placeholder="Please enter your lastname" autoComplete="family-name"/>
            <TextInputField form={form} name="password" label="Password"
                            placeholder="*****"
                            type="password" autoComplete="new-password"/>
            <TextInputField form={form} name="passwordAgain" label="Password Again"
                            placeholder="*****"
                            type="password" autoComplete="new-password"/>
            <TextInputField form={form} name="phoneNumber" label="Phone number"
                            placeholder="Please enter your phone number" autoComplete="tel"/>
        </div>
        <div className="flex flex-col justify-between gap-2">
            <RadioGroupField form={form} name="gender" label="What type of clothes do we recommend for you?"
                             options={[{value: "men", label: "Men"}, {value: "women", label: "Women"}]}/>
            <SwitchField form={form} name="subscribe" label="Marketing emails"
                         description="Receive emails about new products, features, and more. If you don't accept this you will still get emails based on your orders."/>
            <SwitchField form={form} name="privacyPolicy"
                         label={<Link to={AppPaths.PRIVACY_POLICY}>Privacy Policy</Link>}
                         description={<>Accept the <Link to={AppPaths.PRIVACY_POLICY}>privacy policy</Link>.</>}/>
            <SwitchField form={form} name="termsAndConditions"
                         label={<Link to={AppPaths.TERMS}>Terms and Conditions</Link>}
                         description={<>Accept the <Link to={AppPaths.TERMS}>terms and
                             conditions</Link>.</>}/>
        </div>
    </FormCardContainer>
}

export default RegistrationForm