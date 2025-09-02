import { useEffect, useState, useCallback, useRef } from 'react';
import { ChildTask } from './ChildTask';
import { PARENT_NOTIFY, TASK_STATUS, TASKS_COLLECTION } from '../../../config/api';
import { apiClient } from '../../../lib/apiClient';
import { getChildToken } from '../../../config/Token';

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

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
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
		<div className="p-10 m-15 h-[780px] bg-[url('/images/kokuban.png')] bg-no-repeat bg-cover bg-center flex flex-col">
			<h1 className="text-5xl font-bold text-white px-12 pt-12 text-center">
				おてつだい&nbsp;いちらん
			</h1>

			{error && <p className="text-center p-50 text-gray-500">{error}</p>}

			<ul className="space-y-3 flex justify-center items-center flex-col">
				{!tasks || tasks.length === 0 ? (
					<p className="text-center p-50 text-gray-400 text-2xl">
						いまできるおてつだいがないよ <br />
						親におてつだいをつくってもらおう！
					</p>
				) : (
					<div className="p-15 h-[500px] overflow-y-auto px-10 pb-5 custom-scrollbar">
						<ul className="space-y-3 flex flex-col items-center">
							{tasks.map((task) => (
								<ChildTask
									key={task.task_id}
									task={task}
									onNext={() => nextTaskStatus(task)}
								/>
							))}
						</ul>
					</div>
				)}
			</ul>
		</div>
	);
};
