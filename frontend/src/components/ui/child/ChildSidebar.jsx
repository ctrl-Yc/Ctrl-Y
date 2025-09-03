import { SidebarItem } from "../SidebarItem";

export const ChildSidebar = ({ activeMenuItem, onMenuItemClick }) => {
    const menuItems = [
        { id: 'ChildTasks', text: 'おてつだい一覧', icon: 'list' },
        { id: 'ChildMoneyRecords', text: 'おこづかい記録', icon: 'money' },
    ];

    return (
        <aside className="hidden md:sidebar md:w-80 md:bg-orange-100 md:text-white md:p-4 md:h-full md:flex md:flex-col">
            <nav>
                <ul className="space-y-2">
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
    )
}