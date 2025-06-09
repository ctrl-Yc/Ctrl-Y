import { useState } from "react";
import Sidebar from "../components/ui/Sidebar"
import Tasks from "../components/ui/Tasks";
import Settings from "../components/ui/Settings";
import MoneyRecords from "../components/ui/MoneyRecords";

const Top = () => {
    const [activeTab, setActiveTab] = useState('tasks');

    // サイドバーの項目がクリックされたときに呼ばれる関数
    const handleSidebarItemClick = (itemId) => {
        setActiveTab(itemId); // activeTab の状態を更新
        console.log(`メインコンテンツを ${itemId} に切り替えます`);
    };

    // activeTab に応じて表示するメインコンテンツを切り替える関数
    const renderMainContent = () => {
        switch (activeTab) {
            case 'task': // お手伝い一覧
                return <Tasks />;
            case 'records': // おこづかい記録
                return <MoneyRecords />;
            case 'settings': // 設定
                return <Settings />;
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
            <main className="flex-grow p-6 bg-gray-100 overflow-y-auto"> {/* メインコンテンツはスクロール可能に */}
                {renderMainContent()}
            </main>
        </div>
    )
}

export default Top
