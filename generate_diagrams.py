import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

os.makedirs("report_assets", exist_ok=True)

# 1. Figure 3.1: System Architecture Diagram
fig, ax = plt.subplots(figsize=(6.5, 4.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

boxes = [
    (1, 8.2, 8, 1.0, "USER\n(Web Browser / Mobile Client)", "#f8fafc", "#334155"),
    (1, 6.4, 8, 1.0, "REACT FRONTEND (Vite / React 18 / Chart.js)", "#eff6ff", "#2563eb"),
    (1, 4.6, 8, 1.0, "AXIOS CLIENT / REST API HTTP REQUESTS", "#f1f5f9", "#475569"),
    (1, 2.8, 8, 1.0, "EXPRESS.JS & NODE.JS BACKEND (JWT Auth / Controllers / Store)", "#f0fdf4", "#16a34a"),
    (1, 1.0, 8, 1.0, "PERSISTENCE LAYER (MongoDB Database / Mongoose ODM)", "#fef2f2", "#dc2626"),
]

for x, y, w, h, text, bg, border in boxes:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1", facecolor=bg, edgecolor=border, linewidth=1.5)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=9.5, fontweight='bold', family='sans-serif', color='#0f172a')

# Arrows
arrow_y = [8.2, 6.4, 4.6, 2.8]
for y in arrow_y:
    ax.annotate('', xy=(5, y), xytext=(5, y+0.4),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1.5, headwidth=7, headlength=7))
    ax.annotate('', xy=(5, y+0.4), xytext=(5, y),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1.5, headwidth=7, headlength=7))

plt.tight_layout()
plt.savefig("report_assets/fig3_1_architecture.png", dpi=300, bbox_inches='tight')
plt.close()

# 2. Figure 3.2: Level 0 DFD
fig, ax = plt.subplots(figsize=(6.5, 3.2), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')

# User box
rect_user = patches.Rectangle((0.5, 2.0), 2.2, 2.0, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
ax.add_patch(rect_user)
ax.text(1.6, 3.0, "USER", ha='center', va='center', fontsize=11, fontweight='bold')

# System Circle
circle = patches.Circle((5.0, 3.0), 1.4, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
ax.add_patch(circle)
ax.text(5.0, 3.3, "ExpenseIQ", ha='center', va='center', fontsize=10.5, fontweight='bold')
ax.text(5.0, 2.7, "System (0)", ha='center', va='center', fontsize=10, fontweight='bold')

# Database Box
rect_db = patches.Rectangle((7.3, 2.0), 2.2, 2.0, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
ax.add_patch(rect_db)
ax.text(8.4, 3.0, "DATABASE", ha='center', va='center', fontsize=11, fontweight='bold')

# Left Arrows
ax.annotate('', xy=(3.6, 3.5), xytext=(2.7, 3.5),
            arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1, headwidth=6, headlength=6))
ax.text(3.15, 3.8, "requests", ha='center', va='center', fontsize=8.5)

ax.annotate('', xy=(2.7, 2.5), xytext=(3.6, 2.5),
            arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1, headwidth=6, headlength=6))
ax.text(3.15, 2.2, "responses", ha='center', va='center', fontsize=8.5)

# Right Arrows
ax.annotate('', xy=(7.3, 3.5), xytext=(6.4, 3.5),
            arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1, headwidth=6, headlength=6))
ax.text(6.85, 3.8, "read/write", ha='center', va='center', fontsize=8.5)

ax.annotate('', xy=(6.4, 2.5), xytext=(7.3, 2.5),
            arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1, headwidth=6, headlength=6))
ax.text(6.85, 2.2, "data", ha='center', va='center', fontsize=8.5)

plt.tight_layout()
plt.savefig("report_assets/fig3_2_dfd0.png", dpi=300, bbox_inches='tight')
plt.close()

# 3. Figure 3.3: Level 1 DFD
fig, ax = plt.subplots(figsize=(7.0, 5.0), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# User box
rect_u = patches.Rectangle((0.5, 4.0), 1.5, 2.0, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
ax.add_patch(rect_u)
ax.text(1.25, 5.0, "USER", ha='center', va='center', fontsize=10.5, fontweight='bold')

# 4 Process ovals
procs = [
    (8.2, "1.0 User Authentication\n& Profile Management", "D1 Users"),
    (5.8, "2.0 Category Management\n(Income / Expense)", "D2 Categories"),
    (3.4, "3.0 Transaction Logging\n& Filtering Engine", "D3 Transactions"),
    (1.0, "4.0 Monthly & Annual\nAnalytics Aggregation", "D4 Reports Data")
]

for y, p_text, d_text in procs:
    ellipse = patches.Ellipse((4.5, y), 2.8, 1.4, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
    ax.add_patch(ellipse)
    ax.text(4.5, y, p_text, ha='center', va='center', fontsize=8, fontweight='bold')
    
    # Arrow to process
    ax.annotate('', xy=(3.1, y), xytext=(2.0, 5.0),
                arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1, headwidth=5, headlength=5))
    
    # Data store box
    rect_d = patches.Rectangle((7.5, y-0.4), 2.2, 0.8, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.5)
    ax.add_patch(rect_d)
    ax.text(8.6, y, d_text, ha='center', va='center', fontsize=8.5, fontweight='bold')
    
    # Arrow to store
    ax.annotate('', xy=(7.5, y), xytext=(5.9, y),
                arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1, headwidth=5, headlength=5))

plt.tight_layout()
plt.savefig("report_assets/fig3_3_dfd1.png", dpi=300, bbox_inches='tight')
plt.close()

# 4. Figure 3.4: Use Case Diagram
fig, ax = plt.subplots(figsize=(6.5, 6.0), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 12)
ax.axis('off')

# Boundary box
rect_bound = patches.Rectangle((2.8, 0.5), 6.8, 11.0, facecolor='#ffffff', edgecolor='#0f172a', linewidth=1.5)
ax.add_patch(rect_bound)
ax.text(6.2, 11.1, "ExpenseIQ System Boundary", ha='center', va='center', fontsize=9.5, fontweight='bold')

# Actor stick figure on left
ax.plot([1.2, 1.2], [6.0, 7.0], color='#0f172a', linewidth=2) # body
ax.plot([0.8, 1.6], [6.7, 6.7], color='#0f172a', linewidth=2) # arms
ax.plot([1.2, 0.8], [6.0, 5.0], color='#0f172a', linewidth=2) # left leg
ax.plot([1.2, 1.6], [6.0, 5.0], color='#0f172a', linewidth=2) # right leg
actor_head = patches.Circle((1.2, 7.4), 0.35, facecolor='#ffffff', edgecolor='#0f172a', linewidth=2)
ax.add_patch(actor_head)
ax.text(1.2, 4.6, "User", ha='center', va='center', fontsize=10, fontweight='bold')

use_cases = [
    (10.0, "Register & Authenticate Account"),
    (8.8, "View Financial Dashboard & Summary"),
    (7.6, "Create / Update / Delete Transactions"),
    (6.4, "Filter Transactions by Month & Type"),
    (5.2, "Add & Customize Expense Categories"),
    (4.0, "View Monthly Trend & Doughnut Charts"),
    (2.8, "Analyze Annual Net Savings & Breakdown"),
    (1.6, "Manage Profile & Logout")
]

for y, uc_text in use_cases:
    ellipse = patches.Ellipse((6.2, y), 5.2, 0.9, facecolor='#f8fafc', edgecolor='#0f172a', linewidth=1.2)
    ax.add_patch(ellipse)
    ax.text(6.2, y, uc_text, ha='center', va='center', fontsize=8.5, fontweight='bold')
    # Line from actor
    ax.plot([1.6, 3.6], [6.7, y], color='#64748b', linewidth=1.0, linestyle='-')

plt.tight_layout()
plt.savefig("report_assets/fig3_4_usecase.png", dpi=300, bbox_inches='tight')
plt.close()

# 5. UI Mockups (Figure 6.1 to 6.5)
# Figure 6.1: Login Screen Mockup
fig, ax = plt.subplots(figsize=(6.5, 3.8), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')
rect_bg = patches.Rectangle((0, 0), 10, 6, facecolor='#0f0f1a', edgecolor='#334155', linewidth=1.5)
ax.add_patch(rect_bg)
rect_card = patches.Rectangle((2.5, 0.6), 5.0, 4.8, facecolor='#1a1a2e', edgecolor='#6366f1', linewidth=1.5)
ax.add_patch(rect_card)
ax.text(5.0, 4.8, "💰 ExpenseIQ", ha='center', va='center', fontsize=14, fontweight='bold', color='#ffffff')
ax.text(5.0, 4.3, "Sign in to your account", ha='center', va='center', fontsize=9, color='#a0a0b8')
# Inputs
ax.add_patch(patches.Rectangle((3.0, 3.3), 4.0, 0.6, facecolor='#2d2d44', edgecolor='#4b5563'))
ax.text(3.2, 3.6, "demo@expenseiq.com", va='center', fontsize=8.5, color='#ffffff')
ax.add_patch(patches.Rectangle((3.0, 2.3), 4.0, 0.6, facecolor='#2d2d44', edgecolor='#4b5563'))
ax.text(3.2, 2.6, "••••••••••••", va='center', fontsize=8.5, color='#ffffff')
# Button
ax.add_patch(patches.Rectangle((3.0, 1.3), 4.0, 0.65, facecolor='#6366f1', edgecolor='none'))
ax.text(5.0, 1.62, "Sign In", ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
ax.text(5.0, 0.9, "Don't have an account? Sign up", ha='center', va='center', fontsize=7.5, color='#a0a0b8')
plt.tight_layout()
plt.savefig("report_assets/fig6_1_login.png", dpi=300, bbox_inches='tight')
plt.close()

# Figure 6.2: Dashboard Screen Mockup
fig, ax = plt.subplots(figsize=(7.0, 4.2), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')
ax.add_patch(patches.Rectangle((0, 0), 10, 6, facecolor='#0f0f1a', edgecolor='#334155', linewidth=1.5))
# Sidebar
ax.add_patch(patches.Rectangle((0, 0), 2.2, 6, facecolor='#1a1a2e', edgecolor='#334155'))
ax.text(1.1, 5.4, "💰 ExpenseIQ", ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
ax.text(0.4, 4.6, "📊 Dashboard", va='center', fontsize=8, color='#6366f1', fontweight='bold')
ax.text(0.4, 4.0, "💳 Transactions", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 3.4, "🏷️ Categories", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 2.8, "📈 Reports", va='center', fontsize=8, color='#a0a0b8')

# Cards
ax.add_patch(patches.Rectangle((2.5, 4.4), 2.2, 1.2, facecolor='#1e1e32', edgecolor='#22c55e', linewidth=1))
ax.text(3.6, 5.2, "TOTAL INCOME", ha='center', fontsize=6.5, color='#a0a0b8')
ax.text(3.6, 4.7, "₹2,40,000", ha='center', fontsize=11, fontweight='bold', color='#22c55e')

ax.add_patch(patches.Rectangle((5.0, 4.4), 2.2, 1.2, facecolor='#1e1e32', edgecolor='#ef4444', linewidth=1))
ax.text(6.1, 5.2, "TOTAL EXPENSES", ha='center', fontsize=6.5, color='#a0a0b8')
ax.text(6.1, 4.7, "₹99,600", ha='center', fontsize=11, fontweight='bold', color='#ef4444')

ax.add_patch(patches.Rectangle((7.5, 4.4), 2.2, 1.2, facecolor='#1e1e32', edgecolor='#6366f1', linewidth=1))
ax.text(8.6, 5.2, "NET BALANCE", ha='center', fontsize=6.5, color='#a0a0b8')
ax.text(8.6, 4.7, "+₹1,40,400", ha='center', fontsize=11, fontweight='bold', color='#6366f1')

# Line chart area
ax.add_patch(patches.Rectangle((2.5, 0.4), 4.7, 3.7, facecolor='#1e1e32', edgecolor='#334155'))
ax.text(2.8, 3.8, "Monthly Trend (Income vs Expense)", fontsize=8, fontweight='bold', color='#ffffff')
# Simulated line chart
x_pts = np.linspace(2.8, 6.8, 6)
y_inc = [1.8, 2.0, 2.4, 2.8, 3.0, 3.2]
y_exp = [1.2, 1.5, 1.4, 1.8, 1.9, 2.1]
ax.plot(x_pts, y_inc, color='#22c55e', linewidth=2, marker='o', markersize=4)
ax.plot(x_pts, y_exp, color='#ef4444', linewidth=2, marker='o', markersize=4)

# Doughnut chart area
ax.add_patch(patches.Rectangle((7.5, 0.4), 2.2, 3.7, facecolor='#1e1e32', edgecolor='#334155'))
ax.text(8.6, 3.8, "Category Split", ha='center', fontsize=8, fontweight='bold', color='#ffffff')
# Mini pie chart
wedges, _ = ax.pie([45, 25, 15, 15], center=(8.6, 2.1), radius=0.9,
                   colors=['#f97316', '#3b82f6', '#ec4899', '#eab308'],
                   wedgeprops=dict(width=0.4, edgecolor='#1e1e32'))
ax.text(8.6, 2.1, "Expenses", ha='center', va='center', fontsize=6.5, color='#ffffff')

plt.tight_layout()
plt.savefig("report_assets/fig6_2_dashboard.png", dpi=300, bbox_inches='tight')
plt.close()

# Figure 6.3: Transactions Screen Mockup
fig, ax = plt.subplots(figsize=(7.0, 4.0), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')
ax.add_patch(patches.Rectangle((0, 0), 10, 6, facecolor='#0f0f1a', edgecolor='#334155', linewidth=1.5))
ax.add_patch(patches.Rectangle((0, 0), 2.2, 6, facecolor='#1a1a2e', edgecolor='#334155'))
ax.text(1.1, 5.4, "💰 ExpenseIQ", ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
ax.text(0.4, 4.6, "📊 Dashboard", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 4.0, "💳 Transactions", va='center', fontsize=8, color='#6366f1', fontweight='bold')
ax.text(0.4, 3.4, "🏷️ Categories", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 2.8, "📈 Reports", va='center', fontsize=8, color='#a0a0b8')

# Table container
ax.text(2.6, 5.4, "Transactions", fontsize=11, fontweight='bold', color='#ffffff')
ax.add_patch(patches.Rectangle((8.0, 5.1), 1.6, 0.6, facecolor='#6366f1', edgecolor='none'))
ax.text(8.8, 5.4, "+ Add Transaction", ha='center', va='center', fontsize=6.5, fontweight='bold', color='#ffffff')

# Table headers
ax.add_patch(patches.Rectangle((2.5, 0.5), 7.2, 4.3, facecolor='#1e1e32', edgecolor='#334155'))
headers = ["Date", "Description", "Category", "Type", "Amount"]
hx = [2.7, 3.8, 5.5, 7.2, 8.8]
for h, x in zip(headers, hx):
    ax.text(x, 4.4, h, fontsize=7.5, fontweight='bold', color='#a0a0b8')

# Rows
rows = [
    ("Oct 12", "New Running Shoes", "🛍️ Shopping", "expense", "-₹4,500", "#ef4444"),
    ("Oct 10", "UI Design Project", "💻 Freelance", "income", "+₹15,000", "#22c55e"),
    ("Oct 08", "Fuel & Metro Pass", "🚗 Transport", "expense", "-₹3,200", "#ef4444"),
    ("Oct 05", "Groceries & Dining", "🍔 Food", "expense", "-₹6,500", "#ef4444"),
    ("Oct 01", "Monthly Salary", "💰 Salary", "income", "+₹75,000", "#22c55e"),
]

ry = 3.7
for r in rows:
    ax.plot([2.5, 9.7], [ry+0.4, ry+0.4], color='#2d2d44', linewidth=0.8)
    ax.text(2.7, ry, r[0], fontsize=7, color='#ffffff')
    ax.text(3.8, ry, r[1], fontsize=7, color='#ffffff')
    ax.text(5.5, ry, r[2], fontsize=7, color='#ffffff')
    ax.text(7.2, ry, r[3].upper(), fontsize=6.5, color=r[5], fontweight='bold')
    ax.text(8.8, ry, r[4], fontsize=7, color=r[5], fontweight='bold')
    ry -= 0.65

plt.tight_layout()
plt.savefig("report_assets/fig6_3_transactions.png", dpi=300, bbox_inches='tight')
plt.close()

# Figure 6.4: Categories Screen Mockup
fig, ax = plt.subplots(figsize=(7.0, 3.8), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')
ax.add_patch(patches.Rectangle((0, 0), 10, 6, facecolor='#0f0f1a', edgecolor='#334155', linewidth=1.5))
ax.add_patch(patches.Rectangle((0, 0), 2.2, 6, facecolor='#1a1a2e', edgecolor='#334155'))
ax.text(1.1, 5.4, "💰 ExpenseIQ", ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
ax.text(0.4, 4.6, "📊 Dashboard", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 4.0, "💳 Transactions", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 3.4, "🏷️ Categories", va='center', fontsize=8, color='#6366f1', fontweight='bold')
ax.text(0.4, 2.8, "📈 Reports", va='center', fontsize=8, color='#a0a0b8')

ax.text(2.6, 5.4, "Categories Management", fontsize=11, fontweight='bold', color='#ffffff')
# Category Cards Grid
cats = [
    ("🍔", "Food & Dining", "Expense", "#f97316"),
    ("🚗", "Transportation", "Expense", "#3b82f6"),
    ("🛍️", "Shopping", "Expense", "#ec4899"),
    ("📄", "Bills & Utilities", "Expense", "#eab308"),
    ("💰", "Salary", "Income", "#22c55e"),
    ("💻", "Freelance", "Income", "#06b6d4")
]

grid_pos = [(2.6, 3.6), (5.0, 3.6), (7.4, 3.6), (2.6, 1.8), (5.0, 1.8), (7.4, 1.8)]
for (icon, name, c_type, color), (gx, gy) in zip(cats, grid_pos):
    ax.add_patch(patches.Rectangle((gx, gy), 2.2, 1.4, facecolor='#1e1e32', edgecolor='#334155', linewidth=1))
    ax.text(gx + 0.4, gy + 0.7, icon, fontsize=14, va='center')
    ax.text(gx + 0.9, gy + 0.85, name, fontsize=7.5, fontweight='bold', color='#ffffff')
    ax.text(gx + 0.9, gy + 0.5, c_type, fontsize=6.5, color='#a0a0b8')

plt.tight_layout()
plt.savefig("report_assets/fig6_4_categories.png", dpi=300, bbox_inches='tight')
plt.close()

# Figure 6.5: Reports Screen Mockup
fig, ax = plt.subplots(figsize=(7.0, 4.0), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')
ax.add_patch(patches.Rectangle((0, 0), 10, 6, facecolor='#0f0f1a', edgecolor='#334155', linewidth=1.5))
ax.add_patch(patches.Rectangle((0, 0), 2.2, 6, facecolor='#1a1a2e', edgecolor='#334155'))
ax.text(1.1, 5.4, "💰 ExpenseIQ", ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
ax.text(0.4, 4.6, "📊 Dashboard", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 4.0, "💳 Transactions", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 3.4, "🏷️ Categories", va='center', fontsize=8, color='#a0a0b8')
ax.text(0.4, 2.8, "📈 Reports", va='center', fontsize=8, color='#6366f1', fontweight='bold')

ax.text(2.6, 5.4, "Annual & Monthly Reports (2026)", fontsize=11, fontweight='bold', color='#ffffff')

# Mini Summary Cards
scards = [("Annual Income", "₹2,40,000", "#22c55e"), ("Annual Expense", "₹99,600", "#ef4444"), ("Net Savings", "₹1,40,400", "#22c55e"), ("Savings Rate", "59%", "#6366f1")]
cx = [2.6, 4.4, 6.2, 8.0]
for (s_label, s_val, s_col), x in zip(scards, cx):
    ax.add_patch(patches.Rectangle((x, 4.2), 1.6, 0.9, facecolor='#1e1e32', edgecolor='#334155'))
    ax.text(x+0.8, 4.75, s_label, ha='center', fontsize=6, color='#a0a0b8')
    ax.text(x+0.8, 4.4, s_val, ha='center', fontsize=8, fontweight='bold', color=s_col)

# Bar chart
ax.add_patch(patches.Rectangle((2.6, 0.4), 7.0, 3.5, facecolor='#1e1e32', edgecolor='#334155'))
ax.text(2.8, 3.5, "Monthly Comparison (Income vs Expense)", fontsize=8, fontweight='bold', color='#ffffff')
bx = np.arange(6) + 3.2
b_inc = [2.0, 2.0, 2.2, 2.5, 2.4, 2.8]
b_exp = [0.8, 1.1, 0.9, 1.2, 1.0, 1.3]
ax.bar(bx - 0.15, b_inc, width=0.25, color='#22c55e', label='Income')
ax.bar(bx + 0.15, b_exp, width=0.25, color='#ef4444', label='Expense')
ax.set_xticks(bx)
ax.set_xticklabels(["May", "Jun", "Jul", "Aug", "Sep", "Oct"], color='#a0a0b8', fontsize=7)

plt.tight_layout()
plt.savefig("report_assets/fig6_5_reports.png", dpi=300, bbox_inches='tight')
plt.close()

print("All diagrams generated successfully in report_assets/")