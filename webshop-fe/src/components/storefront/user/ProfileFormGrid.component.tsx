import {Button} from "src/components/ui/Button"
import React from "react";
import PasswordForm from "./RenewPasswordForm.component";
import AddressForm from "./AddressForm.component";
import AccountInfoForm from "./AccountInfoForm.component";
import {Card, CardContent, CardFooter} from "../../ui/Card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../ui/Dialog";
import {useUser} from "../../../hooks/UseUser";


const ProfileForm: React.FC = () => {
    const {deleteUser} = useUser()
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">Delete</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Delete account</DialogTitle>
                                            <DialogDescription>
                                                Are you certain about deleting your account?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="destructive" className="w-1/2 mx-auto" type="submit" onClick={() => deleteUser()}>Yes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm