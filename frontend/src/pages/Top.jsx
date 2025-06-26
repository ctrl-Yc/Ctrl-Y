import { useState } from "react";
import { Sidebar } from "../components/ui/Sidebar"
import { Tasks } from "../components/ui/Tasks";
import { Settings } from "../components/ui/Settings";
import { MoneyRecords } from "../components/ui/MoneyRecords";
import { SalarySettings } from "../components/ui/SalarySettings";
import { ChildSettings } from "../components/ui/ChildSettings";
import { NoticeSettings } from "../components/ui/NoticeSettings";
import { AccountSettings } from "../components/ui/AccountSettings";
import { TaskCreate } from "../components/ui/TaskCreate";
import { TaskEdit } from "../components/ui/TaskEdit";

export const Top = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    // サイドバーの項目がクリックされたときに呼ばれる関数
    const handleSidebarItemClick = (itemId) => {
        setActiveTab(itemId); // activeTab の状態を更新
        console.log(`メインコンテンツを ${itemId} に切り替えます`);
    };

    // Settings内カードのクリックで呼ばれる（Topで保持）
    const handleSettingsItemClick = (settingId) => {
        setActiveTab(`settings/${settingId}`);
    };

    // mainに表示するコンテンツ
    const renderMainContent = () => {
        switch (activeTab) {
            case 'tasks':
                return <Tasks key={activeTab} setActiveTab={setActiveTab} setSelectedTaskId={setSelectedTaskId} />;
            case 'tasks/create':
                return <TaskCreate setActiveTab={setActiveTab} />;
            case 'tasks/edit':
                return <TaskEdit taskId={selectedTaskId} setActiveTab={setActiveTab} />;
            case 'records':
                return <MoneyRecords />;
            case 'settings':
                return <Settings onSettingItemClick={handleSettingsItemClick} />;
            case 'settings/salary':
                return <SalarySettings setActiveTab={setActiveTab} />;
            case 'settings/notice':
                return <NoticeSettings setActiveTab={setActiveTab} />;
            case 'settings/account':
                return <AccountSettings setActiveTab={setActiveTab} />;
            case 'settings/child':
                return <ChildSettings setActiveTab={setActiveTab} />;
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
            {/* メインコンテンツ部分 */}
            <main className="flex-grow items-center p-6 bg-orange-200 overflow-y-auto h-screen"> 
                {renderMainContent()}
            </main>
        </div>
    )
}