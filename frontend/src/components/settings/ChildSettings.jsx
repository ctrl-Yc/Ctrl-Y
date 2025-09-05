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
        <div className="
          h-[800px] w-[400px] bg-[url('/images/mobile_note.png')] bg-no-repeat bg-center bg-[length:380px_700px] mt-5
          md:m-15 md:h-full md:w-full md:bg-[url('/images/note.png')] md:bg-no-repeat md:bg-[length:100%_100%] md:bg-center md:flex md:flex-col
        ">
            <div className="
              ml-4 mt-6
              md:ml-[80px] md:mt-10
            ">
                <ToastContainer />
                <div className="flex justify-between items-center">
                    <h2 className="
                      text-3xl font-bold p-4
                      md:text-5xl md:p-16
                    ">子供</h2>
                </div>

                <div className="
                  mx-4 space-y-3
                  md:mx-20 md:space-y-4
                ">
                    <div>
                        <p className="
                          text-lg
                          md:text-2xl
                        ">あいことばの変更</p>
                        <InputField
                            type="text"
                            placeholder=""
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="
                              my-4 w-48 h-8 px-3 border bg-white rounded-lg
                              md:my-6 md:w-70 md:h-10 md:px-4
                            "
                        />
                    </div>

                    <div>
                        <CustomButton
                            type="button"
                            label="+子供の追加"
                            onClick={() => setIsDialogOpen(true)}
                            className="
                              w-24 h-8 bg-orange-300 text-black text-sm font-bold rounded-lg mb-4 hover:bg-orange-200 transition-colors duration-300
                              md:w-32 md:h-10 md:text-lg md:mb-6
                            "
                        />
                    </div>

                    <p className="
                      text-lg
                      md:text-2xl
                    ">ログイン用URL</p>
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
                        className="w-48 md:w-70"
                    />
                    <div className="
                      flex items-center space-x-2 my-4
                      md:space-x-4 md:my-6
                    ">
                        <InputField
                            type="text"
                            placeholder=""
                            value={selectedChild ? `${CHILD_LOGIN_URL}${selectedChild.user_id}` : ""}
                            readOnly
                            className="
                              my-4 w-60 h-8 px-3 border bg-white rounded-lg
                              md:my-6 md:w-100 md:h-10 md:px-4
                            "
                        />
                        <CustomButton
                            type="button"
                            label="コピー"
                            onClick={handleCopyUrl}
                            className="
                              w-16 h-8 bg-orange-300 text-black text-sm font-bold rounded-lg hover:bg-orange-200 transition-colors duration-300
                              md:w-25 md:h-10 md:text-lg
                            "
                        />
                    </div>
                    <div className="
                      mt-4 space-x-6
                      md:space-x-12
                    ">
                        <CustomButton
                            type="button"
                            label="戻る"
                            onClick={handleBackClick}
                            className="
                              w-20 h-8 bg-gray-300 text-black text-sm font-extrabold rounded-lg hover:bg-gray-200 transition-colors duration-300
                              md:w-30 md:h-12 md:text-2xl
                            "
                        />
                        <CustomButton
                            type="button"
                            label="決定"
                            onClick={handleSubmitClick}
                            disabled={isSaving}
                            className="
                              w-20 h-8 bg-orange-300 text-black text-sm font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300
                              md:w-30 md:h-12 md:text-2xl
                            "
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
        </div>
    );
};
