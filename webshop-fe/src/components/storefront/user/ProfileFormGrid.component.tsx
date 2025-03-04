import {Button} from "src/components/ui/Button"
import React from "react";
import {Card, CardContent} from "../../ui/Card";
import PasswordForm from "./RenewPasswordForm.component";
import AddressForm from "./AddressForm.component";


const ProfileForm: React.FC = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full space-y-6 mb-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div className="md:flex flex-col gap-4">
                        <AddressForm/>
                        <Card className="my-4">
                            <CardContent className="flex flex-col justify-center">
                                <h1 className="font-bold">Security Settings</h1>
                                <h2 className="text-md">Manage your passwords and authentication</h2>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:flex flex-col gap-4">
                        <Card className="md:my-4 flex-1">
                            <CardContent className="flex flex-col justify-center">
                                <h1 className="font-bold">Account Preferences</h1>
                                <h2 className="text-md">Customize your experience and preferences</h2>
                            </CardContent>
                        </Card>

                        <PasswordForm/>
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button variant="destructive">Delete</Button>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm