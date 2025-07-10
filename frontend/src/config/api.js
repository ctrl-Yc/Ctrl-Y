const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal ? 'http://localhost:3000' : '';

//親ユーザー
export const PARENT_BASE = `${API_BASE_URL}/api/parents`;
export const PARENT_SIGNUP = PARENT_BASE;
export const PARENT_LOGIN = `${PARENT_BASE}/login`;
export const PARENT_PASS_CHANGE = `${PARENT_BASE}/change`; // メールアドレス変更
export const PASS_RESET_REQUEST = `${PARENT_BASE}/rePassword`; // パスワードリセット用のメール送信
export const PASS_RESET = `${PARENT_BASE}/reset`;

//子供ユーザー
export const CHILDREN_BASE = `${API_BASE_URL}/api/children`;
export const CHILDREN_SIGNUP = CHILDREN_BASE;
export const CHILDREN_LOGIN = (child_id) => `${CHILDREN_BASE}/${child_id}/login`;

//タスク系
export const TASKS_BASE = `${API_BASE_URL}/api/tasks`;
export const TASK_STATUS = (taskId, nextStatus) => `${TASKS_BASE}/${taskId}/${nextStatus}`;

//一覧取得
export const TASKS_COLLECTION = (labels) => {
	if (labels === undefined) {
		return TASKS_BASE;
	} else if (Array.isArray(labels)) {
		return `${TASKS_BASE}?labels=${labels.join(',')}`;
	} else {
		return `${TASKS_BASE}?labels=${labels}`;
	}
};

//個別タスクURLを返す
export const taskUrl = (taskId) => `${TASKS_BASE}/${taskId}`;

export const PARENT_EMAIL_CHANGE = `${API_BASE_URL}/email`;		// メールアドレス変更
export const PARENT_EMAIL_GET = `${API_BASE_URL}/api/setting/`; // メールアドレス取得