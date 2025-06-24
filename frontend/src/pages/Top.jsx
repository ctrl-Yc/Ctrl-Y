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

export const Top = () => {
    const [activeTab, setActiveTab] = useState('tasks');

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
                return <Tasks key={activeTab} setActiveTab={setActiveTab} />;
            case 'tasks/create':
                return <TaskCreate setActiveTab={setActiveTab} />;
            case 'records':
                return <MoneyRecords />;
            case 'settings':
                return <Settings onSettingItemClick={handleSettingsItemClick} />;
            case 'settings/salary':
                return <SalarySettings />;
            case 'settings/notice':
                return <NoticeSettings />;
            case 'settings/account':
                return <AccountSettings />;
            case 'settings/child':
                return <ChildSettings />;
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
            <main className="flex-grow items-center p-6 bg-orange-200"> 
                {renderMainContent()}
            </main>
        </div>
    )
}
