import { useEffect, useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import { Select } from "../common/Select";
import { CHILDREN_BASE, CHILDREN_LIST } from "../../config/api";
import axios from "axios";
import { Modal } from "../ui/Modal";

export const ChildSettings = ({ setActiveTab }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [children, setChildren] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 子供全取得
  useEffect(() => {
    const fetchChildren = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("認証トークンが見つかりません");
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get(CHILDREN_LIST, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.length > 0) {
          setChildren(response.data);
          setSelectedChild(response.data[0]);
        }
      } catch (error) {
        console.error("子供情報取得エラー:", error);
        setErrorMessage("子供情報の取得に失敗しました");
        setTimeout(() => setErrorMessage(""), 3000);
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
      setErrorMessage('名前を入力してください');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        CHILDREN_BASE,
        { c_name: newChildName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewChildName("");
      setIsDialogOpen(false);
      setSuccessMessage('子供を追加しました ✅');

      // 表示後3秒でメッセージを自動的に消す
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('子供の追加に失敗しました');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }

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

  const url = `http://localhost:5173/child/login/${selectedChild.user_id}`;
  navigator.clipboard.writeText(url)
    .then(() => {
      setSuccessMessage("URLをコピーしました ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    })
    .catch(() => {
      setErrorMessage("コピーに失敗しました");
      setTimeout(() => setErrorMessage(""), 3000);
    });
};

  return (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      {successMessage && (
        <div>{successMessage}</div>
      )}
      {errorMessage && (
        <div>{errorMessage}</div>
      )}
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
            onChange={e => setKeyword(e.target.value)}
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
          options={children.map(child => ({
            value: child.user_id,
            label: child.c_name
          }))}
          value={selectedChild ? selectedChild.user_id : ''}
          onChange={e => {
            const selected = children.find(c => c.user_id === e.target.value);
            setSelectedChild(selected);
          }}
          placeholder="子供を選択"
          className="w-70"
        />
        <InputField
          type="text"
          placeholder=""
          value={selectedChild ? `http://localhost:5173/child/login/${selectedChild.user_id}` : ''}
          readOnly
          className="my-6 w-100 h-10 px-4 border bg-white rounded-lg"
        />
        <CustomButton 
          type="button"
          label="コピー"
          onClick={handleCopyUrl}
        />
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
            className="w-30 h-12 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
                      transition-colors duration-300"
          />
        </div>

      </div>
      {/* モーダル */}
      <Modal title="子供の名前を入力" isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <InputField
          type="text"
          value={newChildName}
          onChange={e => setNewChildName(e.target.value)}
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

  )
}