import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../config/Token";
import { Loading } from "../components/ui/Loading";

const Sidebar = lazy(() =>
  import("../components/ui/Sidebar").then((m) => ({ default: m.Sidebar }))
);
const Tasks = lazy(() =>
  import("../components/tasks/Tasks").then((m) => ({ default: m.Tasks }))
);
const Settings = lazy(() =>
  import("../components/settings/Settings").then((m) => ({ default: m.Settings }))
);
const MoneyRecords = lazy(() =>
  import("../components/ui/MoneyRecords").then((m) => ({ default: m.MoneyRecords }))
);
const SalarySettings = lazy(() =>
  import("../components/settings/SalarySettings").then((m) => ({ default: m.SalarySettings }))
);
const ChildSettings = lazy(() =>
  import("../components/settings/ChildSettings").then((m) => ({ default: m.ChildSettings }))
);
const NoticeSettings = lazy(() =>
  import("../components/settings/NoticeSettings").then((m) => ({ default: m.NoticeSettings }))
);
const AccountSettings = lazy(() =>
  import("../components/settings/AccountSettings").then((m) => ({ default: m.AccountSettings }))
);
const TaskCreate = lazy(() =>
  import("../components/tasks/TaskCreate").then((m) => ({ default: m.TaskCreate }))
);
const TaskEdit = lazy(() =>
  import("../components/tasks/TaskEdit").then((m) => ({ default: m.TaskEdit }))
);

export const Top = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const token = getToken();
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    setLoading(activeTab === "tasks");
  }, [activeTab]);

  const onLoadingChange = useMemo(
    () => (v) => {
      if (activeTab === "tasks") setLoading(Boolean(v));
    },
    [activeTab]
  );

  const handleSidebarItemClick = (itemId) => setActiveTab(itemId);
  const handleSettingsItemClick = (settingId) => setActiveTab(`settings/${settingId}`);

  const renderMainContent = () => {
    const tabComponents = {
      tasks: (
        <Tasks
          key={activeTab}
          setActiveTab={setActiveTab}
          setSelectedTaskId={setSelectedTaskId}
          onLoadingChange={onLoadingChange}  
        />
      ),
      "tasks/create": <TaskCreate key={activeTab} setActiveTab={setActiveTab} />,
      "tasks/edit": (
        <TaskEdit key={activeTab} taskId={selectedTaskId} setActiveTab={setActiveTab} />
      ),
      records: <MoneyRecords key={activeTab} />,
      settings: <Settings key={activeTab} onSettingItemClick={handleSettingsItemClick} />,
      "settings/salary": <SalarySettings key={activeTab} setActiveTab={setActiveTab} />,
      "settings/notice": <NoticeSettings key={activeTab} setActiveTab={setActiveTab} />,
      "settings/account": <AccountSettings key={activeTab} setActiveTab={setActiveTab} />,
      "settings/child": <ChildSettings key={activeTab} setActiveTab={setActiveTab} />,
    };
    return ( <Suspense fallback={null}>
        {tabComponents[activeTab] || <div>コンテンツがありません。</div>}
      </Suspense>
    )
}
  return (
    <div className="relative flex h-screen overflow-hidden">
      <Suspense fallback={null}>
        <Sidebar activeMenuItem={activeTab} onMenuItemClick={handleSidebarItemClick} />
      </Suspense>

      <main className="flex-grow items-center p-6 bg-[#FFE1AD] overflow-y-auto h-screen">
        {renderMainContent()}
      </main>

      {loading && activeTab === "tasks" && <Loading />}
    </div>
  );
};