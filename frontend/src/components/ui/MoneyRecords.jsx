// components/ui/MoneyRecords.jsx

import React, { useState } from 'react'; // useState をインポート
import Select from './Select'; // 作成した Select コンポーネントをインポート

const MoneyRecords = () => {
    // 現在選択されている年を状態として管理
    const [selectedYear, setSelectedYear] = useState('2025');

    // ダミーデータ（実際はAPIから取得）
    const dummyOkozukaiRecords = [
        { month: '2025年5月', amount: 2050, choreCount: 18 },
        { month: '2025年4月', amount: 2000, choreCount: 20 },
        { month: '2025年3月', amount: 1990, choreCount: 19 },
        { month: '2025年2月', amount: 2300, choreCount: 22 },
    ];

    // Select コンポーネントに渡す年のオプション
    const yearOptions = [
        { value: '2025', label: '2025年' },
        { value: '2024', label: '2024年' },
        { value: '2023', label: '2023年' },
        // 動的に生成することも可能
    ];

    // 年が変更されたときのハンドラ
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        console.log('選択された年:', event.target.value);
        // ★★★ ここで、選択された年に応じておこづかい記録データをAPIから再取得するなどのロジックを追加 ★★★
    };

    // 選択された年に基づいて表示するデータをフィルタリング
    // 今回のダミーデータは年情報が固定なので、このフィルタリングは効果がないが、
    // 実際にはAPIから取得した複数の年のデータからフィルタリングする
    const filteredRecords = dummyOkozukaiRecords.filter(record =>
        record.month.startsWith(selectedYear)
    );

    return (
        <div className="p-8 bg-white rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">おこづかい記録</h2>

                {/* Select コンポーネントを使用 */}
                <Select
                    options={yearOptions}
                    value={selectedYear}
                    onChange={handleYearChange}
                // className="w-32" // 必要に応じて幅などを調整
                // placeholder="年を選択" // 初期値を設定しない場合に利用
                />
            </div>

            <div className="space-y-4">
                {filteredRecords.map((record, index) => ( // フィルタリングされたデータをマップ
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
                        <div className="text-gray-900 font-semibold text-lg">{record.month}</div>
                        <div className="flex items-center space-x-6">
                            <span className="text-xl font-bold text-green-600">¥{record.amount}</span>
                            <span className="text-gray-600 text-base">お手伝い回数：<span className="font-semibold">{record.choreCount}回</span></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoneyRecords;