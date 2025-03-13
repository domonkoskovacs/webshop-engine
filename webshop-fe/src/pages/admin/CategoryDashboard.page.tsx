import React from 'react';
import CategoryTable from "../../components/admin/category/CategoryTable.component";
import DashboardPageContainer from "../../components/admin/shared/DashboardPageContainer.component";

const CategoryDashboard: React.FC = () => {

    return (
        <DashboardPageContainer className="justify-start">
            <CategoryTable/>
        </DashboardPageContainer>
    );
};

export default CategoryDashboard;
