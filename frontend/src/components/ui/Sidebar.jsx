import { LogoutItem } from "./Logout";
import { SidebarItem } from "./SidebarItem"

export const Sidebar = ({ activeMenuItem, onMenuItemClick }) => {
    const menuItems = [
        { id: 'tasks', text: 'おてつだい一覧', icon: 'list' },
        { id: 'records', text: 'おこづかい記録', icon: 'money' },
        { id: 'settings', text: '設定', icon: 'settings' },
    ];

    return (
        <aside className="
        hidden md:sidebar md:w-80 md:bg-orange-100 md:text-white md:p-4 md:h-full md:flex md:flex-col
        ">

            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            className="nowrap"
                            key={item.id}
                            icon={item.icon}
                            text={item.text}
                            isActive={activeMenuItem === item.id}
                            onClick={() => onMenuItemClick(item.id)}
                        />
                    ))}
                </ul>
            </nav>

            <div className="flex-grow" />
            <LogoutItem />
        </aside>
    )
};


