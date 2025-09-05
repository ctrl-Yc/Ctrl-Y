import { useEffect, useMemo, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// 今月の最終日
const getLastDayOfThisMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

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
        { value: 'records', label: '過去の記録' },
        { value: 'monthTasks', label: '今月の完了タスク' },
    ];

    // 1〜12月の固定ラベル
    const monthLabelsAll = useMemo(
        () => Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
        []
    );

    // records → 年の月別合計（欠けは0埋め）
    const { monthRewardData } = useMemo(() => {
        const arr = Array(12).fill(0);

        const yearNum = Number(selectedYear);

        (records ?? []).forEach((r) => {
            const d = r.inserted_month ? new Date(r.inserted_month) : null;
            if (!d) return;
            // 表示している年だけ集計
            if (d.getFullYear() !== yearNum) return;

            const m = d.getMonth(); // 0..11
            arr[m] += Number(r.reward ?? 0);
            // cnt[m] += Number(r.number ?? 0); // 件数合計が必要なら
        });

        return { monthRewardData: arr /*, monthCountData: cnt*/ };
    }, [records, selectedYear]);

    // doneTasks → 今月の日別集計（合計金額＆件数）
    const { dayLabelsAll, dayRewardData, dayCountData, filledDayIndexes } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthIdx = now.getMonth(); // 0-based
        const last = getLastDayOfThisMonth();

        const labels = Array.from({ length: last }, (_, i) => `${i + 1}日`);
        const rewardSumByDay = Array(last).fill(0);
        const countByDay = Array(last).fill(0);

        doneTasks.forEach((t) => {
            const when = t.updated_at;
            if (!when) return;
            const d = new Date(when);

            if (d.getFullYear() !== year || d.getMonth() !== monthIdx) return;

            const idx = d.getDate() - 1; // 0-based
            rewardSumByDay[idx] += Number(t.reward ?? 0);
            countByDay[idx] += 1;
        });

        // “記録がある日”のインデックスだけ抽出
        const filled = [];
        for (let i = 0; i < last; i++) {
            if (countByDay[i] > 0 || rewardSumByDay[i] > 0) filled.push(i);
        }

        return {
            dayLabelsAll: labels,
            dayRewardData: rewardSumByDay,
            dayCountData: countByDay,
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
    const chartData =
        viewMode === "records"
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
                        borderDash: [6, 4], // 視覚的に区別
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
                    text: viewMode === "records" ? "月" : "日",
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
    const yearList = [];
    for (let y = 2023; y <= currentYear; y++) {
        yearList.unshift({ value: y.toString(), label: `${y}年` });
    }

    // 子供全取得
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await apiClient.get(CHILDREN_LIST);
                for (const child of response.data.children) {
                    setChildren((prevChildren) => [...prevChildren, child]);
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

            try {
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
                    setDoneTasks(response.data);
                }
            } catch (error) {
                console.error("データ取得エラー:", error);
            }
        };
        fetchData();
    }, [selectedChild, selectedYear, viewMode]);

    return (
        <div className="
            h-[800px] w-[400px] bg-[url('/images/mobile_note.png')] bg-no-repeat bg-center bg-[length:380px_700px] mt-5
            md:m-15 md:h-full md:w-full md:bg-[url('/images/note.png')] md:bg-no-repeat md:bg-[length:100%_100%] md:bg-center md:flex md:flex-col
        ">
            <div className="
                flex justify-between items-center px-6 pt-8
                md:px-20 md:pt-15
            ">
                <h2 className="
                    text-3xl font-bold p-4
                    md:text-5xl md:p-8
                ">おこづかい記録</h2>
            </div>

            <div className="
                flex flex-row justify-end mb-8 space-x-4 mt-[-60px]
                md:mr-28
            ">
                <Select
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-32 mr-4 md:w-40 md:mr-10"
                />
                <Select
                    options={children.map((c) => ({ value: c.user_id, label: c.c_name }))}
                    value={selectedChild ? selectedChild.user_id : ""}
                    onChange={handleChildChange}
                    className="w-20 mr-4 md:w-26 md:mr-10"
                />
            {viewMode === 'records' && (
                    <Select
                        options={yearList}
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-20 mr-4 md:w-26 md:mr-10"
                    />
            )}
            </div>
            <div className="
                flex justify-center mb-10
                md:mb-10
            ">
                <div className="
                    w-[310px] bg-white p-1 rounded-lg shadow
                    md:w-3/4 md:p-6
                " style={{ height: 320 }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
            {viewMode === "monthTasks" ? (
                <div className="flex justify-center">
                    <div className="
                        w-[350px] overflow-x-auto
                        md:w-[950px]
                    ">
                        <div className="flex space-x-2">
                            {filledDayIndexes.map((i) => (
                            <div
                                key={i}
                                className="
                                    min-w-[80px] bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex flex-col justify-between shadow-sm
                                    md:min-w-[100px] md:px-6 md:py-5
                                "
                            >
                                <div className="
                                    text-gray-900 font-semibold text-lg mb-2 text-center
                                    md:text-2xl md:mb-3
                                ">
                                {dayLabelsAll[i]}
                                </div>
                                <div className="flex flex-col space-y-2 items-center md:space-y-3">
                                    <span className="
                                        font-semibold text-sm
                                        md:text-xl
                                    ">{dayCountData[i]}件</span>
                                <span className="
                                    text-lg font-bold text-green-600
                                    md:text-2xl
                                ">
                                    ¥{dayRewardData[i]}
                                </span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="
                        w-[350px] overflow-x-auto
                        md:w-250
                    ">
                        <div className="flex space-x-4 md:space-x-6">
                            {records.map((record) => (
                                <div
                                    key={`${record.user_id}-${record.inserted_month}`}
                                    className="
                                        min-w-[200px] bg-gray-250 border border-gray-400 rounded-lg px-3 py-2 flex flex-col justify-between shadow-sm
                                        md:min-w-[270px] md:px-4 md:py-3
                                    "
                                >
                                <div className="
                                    text-gray-900 font-semibold text-xl mb-1 text-center
                                    md:text-3xl md:mb-2
                                ">
                                    {record.inserted_month &&
                                    new Date(record.inserted_month).toLocaleDateString("ja-JP", {
                                        year: "numeric",
                                        month: "long",
                                    })}
                                </div>
                                <div className="flex flex-col space-y-2 items-center md:space-y-3">
                                    <span className="
                                        text-gray-600 text-sm
                                        md:text-base
                                    ">
                                        お小遣い：
                                        <span className="
                                            text-lg font-bold text-green-600
                                            md:text-2xl
                                        ">
                                            ¥{record.reward}
                                        </span>
                                    </span>
                                    <span className="
                                        text-gray-600 text-sm
                                        md:text-base
                                    ">
                                        お手伝い回数：
                                        <span className="
                                            font-semibold text-lg
                                            md:text-2xl
                                        ">{record.number}回</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};
