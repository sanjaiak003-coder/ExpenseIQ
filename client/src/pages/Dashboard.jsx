import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { HiTrendingUp, HiTrendingDown, HiCash } from 'react-icons/hi';
import api from '../api/axios';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [reportRes, catRes, txnRes] = await Promise.all([
        api.get('/reports/monthly'),
        api.get('/reports/by-category'),
        api.get('/transactions?limit=5'),
      ]);
      setReport(reportRes.data);
      setCategoryData(catRes.data);
      setRecentTxns(txnRes.data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  const summary = report?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };

  const formatCurrency = (val) =>
    '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const lineData = {
    labels: report?.months?.map((m) => m.monthName) || [],
    datasets: [
      {
        label: 'Income',
        data: report?.months?.map((m) => m.income) || [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#22c55e',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: report?.months?.map((m) => m.expense) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ef4444',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#a0a0b8', usePointStyle: true, padding: 20 } },
    },
    scales: {
      x: { ticks: { color: '#6b6b84' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#6b6b84' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  const doughnutData = {
    labels: categoryData?.breakdown?.map((b) => b.categoryName) || [],
    datasets: [
      {
        data: categoryData?.breakdown?.map((b) => b.total) || [],
        backgroundColor: categoryData?.breakdown?.map((b) => b.color) || [],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom', labels: { color: '#a0a0b8', padding: 16, usePointStyle: true } },
    },
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Your financial overview for {report?.year || new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card income">
          <div className="stat-icon"><HiTrendingUp /></div>
          <div className="stat-label">Total Income</div>
          <div className="stat-value" style={{ color: 'var(--income-color)' }}>{formatCurrency(summary.totalIncome)}</div>
        </div>
        <div className="glass-card stat-card expense">
          <div className="stat-icon"><HiTrendingDown /></div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value" style={{ color: 'var(--expense-color)' }}>{formatCurrency(summary.totalExpense)}</div>
        </div>
        <div className="glass-card stat-card balance">
          <div className="stat-icon"><HiCash /></div>
          <div className="stat-label">Balance</div>
          <div className="stat-value" style={{ color: summary.balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)' }}>
            {formatCurrency(summary.balance)}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-card chart-card">
          <h3>Monthly Trend</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="glass-card chart-card">
          <h3>Expenses by Category</h3>
          <div className="chart-wrapper">
            {categoryData?.breakdown?.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No expense data this month</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card recent-transactions">
        <h3>Recent Transactions</h3>
        {recentTxns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No transactions yet</h3>
            <p>Start by adding your first transaction</p>
          </div>
        ) : (
          recentTxns.map((txn) => (
            <div className="recent-item" key={txn._id}>
              <div className="r-icon" style={{ background: txn.category?.color ? txn.category.color + '20' : 'var(--bg-input)' }}>
                {txn.category?.icon || '📁'}
              </div>
              <div className="r-details">
                <div className="r-desc">{txn.description || txn.category?.name}</div>
                <div className="r-cat">{txn.category?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`r-amount ${txn.type}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </div>
                <div className="r-date">{formatDate(txn.date)}</div>
              </div>
            </div>
          ))
        )}
        {recentTxns.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/transactions" className="btn btn-ghost btn-sm">View All Transactions</Link>
          </div>
        )}
      </div>
    </div>
  );
}