import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Reports() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [reportData, setReportData] = useState(null);
    const [categoryBreakdown, setCategoryBreakdown] = useState(null);
    const [breakdownType, setBreakdownType] = useState('expense');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, [year]);

    useEffect(() => {
        loadCategoryBreakdown();
    }, [month, year, breakdownType]);

    const loadReport = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reports/monthly?year=${year}`);
            setReportData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCategoryBreakdown = async () => {
        try {
            const res = await api.get(`/reports/by-category?month=${month}&year=${year}&type=${breakdownType}`);
            setCategoryBreakdown(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const formatCurrency = (val) =>
        '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i).toLocaleString('default', { month: 'long' })
    );

    if (loading) {
        return <div className="loading-spinner"><div className="spinner" /></div>;
    }

    const summary = reportData?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };

    // Bar chart
    const barData = {
        labels: reportData?.months?.map((m) => m.monthName) || [],
        datasets: [
            {
                label: 'Income',
                data: reportData?.months?.map((m) => m.income) || [],
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22c55e',
                borderWidth: 1,
                borderRadius: 6,
                barPercentage: 0.8,
            },
            {
                label: 'Expenses',
                data: reportData?.months?.map((m) => m.expense) || [],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 1,
                borderRadius: 6,
                barPercentage: 0.8,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#a0a0b8', usePointStyle: true, padding: 20 } },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
                },
            },
        },
        scales: {
            x: { ticks: { color: '#6b6b84' }, grid: { display: false } },
            y: {
                ticks: {
                    color: '#6b6b84',
                    callback: (v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`,
                },
                grid: { color: 'rgba(255,255,255,0.04)' },
            },
        },
    };

    // Doughnut for category breakdown
    const doughnutData = categoryBreakdown?.breakdown?.length > 0
        ? {
            labels: categoryBreakdown.breakdown.map((b) => b.categoryName),
            datasets: [{
                data: categoryBreakdown.breakdown.map((b) => b.total),
                backgroundColor: categoryBreakdown.breakdown.map((b) => b.color),
                borderWidth: 0,
                hoverOffset: 8,
            }],
        }
        : null;

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { position: 'bottom', labels: { color: '#a0a0b8', padding: 14, usePointStyle: true } },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)} (${categoryBreakdown.breakdown[ctx.dataIndex]?.percentage}%)`,
                },
            },
        },
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p>Detailed financial analysis for {year}</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setYear(year - 1)}>← {year - 1}</button>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{year}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => setYear(year + 1)}>{year + 1} →</button>
                </div>
            </div>

            {/* Annual Summary */}
            <div className="report-summary">
                <div className="glass-card summary-item">
                    <div className="summary-label">Annual Income</div>
                    <div className="summary-value positive">{formatCurrency(summary.totalIncome)}</div>
                </div>
                <div className="glass-card summary-item">
                    <div className="summary-label">Annual Expenses</div>
                    <div className="summary-value negative">{formatCurrency(summary.totalExpense)}</div>
                </div>
                <div className="glass-card summary-item">
                    <div className="summary-label">Net Savings</div>
                    <div className={`summary-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(summary.balance)}
                    </div>
                </div>
                <div className="glass-card summary-item">
                    <div className="summary-label">Savings Rate</div>
                    <div className={`summary-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
                        {summary.totalIncome > 0 ? Math.round((summary.balance / summary.totalIncome) * 100) : 0}%
                    </div>
                </div>
            </div>

            {/* Monthly Bar Chart */}
            <div className="glass-card chart-card" style={{ marginBottom: 28 }}>
                <h3>Income vs Expenses by Month</h3>
                <div className="chart-wrapper" style={{ height: 320 }}>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="charts-grid">
                <div className="glass-card chart-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0 }}>Category Breakdown</h3>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select
                                className="input-field"
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                                style={{ padding: '6px 30px 6px 10px', fontSize: 13 }}
                            >
                                {monthNames.map((name, i) => (
                                    <option key={i} value={i + 1}>{name}</option>
                                ))}
                            </select>
                            <div className="tab-switcher">
                                <button className={`tab-btn ${breakdownType === 'expense' ? 'active' : ''}`}
                                    onClick={() => setBreakdownType('expense')} style={{ padding: '6px 12px', fontSize: 12 }}>
                                    Expense
                                </button>
                                <button className={`tab-btn ${breakdownType === 'income' ? 'active' : ''}`}
                                    onClick={() => setBreakdownType('income')} style={{ padding: '6px 12px', fontSize: 12 }}>
                                    Income
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        {doughnutData ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📊</div>
                                <p>No {breakdownType} data for {monthNames[month - 1]}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-card chart-card">
                    <h3 style={{ marginBottom: 16 }}>
                        {monthNames[month - 1]} {breakdownType === 'expense' ? 'Expenses' : 'Income'} Details
                    </h3>
                    {categoryBreakdown?.breakdown?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {categoryBreakdown.breakdown.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{item.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.categoryName}</span>
                                            <span style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(item.total)}</span>
                                        </div>
                                        <div style={{
                                            height: 6,
                                            background: 'var(--bg-input)',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${item.percentage}%`,
                                                background: item.color,
                                                borderRadius: 3,
                                                transition: 'width 0.5s ease',
                                            }} />
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36, textAlign: 'right' }}>
                                        {item.percentage}%
                                    </span>
                                </div>
                            ))}
                            <div style={{
                                marginTop: 12, paddingTop: 12,
                                borderTop: '1px solid var(--border-color)',
                                display: 'flex', justifyContent: 'space-between',
                                fontWeight: 700, fontSize: 15,
                            }}>
                                <span>Total</span>
                                <span>{formatCurrency(categoryBreakdown.grandTotal)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <p>No data for this period</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Monthly Summary Table */}
            <div className="glass-card" style={{ marginTop: 28, overflow: 'auto', padding: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Monthly Summary Table</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th style={{ textAlign: 'right' }}>Income</th>
                            <th style={{ textAlign: 'right' }}>Expenses</th>
                            <th style={{ textAlign: 'right' }}>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData?.months?.map((m) => (
                            <tr key={m.month}>
                                <td>{m.monthName}</td>
                                <td style={{ textAlign: 'right', color: 'var(--income-color)', fontWeight: 600 }}>
                                    {m.income > 0 ? formatCurrency(m.income) : '—'}
                                </td>
                                <td style={{ textAlign: 'right', color: 'var(--expense-color)', fontWeight: 600 }}>
                                    {m.expense > 0 ? formatCurrency(m.expense) : '—'}
                                </td>
                                <td style={{
                                    textAlign: 'right', fontWeight: 700,
                                    color: m.income - m.expense >= 0 ? 'var(--income-color)' : 'var(--expense-color)',
                                }}>
                                    {m.income > 0 || m.expense > 0 ? formatCurrency(m.income - m.expense) : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
