import { useState } from "react";
import { ChildSidebar } from "../components/ui/child/ChildSidebar";
import { ChildTasks } from "../components/tasks/child/ChildTasks";
import { ChildMoneyRecords } from "../components/tasks/child/ChildMoneyRecords";

export const ChildTop = () => {
    const [activeTab, setActiveTab] = useState('ChildTasks');

    const handleSidebarItemClick = (itemId) => {
        setActiveTab(itemId); 
        console.log(`メインコンテンツを ${itemId} に切り替えます`);
    };

    const renderMainContent = () => {
        switch (activeTab) {
            case 'ChildTasks':
                return <ChildTasks key={activeTab} setActiveTab={setActiveTab} />;
            case 'ChildMoneyRecords':
                return <ChildMoneyRecords key="money-records" setActiveTab={setActiveTab} />;
            default:
                return <div>コンテンツがありません。</div>;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <ChildSidebar
                activeMenuItem={activeTab}
                onMenuItemClick={handleSidebarItemClick}
            />
            <main className="flex-grow items-center p-6 bg-orange-200 overflow-y-auto h-screen"> 
                {renderMainContent()}
            </main>
        </div>
    )
}