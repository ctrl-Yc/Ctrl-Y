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
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
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
          onClick={handleClick}
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
          value={selectedChildId}
          onChange={e => setSelectedChildId(e.target.value)}
          placeholder="子供を選択"
          className="w-70"
        />
        <InputField
          type="text"
          placeholder=""
          value={selectedChildId ? `仮のURLです/${selectedChildId}` : ''}
          readOnly
          className="my-6 w-100 h-10 px-4 border bg-white rounded-lg"
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
      
      
    </div>

  )
}