import { LogoutButton } from './Logout';
import { SidebarItem } from './SidebarItem';

export const Sidebar = ({ activeMenuItem, onMenuItemClick }) => {
	const menuItems = [
		{ id: 'tasks', text: 'おてつだい一覧', icon: 'list' },
		{ id: 'records', text: 'おこづかい記録', icon: 'money' },
		{ id: 'settings', text: '設定', icon: 'settings' },
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
			<div className="mt-auto">
				<LogoutButton />
			</div>
		</aside>
	);
};
