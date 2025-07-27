import { useState } from 'react';
import { CustomButton } from '../common/CustomButton';
import { Select } from '../common/Select';
import { buttonStyles } from '../ui/Color';
import Snackbar from '@mui/material/Snackbar';

export const SalarySettings = ({ setActiveTab }) => {
	const [selectedPayday, setSelectedPayday] = useState('月末');
	const [selectedCutoff, setSelectedCutoff] = useState('月末');
	const [snackInfo, setSnackInfo] = useState({ open: false, message: '' });

	const paydayOptions = [
		{ value: '月末', label: '月末' },
		{ value: '15日', label: '15日' },
	];

	const cutoffOptions = [
		{ value: '月末', label: '月末' },
		{ value: '15日', label: '15日' },
	];

	const handlePaydayChange = (e) => {
		setSelectedPayday(e.target.value);
		console.log('選択された給料日:', e.target.value);
	};

	const handleCutoffChange = (e) => {
		setSelectedCutoff(e.target.value);
		console.log('選択された給料日:', e.target.value);
	};

	// 戻るボタン
	const handleBackClick = (e) => {
		e.preventDefault();
		setActiveTab('settings');
	};

	// 決定ボタン
	const handleSubmitClick = (e) => {
		e.preventDefault();
		setSnackInfo({
			open: true,
			message: '給与の設定が完了しました。',
		});
		// setActiveTab('settings');
	};

	const handleClose = () => {
		setSnackInfo({ open: false, message: '' });
	};

	return (
		<div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-5xl font-bold p-16">給与</h2>
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
						className="w-30 h-12 bg-[#3498db] border-2 border-black text-white text-2xl font-extrabold rounded-lg hover:bg-[#2980b9]
                      transition-colors duration-300 shadow-lg"
					/>
					<CustomButton
						type="button"
						label="決定"
						onClick={handleSubmitClick}
						className={`${buttonStyles} w-30 h-12 border-2 border-black text-white text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300 shadow-lg`}
					/>
				</div>
			</div>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={snackInfo.open}
				onClose={handleClose}
				message={snackInfo.message}
				autoHideDuration={2000}
			/>
		</div>
	);
};
