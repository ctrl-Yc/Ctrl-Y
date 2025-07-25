import { useEffect, useState } from "react"; // useState をインポート
import { Select } from "../common/Select";
import axios from "axios";
import { CHILDREN_BASE, CHILDREN_LIST } from "../../config/api";

export const MoneyRecords = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [records, setRecords] = useState([]);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [viewMode, setViewMode] = useState('records');
    const [doneTasks, setDoneTasks] = useState([]);

    // 過去の記録、今月の記録の切り替え
    const viewModeOptions = [
        { value: 'records', label: '月ごとの記録' },
        { value: 'monthTasks', label: '今月の完了タスク' },
    ];

    // 年を格納する配列
    const yearList = [];
    for (let y = 2023; y <= currentYear; y++) {
        yearList.unshift({ value: y.toString(), label: `${y}年` });
    }

    // 子供全取得
    useEffect(() => {
        const fetchChildren = async () => {
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
            }
        };
        fetchChildren();
    }, []);

    // 年変更
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    // 子供変更
    const handleChildChange = (e) => {
        const child = children.find((c) => c.user_id === e.target.value);
        setSelectedChild(child);
    };

    // 子供と年を指定して記録を取得
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild?.user_id) return;
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    `${CHILDREN_BASE}/${selectedChild.user_id}/payments`,
                    {
                        params: {
                            year: selectedYear,
                        },
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setRecords(response.data);
            } catch (error) {
                console.error("データ取得エラー:", error);
            }
        };
        fetchData();
    }, [selectedChild, selectedYear]);

        return (
            <div className="m-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-5xl font-bold p-8">おこづかい記録</h2>
                </div>

                <div className="flex justify-end mb-8 mr-28">
                    <Select
                        options={children.map((c) => ({ value: c.user_id, label: c.c_name }))}
                        value={selectedChild ? selectedChild.user_id : ""}
                        onChange={handleChildChange}
                        className="w-26 mr-10"
                    />
                </div>
                <div className="flex justify-end mb-8 mr-28">
                    <Select
                        options={yearList}
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-26 mr-10"
                    />
                </div>
                <div className="flex justify-center">
                    <div className="w-3/4 h-6 space-y-8">
                        {records.map((record) => (
                            <div
                                key={`${record.user_id}-${record.inserted_month}`}
                                className="bg-gray-50 h-30 border border-gray-200 rounded-lg px-20 flex items-center justify-between shadow-sm"
                            >
                                <div className="text-gray-900 font-semibold text-2xl">
                                    {record.inserted_month &&
                                        new Date(record.inserted_month).toLocaleDateString(
                                            "ja-JP",
                                            { year: "numeric", month: "long" }
                                        )}
                                </div>
                                <div className="flex items-center space-x-10">
                                    <span className="text-xl font-bold text-green-600">
                                        ¥{record.reward}
                                    </span>
                                    <span className="text-gray-600 text-base">
                                        お手伝い回数：
                                        <span className="font-semibold">{record.number}回</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };
