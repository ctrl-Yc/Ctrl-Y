import { useEffect, useState } from "react";
import { Sidebar } from "../components/ui/Sidebar"
import { Tasks } from "../components/tasks/Tasks";
import { Settings } from "../components/settings/Settings";
import { MoneyRecords } from "../components/ui/MoneyRecords";
import { SalarySettings } from "../components/settings/SalarySettings";
import { ChildSettings } from "../components/settings/ChildSettings";
import { NoticeSettings } from "../components/settings/NoticeSettings";
import { AccountSettings } from "../components/settings/AccountSettings";
import { TaskCreate } from "../components/tasks/TaskCreate";
import { TaskEdit } from "../components/tasks/TaskEdit";
import { useNavigate } from "react-router";
import { getToken } from "../config/Token";

export const Top = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/")
        }
    }, [navigate]);


    const handleSidebarItemClick = (itemId) => {
        setActiveTab(itemId); 
        console.log(`メインコンテンツを ${itemId} に切り替えます`);
    };

    const handleSettingsItemClick = (settingId) => {
        setActiveTab(`settings/${settingId}`);
    };

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
            <main className="flex-grow items-center p-6 bg-[#FFE1AD] overflow-y-auto h-screen"> 
                {renderMainContent()}
            </main>
        </div>
    )
}