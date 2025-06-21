import { useEffect, useState } from "react";
import { CustomButton } from "./CustomButton";
import { Select } from "./Select";
import { InputField } from "./InputField";
import axios from "axios";

export const ChildSettings = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [children, setChildren] = useState([]);

  // useEffect(() => {
  //   const fetchChildren = async () => {
  //     try {
  //       const response = await axios.get("/api/children"); // あとでURLを追加
  //       setChildren(response.data);
  //     } catch (error) {
  //       console.error("子供の取得に失敗しました", error);
  //     }
  //   };

  //   fetchChildren();
  // }, []);

  useEffect(() => {
    // 仮データを用意
    const mockChildren = [
      { user_id: '1', c_name: '太郎' },
      { user_id: '2', c_name: '花子' },
      { user_id: '3', c_name: '次郎' }
    ];
    setChildren(mockChildren);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    console.log('ボタンが押されました');
  }

  // 戻るボタン
  const handleBackClick = (e) => {
    e.preventDefault();
    console.log('戻るボタンが押されました');
  };

  // 決定ボタン
  const handleSubmitClick = (e) => {
    e.preventDefault();
    console.log('決定ボタンが押されました');
  };
  return (
    <div>
      <h1>子供</h1>
      <p>あいことばの変更</p>
      <InputField
        type="text"
        placeholder=""
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        className=""
      />
      <CustomButton
        type="button"
        label="+子供の追加"
        onClick={handleClick}
        className=''
      />
      <p>ログイン用URL</p>
      <Select
        options={children.map(child => ({
          value: child.user_id,
          label: child.c_name
        }))}
        value={selectedChildId}
        onChange={e => setSelectedChildId(e.target.value)}
      />
      <InputField
        type="text"
        placeholder=""
        value={selectedChildId ? `仮のURLです/${selectedChildId}` : ''}
        readOnly
        className=""
      />
      <CustomButton
        type="button"
        label="戻る"
        onClick={handleBackClick}
        className=''
      />
      <CustomButton
        type="button"
        label="決定"
        onClick={handleSubmitClick}
        className=''
      />
    </div>
  )
}