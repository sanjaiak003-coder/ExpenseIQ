import matplotlib.pyplot as plt
import matplotlib.patches as patches

fig, ax = plt.subplots(figsize=(2.2, 2.2), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Shield shape
shield = patches.Polygon([[5, 9.5], [8.5, 8.5], [8.5, 4.5], [5, 1.0], [1.5, 4.5], [1.5, 8.5]],
                         closed=True, facecolor='#1e3a8a', edgecolor='#dc2626', linewidth=2.5)
ax.add_patch(shield)

inner_shield = patches.Polygon([[5, 8.8], [7.8, 8.0], [7.8, 4.7], [5, 1.8], [2.2, 4.7], [2.2, 8.0]],
                               closed=True, facecolor='#ffffff', edgecolor='#f59e0b', linewidth=1.5)
ax.add_patch(inner_shield)

# Emblem text
ax.text(5, 7.2, "JCE", ha='center', va='center', fontsize=15, fontweight='bold', color='#dc2626', family='serif')
ax.text(5, 5.5, "ESTD\n1993", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#1e3a8a')
ax.text(5, 3.2, "CHENNAI", ha='center', va='center', fontsize=7, fontweight='bold', color='#1e3a8a')

plt.tight_layout()
plt.savefig("report_assets/college_logo.png", dpi=300, bbox_inches='tight', transparent=True)
plt.close()
print("College logo generated.")