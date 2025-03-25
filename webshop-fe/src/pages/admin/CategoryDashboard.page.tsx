import React from 'react';
import CategoryTable from "../../components/admin/category/CategoryTable.component";
import PageContainer from "../../components/shared/PageContainer.component";

const CategoryDashboard: React.FC = () => {

    return (
        <PageContainer layout="start">
            <CategoryTable/>
        </PageContainer>
    );
};

export default CategoryDashboard;
