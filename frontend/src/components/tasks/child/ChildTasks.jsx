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
    <div className="
		h-[1580px] w-[725px] bg-[url('/images/mobile_note.png')] bg-no-repeat bg-center bg-[length:730px_1400px] mt-5
		md:m-10 md:m-15 md:h-[780px] md:w-[1400px] md:bg-[url('/images/kokuban.png')] md:bg-no-repeat md:bg-cover md:bg-center md:flex md:flex-col
	">
    <h1 className="
		text-5xl text-center
		font-bold text-black px-12 pt-53
		md:font-bold md:text-white md:px-12 md:pt-18 
	">おてつだい&nbsp;いちらん</h1>

    {error && (
        <p className="text-center p-50 text-2xl text-red-500">{error}</p>
    )}

    <div className="
			h-[1100px] overflow-y-auto
			md:p-15 md:h-[500px] md:overflow-y-auto md:px-10 md:pb-5 md:custom-scrollbar
			">
        <ul className="space-y-3 flex justify-center items-center flex-col">
        {(!tasks || tasks.length === 0) ? (
            <p className="text-center p-50 text-gray-400 text-2xl">
				いまできるおてつだいがないよ<br />
				親におてつだいをつくってもらおう！
            </p>
        ) : (
            tasks.map((task) => (
            <li key={task.task_id} className="w-full flex justify-center">
              <ChildTask task={task} onNext={() => nextTaskStatus(task)} />
            </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
