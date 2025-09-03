import { useEffect, useState, useMemo } from "react";
import { TASKS_COLLECTION } from "../../../config/api";
import { Select } from "../../common/Select";
import { apiClient } from "../../../lib/apiClient";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// 今月の最終日
const getLastDayOfThisMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

export const ChildMoneyRecords = () => {
    const [doneTasks, setDoneTasks] = useState([]);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('monthly');

    // ビューモードのオプション
    const viewModeOptions = [
        { value: 'monthly', label: '月ごと' },
        { value: 'daily', label: '日ごと' },
    ];

    useEffect(() => {
        const fetchDoneTasks = async () => {
            try {
                const response = await apiClient.get(TASKS_COLLECTION(["DONE"]));
                setDoneTasks(response.data);
            } catch (error) {
                console.error(error);
                setError("データの取得に失敗しました");
            }
        };

        fetchDoneTasks();
    }, []);

    // 1〜12月の固定ラベル
    const monthLabelsAll = useMemo(
        () => Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
        []
    );

    // 月別集計（過去の記録）
    const { monthRewardData, monthCountData, filledMonthIndexes } = useMemo(() => {
        const rewardArr = Array(12).fill(0);
        const countArr = Array(12).fill(0);
        const currentYear = new Date().getFullYear();

        (doneTasks ?? []).forEach((t) => {
            const when = t.updated_at;
            if (!when) return;
            const d = new Date(when);
            
            // 今年のデータのみ集計
            if (d.getFullYear() !== currentYear) return;

            const m = d.getMonth(); // 0..11
            rewardArr[m] += Number(t.reward ?? 0);
            countArr[m] += 1;
        });

        // "記録がある月"のインデックスだけ抽出
        const filled = [];
        for (let i = 0; i < 12; i++) {
            if (countArr[i] > 0 || rewardArr[i] > 0) filled.push(i);
        }

        return { 
            monthRewardData: rewardArr,
            monthCountData: countArr,
            filledMonthIndexes: filled
        };
    }, [doneTasks]);

    // 今月の日別集計（合計金額とタスク）
    const { dayLabelsAll, dayRewardData, dayTasksData, filledDayIndexes } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthIdx = now.getMonth(); // 0-based
        const last = getLastDayOfThisMonth();

        const labels = Array.from({ length: last }, (_, i) => `${i + 1}日`);
        const rewardSumByDay = Array(last).fill(0);
        const tasksByDay = Array(last).fill(null).map(() => []);

        doneTasks.forEach((t) => {
            const when = t.updated_at;
            if (!when) return;
            const d = new Date(when);

            if (d.getFullYear() !== year || d.getMonth() !== monthIdx) return;

            const idx = d.getDate() - 1; // 0-based
            rewardSumByDay[idx] += Number(t.reward ?? 0);
            tasksByDay[idx].push(t);
        });

        // "記録がある日"のインデックスだけ抽出
        const filled = [];
        for (let i = 0; i < last; i++) {
            if (tasksByDay[i].length > 0 || rewardSumByDay[i] > 0) filled.push(i);
        }

        return {
            dayLabelsAll: labels,
            dayRewardData: rewardSumByDay,
            dayTasksData: tasksByDay,
            filledDayIndexes: filled,
        };
    }, [doneTasks]);

    // 累計金額の配列
    const monthCumulativeData = useMemo(() => {
        let acc = 0;
        return monthRewardData.map(v => (acc += v));
    }, [monthRewardData]);

    const dayCumulativeData = useMemo(() => {
        let acc = 0;
        return dayRewardData.map(v => (acc += v));
    }, [dayRewardData]);

    // グラフ設定
    const chartData = viewMode === "monthly"
        ? {
            labels: monthLabelsAll,
            datasets: [
                {
                    label: "報酬額（円）",
                    data: monthRewardData,
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    tension: 0.3,
                    fill: true,
                },
                {
                    label: "累計（円）",
                    data: monthCumulativeData,
                    borderColor: "rgba(0,0,0,0.7)",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    tension: 0.2,
                    fill: false,
                    borderDash: [6, 4],
                },
            ],
        }
        : {
            labels: dayLabelsAll,
            datasets: [
                {
                    label: "日別報酬額（円）",
                    data: dayRewardData,
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    tension: 0.3,
                    fill: true,
                },
                {
                    label: "累計（円）",
                    data: dayCumulativeData,
                    borderColor: "rgba(0,0,0,0.7)",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    tension: 0.2,
                    fill: false,
                    borderDash: [6, 4],
                },
            ],
        };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
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
                    text: viewMode === "monthly" ? "月" : "日",
                },
                type: "category",
                ticks: {
                    autoSkip: false,   // 全日付を表示
                    maxRotation: 0,    // ラベル回転なし
                    minRotation: 0,
                },
                grid: { display: false },
            },
        },
    };



    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="m-15 h-full w-full bg-[url('/images/note.png')] bg-no-repeat bg-[length:100%_100%] bg-center flex flex-col">
            {/* タイトル */}
            <div className="flex justify-between items-center px-20 pt-15 mt-2">
                <h2 className="text-5xl font-bold p-8">おこづかい記録</h2>
            </div>

            {/* フィルタ（ビューモード切り替えと日付セレクタ） */}
            <div className="flex flex-row justify-end mb-8 mr-28 space-x-4 mt-[-60px]">
                <Select
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-40 mr-10"
                />
            </div>

            {/* コンテンツ */}
            {viewMode === 'monthly' ? (
                <>
                    {/* グラフ */}
                    <div className="flex justify-center mb-10">
                        <div className="w-3/4 bg-white p-6 rounded-lg shadow" style={{ height: 320 }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                    
                    {/* 月別カード */}
                    {filledMonthIndexes.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-3xl mt-30">
                            今年完了したおてつだいはまだありません。
                        </p>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-[950px] overflow-x-auto">
                                <div className="flex space-x-6">
                                    {filledMonthIndexes.map((i) => (
                                        <div
                                            key={i}
                                            className="min-w-[270px] bg-gray-250 border border-gray-400 rounded-lg px-4 py-3 flex flex-col justify-between shadow-sm"
                                        >
                                            <div className="text-gray-900 font-semibold text-3xl mb-2 text-center">
                                                {monthLabelsAll[i]}
                                            </div>
                                            <div className="flex flex-col space-y-3 items-center">
                                                <span className="font-semibold text-xl">{monthCountData[i]}件</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ¥{monthRewardData[i]}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : viewMode === 'daily' ? (
                <>
                    {/* グラフ */}
                    <div className="flex justify-center mb-10">
                        <div className="w-3/4 bg-white p-6 rounded-lg shadow" style={{ height: 320 }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                    
                    {/* 日別バーとタスク一覧 */}
                    {filledDayIndexes.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-3xl mt-30">
                            今月完了したおてつだいはまだありません。
                        </p>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-[950px] overflow-x-auto">
                                <div className="flex space-x-2">
                                    {filledDayIndexes.map((i) => (
                                        <div
                                            key={i}
                                            className="min-w-[130px] bg-gray-50 border border-gray-300 rounded-lg px-6 py-5 flex flex-col justify-between shadow-sm"
                                        >
                                            <div className="text-gray-900 font-semibold text-2xl mb-3 text-center">
                                                {dayLabelsAll[i]}
                                            </div>
                                            <div className="flex flex-col space-y-3 items-center">
                                                <span className="font-semibold text-xl">{dayTasksData[i].length}件</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ¥{dayRewardData[i]}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : null}

        </div>
    );
};
