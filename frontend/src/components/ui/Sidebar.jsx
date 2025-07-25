import { LogoutItem } from "./Logout";
import { SidebarItem } from "./SidebarItem"

export const Sidebar = ({ activeMenuItem, onMenuItemClick }) => {
    const menuItems = [
        { id: 'tasks', text: 'おてつだい一覧', icon: 'list' },
        { id: 'records', text: 'おこづかい記録', icon: 'money' },
        { id: 'settings', text: '設定', icon: 'settings' },
    ];

    return (
        <aside className="hidden sidebar 
        bg-orange-100 text-white 
        md:w-64md:p-4 md:block md:h-full md:flex md:flex-col">
            <div>
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
                        <LogoutItem />
                    </ul>
                </nav>
            </div>
        </aside>
    )
}


