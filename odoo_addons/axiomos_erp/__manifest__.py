{
    'name': 'AxiomOS — First-Principles Hulu-Hilir ERP',
    'version': '20.0.1.0.0',
    'category': 'Productivity/Management',
    'summary': 'Implementasi Hulu-ke-Hilir First Principles Thinking, 5-Min Timebox, Flat-Org DRI Pods, dan Anti-Meeting Gatekeeper di Odoo 20.',
    'description': """
AxiomOS for Odoo 20
===================
Mengintegrasikan 4 pilar operasional Hulu ke Hilir ke dalam Odoo:
1. HULU 1 — First Principles Lab & Idiocy Index Deconstructor (BoM vs Market Price)
2. HULU 2 — 5-Minute Micro-Block Time Engine & One-Day-One-Context Shield
3. TENGAH — Flat-Org DRI Pods (Max 2 Hierarchy Layers, <=8 Team Size, Real-Time Output/Hour)
4. HILIR — Anti-Meeting Burn-Rate Gatekeeper, Walk-Out Protocol & Decision Velocity Tracker
    """,
    'author': 'Ridlo Abelian / AxiomOS Contributors',
    'website': 'https://axiomos.ridloabelian.workers.dev',
    'license': 'MIT',
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/axiomos_views.xml',
        'data/seed_data.xml',
    ],
    'application': True,
    'installable': True,
    'auto_install': False,
}
