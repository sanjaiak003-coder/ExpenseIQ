import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import api from '../api/axios';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTxn, setEditingTxn] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Filters
    const [filterType, setFilterType] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

    // Form
    const [form, setForm] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadTransactions(1);
    }, [filterType, filterMonth, filterYear]);

    const loadCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadTransactions = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (filterType) params.set('type', filterType);
            if (filterMonth) params.set('month', filterMonth);
            if (filterYear) params.set('year', filterYear);

            const res = await api.get(`/transactions?${params}`);
            setTransactions(res.data.transactions);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingTxn(null);
        setForm({
            type: 'expense',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
        setShowModal(true);
    };

    const openEditModal = (txn) => {
        setEditingTxn(txn);
        setForm({
            type: txn.type,
            amount: txn.amount.toString(),
            category: txn.category?._id || '',
            description: txn.description || '',
            date: new Date(txn.date).toISOString().split('T')[0],
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, amount: parseFloat(form.amount) };
            if (editingTxn) {
                await api.put(`/transactions/${editingTxn._id}`, payload);
            } else {
                await api.post('/transactions', payload);
            }
            setShowModal(false);
            loadTransactions(pagination.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving transaction');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setDeleteConfirm(null);
            loadTransactions(pagination.page);
        } catch (err) {
            alert('Error deleting transaction');
        }
    };

    const filteredCategories = categories.filter((c) => c.type === form.type);

    const formatCurrency = (val) =>
        '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const months = [
        { value: '', label: 'All Months' },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: (i + 1).toString(),
            label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
        })),
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Manage your income and expenses</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <HiPlus /> Add Transaction
                </button>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <select className="input-field" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <select className="input-field" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
                <input
                    type="number"
                    className="input-field"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    placeholder="Year"
                    style={{ width: 100 }}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : transactions.length === 0 ? (
                <div className="glass-card empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No transactions found</h3>
                    <p>Try adjusting your filters or add a new transaction</p>
                </div>
            ) : (
                <div className="glass-card" style={{ overflow: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn._id}>
                                    <td>{formatDate(txn.date)}</td>
                                    <td>{txn.description || '—'}</td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            {txn.category?.icon} {txn.category?.name}
                                        </span>
                                    </td>
                                    <td><span className={`type-badge ${txn.type}`}>{txn.type}</span></td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: txn.type === 'income' ? 'var(--income-color)' : 'var(--expense-color)' }}>
                                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(txn)} title="Edit">
                                                <HiPencil />
                                            </button>
                                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDeleteConfirm(txn._id)} title="Delete"
                                                style={{ color: 'var(--expense-color)' }}>
                                                <HiTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="pagination">
                    <button className="page-btn" disabled={pagination.page <= 1} onClick={() => loadTransactions(pagination.page - 1)}>
                        ← Prev
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                            onClick={() => loadTransactions(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button className="page-btn" disabled={pagination.page >= pagination.pages} onClick={() => loadTransactions(pagination.page + 1)}>
                        Next →
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTxn ? 'Edit Transaction' : 'Add Transaction'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiX /></button>
                        </div>
                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Type</label>
                                <div className="tab-switcher">
                                    <button type="button" className={`tab-btn ${form.type === 'expense' ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, type: 'expense', category: '' })}>
                                        Expense
                                    </button>
                                    <button type="button" className={`tab-btn ${form.type === 'income' ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, type: 'income', category: '' })}>
                                        Income
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Category</label>
                                <select
                                    className="input-field"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {filteredCategories.map((c) => (
                                        <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="What was this for?"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingTxn ? 'Update' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
                        <h2 style={{ marginBottom: 12 }}>Delete Transaction?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                            This action cannot be undone. Are you sure you want to delete this transaction?
                        </p>
                        <div className="confirm-actions">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
