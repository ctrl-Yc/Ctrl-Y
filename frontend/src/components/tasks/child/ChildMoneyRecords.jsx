import { useEffect, useState, useMemo } from "react";
import { TASKS_COLLECTION, CHILDREN_BASE } from "../../../config/api";
import { Select } from "../../common/Select";
import { apiClient } from "../../../lib/apiClient";
import { getUserIdFromToken } from "../../../config/Token";
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
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    // ビューモードのオプション
    const viewModeOptions = [
        { value: 'monthly', label: '過去の記録' },
        { value: 'daily', label: '今月の完了タスク' },
    ];

    // データ取得
    useEffect(() => {
        const fetchData = async () => {
            try {
                const childId = getUserIdFromToken();
                if (!childId) {
                    setError("ユーザー情報の取得に失敗しました");
                    return;
                }

                if (viewMode === "monthly") {
                    // 過去の記録（paymentsテーブルから）
                    const response = await apiClient.get(
                        `${CHILDREN_BASE}/${childId}/payments`,
                        { params: { year: selectedYear } }
                    );
                    setRecords(response.data.result);
                } else {
                    // 今月の完了タスク（tasksテーブルから）
                    const response = await apiClient.get(TASKS_COLLECTION(["DONE"]), {
                        params: {
                            child_id: childId
                        }
                    });
                    setDoneTasks(response.data);
                }
            } catch (error) {
                console.error(error);
                setError("データの取得に失敗しました");
            }
        };

        fetchData();
    }, [viewMode, selectedYear]);

    // 1〜12月の固定ラベル
    const monthLabelsAll = useMemo(
        () => Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
        []
    );

    // 月別集計（過去の記録）
    const { monthRewardData, monthCountData, filledMonthIndexes } = useMemo(() => {
        const rewardArr = Array(12).fill(0);
        const countArr = Array(12).fill(0);
        const yearNum = Number(selectedYear);

        (records ?? []).forEach((r) => {
            const d = r.inserted_month ? new Date(r.inserted_month) : null;
            if (!d) return;
            // 表示している年だけ集計
            if (d.getFullYear() !== yearNum) return;

            const m = d.getMonth(); // 0..11
            rewardArr[m] += Number(r.reward ?? 0);
            countArr[m] += Number(r.number ?? 0);
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
    }, [records, selectedYear]);

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

    // 年を格納する配列
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let y = 2023; y <= currentYear; y++) {
        yearList.unshift({ value: y.toString(), label: `${y}年` });
    }



    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="m-15 h-full w-full bg-[url('/images/note.png')] bg-no-repeat bg-[length:100%_100%] bg-center flex flex-col">
            {/* タイトル */}
            <div className="flex justify-between items-center px-20 pt-15 mt-2">
                <h2 className="text-5xl font-bold p-8">おこづかい記録</h2>
            </div>

            {/* フィルタ（ビューモード切り替えと年選択） */}
            <div className="flex flex-row justify-end mb-8 mr-28 space-x-4 mt-[-60px]">
                <Select
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-40 mr-10"
                />
                {viewMode === 'monthly' && (
                    <Select
                        options={yearList}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-26 mr-10"
                    />
                )}
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
                    {records.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-3xl mt-30">
                            {selectedYear}年の記録はまだありません。
                        </p>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-250 overflow-x-auto">
                                <div className="flex space-x-6">
                                    {records.map((record) => (
                                        <div
                                            key={`${record.user_id}-${record.inserted_month}`}
                                            className="min-w-[270px] bg-gray-250 border border-gray-400 rounded-lg px-4 py-3 flex flex-col justify-between shadow-sm"
                                        >
                                            <div className="text-gray-900 font-semibold text-3xl mb-2 text-center">
                                                {record.inserted_month &&
                                                new Date(record.inserted_month).toLocaleDateString("ja-JP", {
                                                    year: "numeric",
                                                    month: "long",
                                                })}
                                            </div>
                                            <div className="flex flex-col space-y-3 items-center">
                                                <span className="text-gray-600 text-base">
                                                    お小遣い：
                                                    <span className="text-2xl font-bold text-green-600">
                                                        ¥{record.reward}
                                                    </span>
                                                </span>
                                                <span className="text-gray-600 text-base">
                                                    お手伝い回数：
                                                    <span className="font-semibold text-2xl">{record.number}回</span>
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
