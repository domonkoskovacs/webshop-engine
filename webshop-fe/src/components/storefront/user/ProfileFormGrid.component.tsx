import React from "react";
import PasswordForm from "./RenewPasswordForm.component";
import AddressForm from "./AddressForm.component";
import AccountInfoForm from "./AccountInfoForm.component";
import {Card, CardContent, CardFooter} from "../../ui/Card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../../ui/AlertDialog";
import {Button} from "src/components/ui/Button";
import {useDeleteUser} from "../../../hooks/user/useDeleteUser";
import {toast} from "../../../hooks/useToast";


const ProfileForm: React.FC = () => {
    const {mutateAsync: deleteUser} = useDeleteUser()
    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full space-y-6 mb-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div className="md:flex flex-col gap-4">
                        <AddressForm type="shipping"/>
                        <AddressForm type="billing"/>
                    </div>

                    <div className="md:flex flex-col gap-4">
                        <AccountInfoForm/>
                        <PasswordForm/>
                        <Card className="my-4 flex-1 flex flex-col justify-between">
                            <CardContent className="flex flex-col justify-center">
                                <h1 className="font-bold">Delete your account</h1>
                                <h2 className="text-md">You can delete your account, remove all your personal
                                    information and account data. One executed we can no longer restore your data!</h2>
                            </CardContent>
                            <CardFooter>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction asChild
                                                               className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                <Button
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        try {
                                                            await deleteUser();
                                                            toast.success("Account successfully deleted.");
                                                        } catch (error) {
                                                            toast.error("There was an error deleting your account.");
                                                        }
                                                    }}
                                                >
                                                    Continue
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm