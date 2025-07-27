import { Cards } from '../ui/Cards';

export const Settings = ({ onSettingItemClick }) => {
	const settingItems = [
		{
			id: 'salary',
			title: '給与',
			icon: '/images/icon-money.png',
			cardClassName: 'w-28 h-28 m-4 mx-auto',
		},
		{
			id: 'notice',
			title: '通知',
			icon: '/images/icon-notice.png',
			cardClassName: 'w-28 h-28 m-4 mx-auto',
		},
		{
			id: 'account',
			title: 'アカウント',
			icon: '/images/icon-account.png',
			cardClassName: 'w-28 h-28 m-4 mx-auto',
		},
		{
			id: 'child',
			title: '子供',
			icon: '/images/icon-children.png',
			cardClassName: 'w-36 h-30 m-2 mb-4 mx-auto',
		},
	];

	// CardsからクリックされたときにTopに通知
	const handleClick = (itemId) => {
		if (onSettingItemClick) {
			onSettingItemClick(itemId);
		}
	};

	return (
		<div className="mx-10 mt-5">
			<div className="flex justify-between items-center">
				<h1 className="text-5xl font-bold mt-5 p-8 text-[#2c3e50]">設定</h1>
			</div>

			<Cards
				items={settingItems}
				onItemClick={(item) => handleClick(item.id)}
				cardClassName=""
			/>
		</div>
	);
};
