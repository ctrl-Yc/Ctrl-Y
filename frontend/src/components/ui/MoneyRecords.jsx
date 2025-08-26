import { useEffect, useState } from "react";
import { Select } from "../common/Select";
import { apiClient } from "../../lib/apiClient";
import { CHILDREN_BASE, CHILDREN_LIST, TASKS_COLLECTION } from "../../config/api";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

const STATUS = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    WAIT_REVIEW: "WAIT_REVIEW",
    DONE: "DONE",
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

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
        { value: 'records', label: '過去のの記録' },
        { value: 'monthTasks', label: '今月の完了タスク' },
    ];


    // グラフ設定
    const chartData = {
        labels: records.map((record) =>
            new Date(record.inserted_month).toLocaleDateString("ja-JP", {
                month: "short",
            })
        ),
        datasets: [
            {
                label: "報酬額（円）",
                data: records.map((record) => record.reward),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.3, // 線を滑らかに
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "金額（円）",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "月",
                },
            },
        },
    };

    // 年を格納する配列
    const yearList = [];
    for (let y = 2023; y <= currentYear; y++) {
        yearList.unshift({ value: y.toString(), label: `${y}年` });
    }

    // 子供全取得
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await apiClient.get(CHILDREN_LIST);
                console.log(response.data)
                if (response.data.child.length > 0) {
                    setChildren(response.data.child);
                    setSelectedChild(response.data.child[0]);
                }
                setSelectedChild(response.data.children[0]);
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


            if (viewMode === "records") {
                // 過去の記録
                const response = await apiClient.get(
                    `${CHILDREN_BASE}/${selectedChild.user_id}/payments`,
                    { params: { year: selectedYear } }
                );
                setRecords(response.data.result);
            } else {
                // 今月の記録
                const response = await apiClient.get(TASKS_COLLECTION(["DONE"]), {
                    params: {
                        child_id: selectedChild.user_id
                    },
                });
                setDoneTasks(response.data)
                console.log(response)
                console.log(doneTasks)
            }
            try {

            } catch (error) {
                console.error("データ取得エラー:", error);
            }
        };
        fetchData();
    }, [selectedChild, selectedYear, viewMode]);

    return (
        <div className="m-10">
            <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold p-8">おこづかい記録</h2>
            </div>

            <div className="flex justify-end mb-8 mr-28">
                <Select
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-40 mr-10"
                />
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
            {/* グラフ */}
            <div className="flex justify-center mb-10 ">
                <div className="w-3/4 bg-white p-6 rounded-lg shadow">
                    <Line data={chartData} options={chartOptions} />
                </div>
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
                                    new Date(record.inserted_month).toLocaleDateString("ja-JP", {
                                        year: "numeric",
                                        month: "long",
                                    })}
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
