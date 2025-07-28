import { useEffect, useState } from 'react';
import { Select } from '../common/Select';
import { CHILDREN_BASE, CHILDREN_LIST } from '../../config/api';
import { api } from '../../api';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const MoneyRecords = () => {
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYear.toString());
	const [records, setRecords] = useState([]);
	const [children, setChildren] = useState([]);
	const [selectedChild, setSelectedChild] = useState(null);

	// グラフ設定
	const chartData = {
		labels: records.map((record) =>
			new Date(record.inserted_month).toLocaleDateString('ja-JP', {
				month: 'short',
			})
		),
		datasets: [
			{
				label: '報酬額（円）',
				data: records.map((record) => record.reward),
				borderColor: 'rgba(75,192,192,1)',
				backgroundColor: 'rgba(75,192,192,0.2)',
				tension: 0.3, // 線を滑らかに
				fill: true,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: false,
			},
			tooltip: {
				enabled: true,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: '金額（円）',
				},
			},
			x: {
				title: {
					display: true,
					text: '月',
				},
			},
		},
	};

	// 年を格納する配列
	const yearList = [];
	for (let y = 2023; y <= currentYear; y++) {
		yearList.unshift({ value: y.toString(), label: `${y}年` });
	}

	// 子供全取得
	useEffect(() => {
		const fetchChildren = async () => {
			try {
				const response = await api.get(CHILDREN_LIST);
				if (response.data.length > 0) {
					setChildren(response.data);
					setSelectedChild(response.data[0]);
					console.log(response.data[0]);
				}
			} catch (error) {
				console.error('子供情報取得エラー:', error);
			}
		};
		fetchChildren();
	}, []);

	// 年変更
	const handleYearChange = (e) => {
		setSelectedYear(e.target.value);
	};

	// 子供変更
	const handleChildChange = (e) => {
		const child = children.find((c) => c.user_id === e.target.value);
		setSelectedChild(child);
	};

	// 子供と年を指定して記録を取得
	useEffect(() => {
		const fetchData = async () => {
			if (!selectedChild?.user_id) return;
			try {
				const response = await api.get(
					`${CHILDREN_BASE}/${selectedChild.user_id}/payments`,
					{ year: selectedYear }
				);
				setRecords(response.data);
			} catch (error) {
				console.error('データ取得エラー:', error);
			}
		};
		fetchData();
	}, [selectedChild, selectedYear]);

	return (
		<div className="m-10">
			<div className="flex justify-between items-center w-full">
				<h2 className="text-5xl font-bold p-8 text-[#2c3e50]">おこづかい記録</h2>
				<div className="flex justify-center py-10 items-center mr-28">
					<Select
						options={children.map((c) => ({ value: c.user_id, label: c.c_name }))}
						value={selectedChild ? selectedChild.user_id : ''}
						onChange={handleChildChange}
						className="w-30 mr-10"
					/>
					<Select
						options={yearList}
						value={selectedYear}
						onChange={handleYearChange}
						className="w-30 mr-10"
					/>
				</div>
			</div>
			{/* グラフ */}
			<div className="flex justify-center mt-10">
				<div className="w-3/4 bg-white p-6 rounded-lg shadow">
					<Line data={chartData} options={chartOptions} />
				</div>
			</div>

			<div className="flex justify-center">
				<div className="w-3/4 h-6 space-y-8">
					{records.map((record) => (
						<div
							key={`${record.user_id}-${record.inserted_month}`}
							className="bg-gray-50 h-30 border border-gray-200 rounded-lg px-20 flex items-center justify-between shadow-sm"
						>
							<div className="text-gray-900 font-semibold text-2xl">
								{record.inserted_month &&
									new Date(record.inserted_month).toLocaleDateString('ja-JP', {
										year: 'numeric',
										month: 'long',
									})}
							</div>
							<div className="flex items-center space-x-10">
								<span className="text-xl font-bold text-green-600">
									¥{record.reward}
								</span>
								<span className="text-gray-600 text-base">
									お手伝い回数：
									<span className="font-semibold">{record.number}回</span>
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
