import { SidebarItem } from "../SidebarItem";


export const ChildSidebar = ({ activeMenuItem, onMenuItemClick }) => {
    const menuItems = [
        { id: 'ChildTasks', text: 'おてつだい一覧', icon: 'list' },
        { id: 'ChildMoneyRecords', text: 'おこづかい記録', icon: 'money' },
    ];

    return (
        <aside className="sidebar w-64 bg-orange-100 text-white p-4 h-full flex flex-col">
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
                    </ul>
                </nav>
            </div>
        </aside>
    )
}


