import { useEffect, useState } from 'react';
import { CustomButton } from '../common/CustomButton';
import { Select } from '../common/Select';
import { PAYDAY_CUTOFF_SETTING } from '../../config/api';
import { api } from '../../api';
import Snackbar from '@mui/material/Snackbar';
import { buttonStyles } from '../ui/Color';

export const SalarySettings = ({ setActiveTab }) => {
	const [selectedPayday, setSelectedPayday] = useState('月末');
	const [selectedCutoff, setSelectedCutoff] = useState('月末');
	const [error, setError] = useState('');
	const [snackInfo, setSnackInfo] = useState({
		open: false,
		message: '',
	});

	const paydayOptions = [
		{ value: '月末', label: '月末' },
		{ value: '15日', label: '15日' },
	];

	const cutoffOptions = [
		{ value: '月末', label: '月末' },
		{ value: '15日', label: '15日' },
	];

	const booleanToLabel = (value) => (value ? '15日' : '月末');
	const labelToBoolean = (label) => label === '15日';

	// 初期データ取得
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await api.get(PAYDAY_CUTOFF_SETTING);
				setSelectedPayday(booleanToLabel(response.data.pay_day));
				setSelectedCutoff(booleanToLabel(response.data.cutoff_day));
			} catch (err) {
				setError('データの取得に失敗しました');
				console.error(err);
			}
		};
		fetchSettings();
	}, []);

	const handlePaydayChange = (e) => {
		setSelectedPayday(e.target.value);
	};

	const handleCutoffChange = (e) => {
		setSelectedCutoff(e.target.value);
	};

	// 戻るボタン
	const handleBackClick = (e) => {
		e.preventDefault();
		setActiveTab('settings');
	};

	// 決定ボタン
	const handleSubmitClick = async (e) => {
		e.preventDefault();

		try {
			await api.post(PAYDAY_CUTOFF_SETTING, {
				pay_day: labelToBoolean(selectedPayday),
				cutoff_day: labelToBoolean(selectedCutoff),
			});
			setSnackInfo({
				open: true,
				message: '保存しました',
			});
		} catch (err) {
			setSnackInfo({
				open: true,
				message: '保存に失敗しました。',
			});
			console.error('給与設定保存エラー:', err);
		}
	};

	const handleClose = () => {
		setSnackInfo({ open: false, message: '' });
	};

	return (
		<div className="bg-white w-full h-full rounded-xl overflow-y-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-5xl font-bold p-16 text-[#2c3e50]">給与</h2>
				{error && <p className="text-red-500">{error}</p>}
			</div>
			<div className="mx-20 space-y-4">
				<p className="text-xl">給料日の変更</p>
				<Select
					options={paydayOptions}
					value={selectedPayday}
					onChange={handlePaydayChange}
					className="w-26"
				/>

				<p className="text-xl">締め日の変更</p>
				<Select
					options={cutoffOptions}
					value={selectedCutoff}
					onChange={handleCutoffChange}
					className="w-26"
				/>
				<div className="mt-8 space-x-12">
					<CustomButton
						type="button"
						label="戻る"
						onClick={handleBackClick}
						className="w-30 h-12 bg-[#3498db] text-white text-2xl border-2 border-[#2980b9] font-extrabold rounded-lg hover:bg-[#2980b9]
                      transition-colors duration-300"
					/>
					<CustomButton
						type="button"
						label="決定"
						onClick={handleSubmitClick}
						className={`${buttonStyles} w-30 h-12 text-2xl font-extrabold rounded-lg hover:bg-orange-200`}
					/>
				</div>
			</div>
			<Snackbar
				open={snackInfo.open}
				autoHideDuration={3000}
				onClose={handleClose}
				message={snackInfo.message}
			/>
		</div>
	);
};
