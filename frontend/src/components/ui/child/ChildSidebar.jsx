//childsidber
import { SidebarItem } from "../SidebarItem";

export const ChildSidebar = ({ activeMenuItem, onMenuItemClick }) => {
    const menuItems = [
        { id: "ChildTasks", text: "おてつだい一覧", icon: "list" },
        { id: "ChildMoneyRecords", text: "おこづかい記録", icon: "money" },
    ];

    return (
        <aside
            className="
                absolute left-0 w-full flex flex-row gap-4 px-4 py-2 bg-transparent ml-6 mt-9 md:mt-0 md:ml-0
                md:fixed md:left-0 md:z-40
                md:w-80 md:bg-orange-100 md:text-white md:p-4 md:h-[calc(100vh-3rem)] md:flex md:flex-col md:shrink-0
                "
        >
            <nav>
                <ul className="flex flex-row space-x-5 md:flex-col md:space-x-0 md:space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            text={item.text}
                            isActive={activeMenuItem === item.id}
                            onClick={() => onMenuItemClick(item.id)}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
