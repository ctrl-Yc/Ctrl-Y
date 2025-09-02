import { LogoutItem } from "./Logout";
import { SidebarItem } from "./SidebarItem"

export const Sidebar = ({ activeMenuItem, onMenuItemClick }) => {
    const menuItems = [
        { id: 'tasks', text: 'おてつだい一覧', icon: 'list' },
        { id: 'records', text: 'おこづかい記録', icon: 'money' },
        { id: 'settings', text: '設定', icon: 'settings' },
    ];

    return (
        <aside className="sidebar  bg-white text-white p-30 mx-40 h-1/2 flex position-absolute">

            <nav>
                <ul className="space-y-2 ">
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

            <div className="flex-grow" />
            <LogoutItem />
        </aside>
    )
};


