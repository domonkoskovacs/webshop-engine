import React from 'react';
import ProfileForm from "../../components/storefront/user/ProfileFormGrid.component";
import {Card, CardContent} from "../../components/ui/Card";
import PageContainer from "../../components/shared/PageContainer.component";

const Profile: React.FC = () => {
    return (
        <PageContainer className="px-6 xl:w-4/5 xl:p-0">
            <Card className="w-full mt-4">
                <CardContent className="flex flex-col justify-center">
                    <h1 className="font-bold">Profile Settings</h1>
                    <h2 className="text-md">Update your information or change profile settings</h2>
                </CardContent>
            </Card>
            <ProfileForm/>
        </PageContainer>
    );
};

export default Profile;
