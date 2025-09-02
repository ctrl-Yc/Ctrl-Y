import { useState, Suspense, lazy, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../components/ui/Loading';

const ChildSidebar = lazy(() =>
	import('../components/ui/child/ChildSidebar').then((m) => ({ default: m.ChildSidebar }))
);
const ChildTasks = lazy(() =>
	import('../components/tasks/child/ChildTasks').then((m) => ({ default: m.ChildTasks }))
);
const ChildMoneyRecords = lazy(() =>
	import('../components/tasks/child/ChildMoneyRecords').then((m) => ({
		default: m.ChildMoneyRecords,
	}))
);

export const ChildTop = () => {
	const [activeTab, setActiveTab] = useState('ChildTasks');
	const [loading, setLoading] = useState(true);
	const { child_id } = useParams();

	const handleSidebarItemClick = (itemId) => {
		setActiveTab(itemId);
	};

	useEffect(() => {
		if (activeTab === 'ChildTasks') {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [activeTab]);

	const onLoadingChange = useMemo(() => (v) => setLoading(!!v), []);

	const renderMainContent = () => {
		const common = { onLoadingChange };

		const tabComponents = {
			ChildTasks: <ChildTasks key={activeTab} setActiveTab={setActiveTab} {...common} />,
			ChildMoneyRecords: (
				<ChildMoneyRecords
					key={activeTab}
					setActiveTab={setActiveTab}
					child_id={child_id}
				/>
			),
		};
		return (
			<Suspense fallback={null}>
				{tabComponents[activeTab] || <div>コンテンツがありません。</div>}
			</Suspense>
		);
	};

	return (
		<div className="relative flex h-screen overflow-hidden">
			<Suspense fallback={null}>
				<ChildSidebar activeMenuItem={activeTab} onMenuItemClick={handleSidebarItemClick} />
			</Suspense>

			<main className="flex-grow items-center p-6 bg-orange-200 overflow-y-auto h-screen">
				{renderMainContent()}
			</main>

			{activeTab === 'ChildTasks' && loading && <Loading className="text-orange-100" />}
		</div>
	);
};
