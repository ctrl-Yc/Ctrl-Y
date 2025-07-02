import { useState } from "react";
import { Sidebar } from "../components/ui/Sidebar"
import { ChildTasks } from "../components/tasks/child/ChildTasks";

export const ChildTop = () => {
    const [activeTab, setActiveTab] = useState('ChildTasks');
    // const [selectedTaskId, setSelectedTaskId] = useState(null);


    const handleSidebarItemClick = (itemId) => {
        setActiveTab(itemId); 
        console.log(`メインコンテンツを ${itemId} に切り替えます`);
    };

    const renderMainContent = () => {
        switch (activeTab) {
            case 'ChildTasks':
                return <ChildTasks key={activeTab} setActiveTab={setActiveTab} />;
           
            default:
                return <div>コンテンツがありません。</div>;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                activeMenuItem={activeTab}
                onMenuItemClick={handleSidebarItemClick}
            />
            <main className="flex-grow items-center p-6 bg-orange-200 overflow-y-auto h-screen"> 
                {renderMainContent()}
            </main>
        </div>
    )
}