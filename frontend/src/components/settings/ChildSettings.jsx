import { useEffect, useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import { Select } from "../common/Select";
import { CHILDREN_BASE, CHILDREN_LIST, CHILD_LOGIN_URL, KEYWORD_CHANGE } from "../../config/api";
import { apiClient } from "../../lib/apiClient";
import { Modal } from "../ui/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChildSettings = ({ setActiveTab }) => {
    const [keyword, setKeyword] = useState("");
    const [selectedChild, setSelectedChild] = useState("");
    const [children, setChildren] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newChildName, setNewChildName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // 子供全取得
    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const response = await apiClient.get(CHILDREN_LIST);
            setChildren(response.data.children);
            setSelectedChild(response.data.children[0]);
        } catch {
            toast.error("子供情報取得エラー");
        }
    };

    // 子ども追加ボタン処理
    const handleAddChild = async (e) => {
        e.preventDefault();
        if (!newChildName.trim()) {
            toast.error("名前を入力してください");
            return;
        }

        try {
            await apiClient.post(CHILDREN_BASE, { c_name: newChildName });
            setNewChildName("");
            setIsDialogOpen(false);
            toast.success("子供を追加しました");

            // 再取得
            await fetchChildren();
        } catch {
            toast.error("子供の追加に失敗しました");
        }
    };

    // 戻るボタン
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab("settings");
    };

    // 決定ボタン
    const handleSubmitClick = async (e) => {
        e.preventDefault();

        if (!keyword.trim()) {
            toast.error("あいことばを入力してください");
            return;
        }
        try {
            setIsSaving(true);
            await apiClient.post(KEYWORD_CHANGE, { newKeyword: keyword });

            toast.success("あいことばを更新しました");
            setKeyword("");
        } catch {
            toast.error("あいことばの更新に失敗しました")
        } finally {
            setIsSaving(false);
        }
    };

    // コピーボタン
    const handleCopyUrl = () => {
        if (!selectedChild) return;

        const url = `${CHILD_LOGIN_URL}${selectedChild.user_id}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success("URLをコピーしました");
            })
            .catch(() => {
                toast.error("コピーに失敗しました");
            });
    };

    return (
        <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold p-16">子供</h2>
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
                        className="w-32 h-10 bg-orange-300 text-black text-lg font-bold rounded-lg
                      mb-6 hover:bg-orange-200 transition-colors duration-300"
                    />
                </div>

                <p className="text-2xl">ログイン用URL</p>
                <Select
                    options={children.map((child) => ({
                        value: child.user_id,
                        label: child.c_name,
                    }))}
                    value={selectedChild ? selectedChild.user_id : ""}
                    onChange={(e) => {
                        const selected = children.find((c) => c.user_id === e.target.value);
                        setSelectedChild(selected);
                    }}
                    placeholder="子供を選択"
                    className="w-70"
                />
                <div className="flex items-center space-x-4 my-6">
                    <InputField
                        type="text"
                        placeholder=""
                        value={selectedChild ? `${CHILD_LOGIN_URL}${selectedChild.user_id}` : ""}
                        readOnly
                        className="my-6 w-100 h-10 px-4 border bg-white rounded-lg"
                    />
                    <CustomButton
                        type="button"
                        label="コピー"
                        onClick={handleCopyUrl}
                        className="w-25 h-10 bg-orange-300 text-black text-lg font-bold rounded-lg
                      hover:bg-orange-200 transition-colors duration-300"
                    />
                </div>
                <div className="mt-4 space-x-12">
                    <CustomButton
                        type="button"
                        label="戻る"
                        onClick={handleBackClick}
                        className="w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
                      transition-colors duration-300"
                    />
                    <CustomButton
                        type="button"
                        label="決定"
                        onClick={handleSubmitClick}
                        disabled={isSaving}
                        className="w-30 h-12 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
                      transition-colors duration-300"
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
