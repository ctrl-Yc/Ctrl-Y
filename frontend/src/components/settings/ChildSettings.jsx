import { useEffect, useState } from 'react';
import { CustomButton } from '../common/CustomButton';
import { InputField } from '../common/InputField';
import { Select } from '../common/Select';
import { CHILDREN_BASE, CHILDREN_LIST, CHILD_LOGIN } from '../../config/api';
import { api } from '../../api';
import { Modal } from '../ui/Modal';
import { buttonStyles } from '../ui/Color';
import Snackbar from '@mui/material/Snackbar';

export const ChildSettings = ({ setActiveTab }) => {
	const [keyword, setKeyword] = useState('');
	const [selectedChild, setSelectedChild] = useState('');
	const [children, setChildren] = useState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newChildName, setNewChildName] = useState('');
	const [loading, setLoading] = useState(false);
	const [snackInfo, setSnackInfo] = useState({ open: false, message: '' });

	const handleClose = () => {
		setSnackInfo({ open: false, message: '' });
	};

	// 子供全取得
	useEffect(() => {
		const fetchChildren = async () => {
			setLoading(true);
			try {
				const response = await api.get(CHILDREN_LIST);
				if (response.data.length > 0) {
					setChildren(response.data);
					setSelectedChild(response.data[0]);
				}
			} catch (error) {
				console.error('子供情報取得エラー:', error);
				setSnackInfo({
					open: true,
					message: '子供情報の取得に失敗しました',
				});
			} finally {
				setLoading(false);
			}
		};
		fetchChildren();
	}, []);

	// 子ども追加ボタン処理
	const handleAddChild = async (e) => {
		e.preventDefault();
		if (!newChildName.trim()) {
			setSnackInfo({
				open: true,
				message: '名前を入力してください',
			});
			return;
		}

		try {
			await api.post(CHILDREN_BASE, { c_name: newChildName });
			setNewChildName('');
			setIsDialogOpen(false);
			setSnackInfo({
				open: true,
				message: '子供を追加しました',
			});
		} catch (error) {
			setSnackInfo({
				open: true,
				message: '子供の追加に失敗しました',
			});
		}
	};

	// 戻るボタン
	const handleBackClick = (e) => {
		e.preventDefault();
		setActiveTab('settings');
	};

	// 決定ボタン
	const handleSubmitClick = (e) => {
		e.preventDefault();
	};

	// コピーボタン
	const handleCopyUrl = () => {
		if (!selectedChild) return;

		const url = `${CHILD_LOGIN}${selectedChild.user_id}`;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				setSnackInfo({
					open: true,
					message: 'URLをコピーしました',
				});
			})
			.catch(() => {
				setSnackInfo({
					open: true,
					message: 'コピーに失敗しました',
				});
			});
	};

	return (
		<div className="bg-white w-full h-full rounded-xl overflow-y-auto">
			<Snackbar
				open={snackInfo.open}
				autoHideDuration={3000}
				onClose={handleClose}
				message={snackInfo.message}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			/>
			<div className="flex justify-between items-center">
				<h2 className="text-5xl font-bold p-16 text-[#2c3e50]">子供</h2>
			</div>

			<div className="mx-20 space-y-4">
				<div>
					<p className="text-2xl">あいことばの変更</p>
					<InputField
						type="text"
						placeholder=""
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						className="my-6 w-70 h-10 px-4 border bg-white rounded-lg"
					/>
				</div>

				<div>
					<CustomButton
						type="button"
						label="+子供の追加"
						onClick={() => setIsDialogOpen(true)}
						className={`${buttonStyles} w-32 h-10 text-lg font-bold rounded-lg mb-6`}
					/>
				</div>

				<p className="text-2xl">ログイン用URL</p>
				<Select
					options={children.map((child) => ({
						value: child.user_id,
						label: child.c_name,
					}))}
					value={selectedChild ? selectedChild.user_id : ''}
					onChange={(e) => {
						const selected = children.find((c) => c.user_id === e.target.value);
						setSelectedChild(selected);
					}}
					placeholder="子供を選択"
					className="w-70"
				/>
				<InputField
					type="text"
					placeholder=""
					value={selectedChild ? `${CHILD_LOGIN}${selectedChild.user_id}` : ''}
					readOnly
					className="my-6 w-100 h-10 px-4 border bg-white rounded-lg"
				/>
				<CustomButton type="button" label="コピー" onClick={handleCopyUrl} />
				<div className="mt-4 space-x-12">
					<CustomButton
						type="button"
						label="戻る"
						onClick={handleBackClick}
						className="w-30 h-12 bg-[#3498db] text-white text-2xl font-extrabold rounded-lg hover:bg-[#2980b9]
                      transition-colors duration-300 border-2 border-[#2980b9]"
					/>
					<CustomButton
						type="button"
						label="決定"
						onClick={handleSubmitClick}
						className={`${buttonStyles} w-30 h-12 text-2xl font-extrabold rounded-lg hover:bg-orange-200`}
					/>
				</div>
			</div>
			{/* モーダル */}
			<Modal
				title="子供の名前を入力"
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			>
				<InputField
					type="text"
					value={newChildName}
					onChange={(e) => setNewChildName(e.target.value)}
					className="w-full px-4 py-2 border rounded"
					placeholder="名前を入力"
				/>
				<div className="mt-4 flex justify-end space-x-4">
					<CustomButton
						label="キャンセル"
						onClick={() => setIsDialogOpen(false)}
						className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200"
					/>
					<CustomButton
						label="追加"
						onClick={handleAddChild}
						className="bg-orange-300 text-black px-4 py-2 rounded hover:bg-orange-200"
					/>
				</div>
			</Modal>
		</div>
	);
};
