import { useEffect, useState, useCallback, useRef } from 'react';
import { ChildTask } from './ChildTask';
import { PARENT_NOTIFY, TASK_STATUS, TASKS_COLLECTION } from '../../../config/api';
import { apiClient } from '../../../lib/apiClient';
import { getChildToken } from '../../../config/Token';
import { Modal } from '../../ui/Modal';
import { ChildTaskDetail } from './ChildTaskDetail';

const STATUS = {
	TODO: 'TODO',
	IN_PROGRESS: 'IN_PROGRESS',
	WAIT_REVIEW: 'WAIT_REVIEW',
	DONE: 'DONE',
};

export const ChildTasks = ({ onLoadingChange }) => {
	const [tasks, setTasks] = useState([]);
	const [error, setError] = useState(null);
	const mountedRef = useRef(true);
	const [detailOpen, setDetailOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const openDetail = useCallback((id) => {
		setSelectedId(id);
		setDetailOpen(true);
	}, []);

	const closeDetail = useCallback(() => {
		setDetailOpen(false);
		setSelectedId(null);
	}, []);

	const fetchTasks = useCallback(async () => {
		onLoadingChange?.(true);
		setError(null);
		try {
			const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];
			const res = await apiClient.get(TASKS_COLLECTION(labels));
			if (!mountedRef.current) return;
			const sorted = (res.data ?? []).sort(
				(a, b) => new Date(a.deadline) - new Date(b.deadline)
			);
			setTasks(sorted);
		} catch (err) {
			console.error(err);
			if (mountedRef.current) setError('タスクの取得に失敗しました');
		} finally {
			if (mountedRef.current) onLoadingChange?.(false);
		}
	}, [onLoadingChange]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const getNextStatus = (currentStatus) => {
		const values = Object.values(STATUS);
		const normalized = (currentStatus || '').toUpperCase();
		const index = values.indexOf(normalized);
		return index < values.length - 1 ? values[index + 1] : null;
	};

	const nextTaskStatus = async (task) => {
		const next = getNextStatus(task.status);
		if (!next) return;
		onLoadingChange?.(true);
		try {
			await apiClient.patch(TASK_STATUS(task.task_id, next));
			if (next === STATUS.WAIT_REVIEW) {
				try {
					await apiClient.post(PARENT_NOTIFY, { parent_id: getChildToken() });
					console.log('親に通知を送信しました');
				} catch (notifyError) {
					console.error('親への通知送信に失敗しました:', notifyError);
				}
			}
			await fetchTasks();
		} catch (error) {
			console.error(error);
		} finally {
			onLoadingChange?.(false);
		}
	};

	return (
		<div className="h-[calc(100vh-120px)] w-full bg-[url('/images/kokuban.png')] bg-no-repeat bg-center md:bg-[length:100%_100%] mt-5 md:m-15 md:flex md:flex-col">
			<h1 className="text-5xl font-bold text-black px-12 pt-53 md:font-bold md:text-white md:px-12 md:pt-18 text-center">おてつだい&nbsp;いちらん</h1>

			{error && (
				<p className="text-center p-50 text-2xl text-red-500">{error}</p>
			)}


			<div className="md:p-15 h-[calc(100vh-400px)] overflow-y-auto md:px-10 md:pb-5 md:custom-scrollbar">
				<ul className="space-y-3 flex justify-center items-center flex-col">
					{(!tasks || tasks.length === 0) ? (
						<p className="text-center p-50 text-gray-400 text-2xl">
							いまできるおてつだいがないよ<br />
							親におてつだいをつくってもらおう！
						</p>
					) : (
						tasks.map((task) => (
							<li key={task.task_id} className="w-full flex justify-center">
								<ChildTask
									key={task.task_id}
									task={task}
									onOpenDetail={() => openDetail(task.task_id)}
									onNext={() => nextTaskStatus(task)}
								/>
							</li>
						))
					)}
				</ul>
			</div>

			<Modal
				title="おてつだいの詳細"
				isOpen={detailOpen}
				onClose={closeDetail}
				size="sm"
			>
				{detailOpen && selectedId && (
					<ChildTaskDetail
						taskId={selectedId}
						onClose={closeDetail}
						onUpdated={() => fetchTasks()}
					/>
				)}
			</Modal>
		</div>
	);
};