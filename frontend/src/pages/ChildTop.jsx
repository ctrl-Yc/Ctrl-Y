import { useState, Suspense, lazy } from "react";

const ChildSidebar = lazy(() => import("../components/ui/child/ChildSidebar").then((m) => ({ default: m.ChildSidebar })))   ;
const ChildTasks = lazy(() => import("../components/tasks/child/ChildTasks").then((m) => ({ default: m.ChildTasks })));
const ChildMoneyRecords = lazy(() => import("../components/tasks/child/ChildMoneyRecords").then((m) => ({ default: m.ChildMoneyRecords })));

export const ChildTop = () => {
    const [activeTab, setActiveTab] = useState("ChildTasks");

    const handleSidebarItemClick = (itemId) => {
        setActiveTab(itemId);
        console.log(`メインコンテンツを ${itemId} に切り替えます`);
    };

    const renderMainContent = () => {
        const tabComponents = {
            ChildTasks: <ChildTasks key={activeTab} setActiveTab={setActiveTab} />,
            ChildMoneyRecords: <ChildMoneyRecords key={activeTab} setActiveTab={setActiveTab} />,
        };

        return tabComponents[activeTab] || <div>コンテンツがありません。</div>;
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex h-screen overflow-hidden">
                <ChildSidebar
                    activeMenuItem={activeTab}
                    onMenuItemClick={handleSidebarItemClick}
                />
                <main className="flex-grow items-center p-6 bg-orange-200 overflow-y-auto h-screen">
                    {renderMainContent()}
                </main>
            </div>
        </Suspense>
    );
};