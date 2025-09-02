import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../config/Token";

const Sidebar = lazy(() =>import("../components/ui/Sidebar").then((m) => ({ default: m.Sidebar })));
const Tasks = lazy(() => import("../components/tasks/Tasks").then((m) => ({ default: m.Tasks })));
const Settings = lazy(() =>import("../components/settings/Settings").then((m) => ({ default: m.Settings })));
const MoneyRecords = lazy(() =>import("../components/ui/MoneyRecords").then((m) => ({ default: m.MoneyRecords })));
const SalarySettings = lazy(() =>import("../components/settings/SalarySettings").then((m) => ({ default: m.SalarySettings })));
const ChildSettings = lazy(() =>import("../components/settings/ChildSettings").then((m) => ({ default: m.ChildSettings })));
const NoticeSettings = lazy(() =>import("../components/settings/NoticeSettings").then((m) => ({ default: m.NoticeSettings })));
const AccountSettings = lazy(() =>import("../components/settings/AccountSettings").then((m) => ({ default: m.AccountSettings })));
const TaskCreate = lazy(() =>import("../components/tasks/TaskCreate").then((m) => ({ default: m.TaskCreate })));
const TaskEdit = lazy(() =>import("../components/tasks/TaskEdit").then((m) => ({ default: m.TaskEdit })));

export const Top = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("tasks");
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/");
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
        const tabComponents = {
            tasks: (
                <Tasks
                    key={activeTab}
                    setActiveTab={setActiveTab}
                    setSelectedTaskId={setSelectedTaskId}
                />
            ),
            "tasks/create": <TaskCreate setActiveTab={setActiveTab} />,
            "tasks/edit": <TaskEdit taskId={selectedTaskId} setActiveTab={setActiveTab} />,
            records: <MoneyRecords />,
            settings: <Settings onSettingItemClick={handleSettingsItemClick} />,
            "settings/salary": <SalarySettings setActiveTab={setActiveTab} />,
            "settings/notice": <NoticeSettings setActiveTab={setActiveTab} />,
            "settings/account": <AccountSettings setActiveTab={setActiveTab} />,
            "settings/child": <ChildSettings setActiveTab={setActiveTab} />,
        };

        return tabComponents[activeTab] || <div>コンテンツがありません。</div>;
    };

    return (
        //ローディングの時デザイン必要
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex h-screen overflow-hidden">
                <Sidebar activeMenuItem={activeTab} onMenuItemClick={handleSidebarItemClick} />
                <main className="flex-grow items-center p-6 bg-[#FFF877] bg-[url('/images/back.png')] overflow-y-auto h-screen">
                    {renderMainContent()}
                </main>
            </div>
        </Suspense>
    );
};
