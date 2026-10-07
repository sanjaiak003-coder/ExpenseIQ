import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import api from '../api/axios';

const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#64748b',
];

const ICONS = ['📁', '💰', '💵', '💳', '🏠', '🍔', '🚗', '🛍️', '📄', '🎬', '🏥', '📚', '💻', '📈', '✈️', '🎮', '🏋️', '📦', '🎁', '☕'];

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [activeTab, setActiveTab] = useState('expense');

    const [form, setForm] = useState({
        name: '',
        type: 'expense',
        color: '#6366f1',
        icon: '📁',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingCat(null);
        setForm({ name: '', type: activeTab, color: '#6366f1', icon: '📁' });
        setShowModal(true);
    };

    const openEditModal = (cat) => {
        setEditingCat(cat);
        setForm({ name: cat.name, type: cat.type, color: cat.color, icon: cat.icon });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCat) {
                await api.put(`/categories/${editingCat._id}`, form);
            } else {
                await api.post('/categories', form);
            }
            setShowModal(false);
            loadCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setDeleteConfirm(null);
            loadCategories();
        } catch (err) {
            alert('Error deleting category');
        }
    };

    const filtered = categories.filter((c) => c.type === activeTab);

    if (loading) {
        return <div className="loading-spinner"><div className="spinner" /></div>;
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Categories</h1>
                    <p>Organize your transactions with custom categories</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <HiPlus /> Add Category
                </button>
            </div>

            <div style={{ marginBottom: 20 }}>
                <div className="tab-switcher">
                    <button className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expense')}>
                        Expense
                    </button>
                    <button className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`}
                        onClick={() => setActiveTab('income')}>
                        Income
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="glass-card empty-state">
                    <div className="empty-icon">🏷️</div>
                    <h3>No {activeTab} categories yet</h3>
                    <p>Create your first {activeTab} category</p>
                </div>
            ) : (
                <div className="categories-grid">
                    {filtered.map((cat) => (
                        <div className="glass-card category-card" key={cat._id}>
                            <div className="cat-icon" style={{ background: cat.color + '20' }}>
                                {cat.icon}
                            </div>
                            <div className="cat-info">
                                <div className="cat-name">{cat.name}</div>
                                <div className="cat-type">{cat.type}</div>
                            </div>
                            <div className="cat-actions">
                                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(cat)} title="Edit">
                                    <HiPencil />
                                </button>
                                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDeleteConfirm(cat._id)} title="Delete"
                                    style={{ color: 'var(--expense-color)' }}>
                                    <HiTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCat ? 'Edit Category' : 'Add Category'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiX /></button>
                        </div>
                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Category name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            {!editingCat && (
                                <div className="input-group">
                                    <label>Type</label>
                                    <div className="tab-switcher">
                                        <button type="button" className={`tab-btn ${form.type === 'expense' ? 'active' : ''}`}
                                            onClick={() => setForm({ ...form, type: 'expense' })}>
                                            Expense
                                        </button>
                                        <button type="button" className={`tab-btn ${form.type === 'income' ? 'active' : ''}`}
                                            onClick={() => setForm({ ...form, type: 'income' })}>
                                            Income
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="input-group">
                                <label>Icon</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {ICONS.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setForm({ ...form, icon })}
                                            style={{
                                                width: 40, height: 40, fontSize: 20,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: 'var(--radius-sm)',
                                                border: form.icon === icon ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                                background: form.icon === icon ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Color</label>
                                <div className="color-options">
                                    {COLORS.map((color) => (
                                        <div
                                            key={color}
                                            className={`color-option ${form.color === color ? 'selected' : ''}`}
                                            style={{ background: color }}
                                            onClick={() => setForm({ ...form, color })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCat ? 'Update' : 'Add Category'}
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
                        <h2 style={{ marginBottom: 12 }}>Delete Category?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                            This will also delete all transactions in this category. This action cannot be undone.
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
