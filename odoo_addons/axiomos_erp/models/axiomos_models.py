from odoo import api, fields, models, _
from odoo.exceptions import ValidationError
from .core_logic import (
    compute_first_principles_metrics,
    evaluate_daily_time_blocks,
    evaluate_pod_metrics,
    validate_meeting_rules,
    calculate_walk_out_savings,
    compute_decision_grade,
)


class AxiomFirstPrinciples(models.Model):
    _name = 'axiomos.first.principles'
    _description = 'Modul 1 (Hulu): First Principles & Idiocy Index Deconstructor'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Masalah / Produk Target', required=True, tracking=True)
    industry_assumption = fields.Text(string='Asumsi Umum Industri (Analogi Pasar)')
    fundamental_truth = fields.Text(string='Fakta Fisika / Komponen Dasar (First Principles)')
    new_solution = fields.Text(string='Solusi Rekayasa Baru dari Nol')
    market_price = fields.Float(string='Harga Pasar Saat Ini', required=True, default=0.0, tracking=True)
    target_build_cost = fields.Float(string='Target Biaya Rakit Mandiri', required=True, default=0.0, tracking=True)
    line_ids = fields.One2many('axiomos.first.principles.line', 'canvas_id', string='Komponen Bahan Baku Dasar (BoM)')

    raw_material_cost = fields.Float(string='Total Biaya Material Dasar', compute='_compute_metrics', store=True)
    raw_cost_percentage = fields.Float(string='Rasio Material Dasar (%)', compute='_compute_metrics', store=True)
    idiocy_index = fields.Float(string='Idiocy Index (x)', compute='_compute_metrics', store=True)
    potential_savings_percent = fields.Float(string='Potensi Penghematan (%)', compute='_compute_metrics', store=True)
    verdict = fields.Selection([
        ('DATA_INCOMPLETE', 'Data Belum Lengkap'),
        ('INCREMENTAL', 'Optimasi Inkremental (<3x)'),
        ('HIGH_OPTIMIZATION_POTENTIAL', 'Potensi Efisiensi Tinggi (3x - 10x)'),
        ('RADICAL_BREAKTHROUGH_OPPORTUNITY', 'Peluang Terobosan Radikal (>=10x)'),
    ], string='Putusan First Principles', compute='_compute_metrics', store=True)
    spawned_pod_id = fields.Many2one('axiomos.erp.pod', string='DRI Pod Terbentuk', readonly=True)

    @api.depends('market_price', 'target_build_cost', 'line_ids.cost')
    def _compute_metrics(self):
        for rec in self:
            res = compute_first_principles_metrics(
                rec.market_price,
                [line.cost for line in rec.line_ids],
                rec.target_build_cost,
            )
            rec.raw_material_cost = res['raw_material_cost']
            rec.raw_cost_percentage = res['raw_cost_percentage']
            rec.idiocy_index = res['idiocy_index']
            rec.potential_savings_percent = res['potential_savings_percent']
            rec.verdict = res['verdict']

    def action_spawn_erp_pod(self):
        self.ensure_one()
        pod = self.env['axiomos.erp.pod'].create({
            'name': f'Pod: {self.name}',
            'mission': self.new_solution or self.fundamental_truth or self.name,
            'dri_name': self.env.user.name,
            'dri_user_id': self.env.user.id,
            'team_size': 5,
            'hierarchy_layers': 1,
            'budget_allocated': self.target_build_cost or self.raw_material_cost or 10000.0,
            'budget_spent': 0.0,
            'output_units': 10.0,
            'hours_logged': 4.0,
            'source_canvas_id': self.id,
        })
        self.spawned_pod_id = pod.id
        self.message_post(body=_('DRI Pod otonom "%s" berhasil dibuat di Modul 3 (Flat-Org Micro-ERP).') % pod.name)
        return {
            'type': 'ir.actions.act_window',
            'res_model': 'axiomos.erp.pod',
            'res_id': pod.id,
            'view_mode': 'form',
            'target': 'current',
        }


class AxiomFirstPrinciplesLine(models.Model):
    _name = 'axiomos.first.principles.line'
    _description = 'Komponen Dasar First Principles (BoM Line)'

    canvas_id = fields.Many2one('axiomos.first.principles', string='Canvas', required=True, ondelete='cascade')
    name = fields.Char(string='Komponen / Material Mentah', required=True)
    cost = fields.Float(string='Biaya Material Dasar', required=True, default=0.0)


class AxiomTimeSchedule(models.Model):
    _name = 'axiomos.time.schedule'
    _description = 'Modul 2 (Hulu): 5-Minute Time Blocking & Context Shield'
    _inherit = ['mail.thread']

    name = fields.Char(string='Nama Jadwal Harian', required=True, default='Jadwal Eksekusi Harian')
    schedule_date = fields.Date(string='Tanggal', required=True, default=fields.Date.context_today)
    designated_context = fields.Char(string='Konteks Utama Hari Ini (1 Hari 1 Konteks)', required=True)
    sleep_hours = fields.Float(string='Alokasi Tidur (Jam)', required=True, default=6.5)
    block_ids = fields.One2many('axiomos.time.block', 'schedule_id', string='Blok Waktu 5-Menit')

    total_scheduled_minutes = fields.Integer(string='Total Menit Terjadwal', compute='_compute_schedule_metrics', store=True)
    five_minute_slot_count = fields.Integer(string='Jumlah Slot 5-Menit', compute='_compute_schedule_metrics', store=True)
    five_min_aligned_ratio = fields.Integer(string='Disiplin Presisi 5-Menit (%)', compute='_compute_schedule_metrics', store=True)
    context_switch_violations = fields.Integer(string='Pelanggaran Context-Switch', compute='_compute_schedule_metrics', store=True)
    morning_deep_work_minutes = fields.Integer(string='Deep Work Pagi 07:00-11:00 (Menit)', compute='_compute_schedule_metrics', store=True)
    sleep_compliant = fields.Boolean(string='Tidur >= 6 Jam Terpenuhi', compute='_compute_schedule_metrics', store=True)
    focus_efficiency_score = fields.Integer(string='Skor Efisiensi Fokus (0-100)', compute='_compute_schedule_metrics', store=True)

    @api.depends('designated_context', 'sleep_hours', 'block_ids.start_minute', 'block_ids.duration_minutes', 'block_ids.context', 'block_ids.category')
    def _compute_schedule_metrics(self):
        for rec in self:
            blocks = [{
                'start_minute': b.start_minute,
                'duration_minutes': b.duration_minutes,
                'context': b.context,
                'category': b.category,
            } for b in rec.block_ids]
            res = evaluate_daily_time_blocks(rec.designated_context, rec.sleep_hours, blocks)
            rec.total_scheduled_minutes = res['total_scheduled_minutes']
            rec.five_minute_slot_count = res['five_minute_slot_count']
            rec.five_min_aligned_ratio = res['five_min_aligned_ratio']
            rec.context_switch_violations = res['context_switch_violations']
            rec.morning_deep_work_minutes = res['morning_deep_work_minutes']
            rec.sleep_compliant = res['sleep_compliant']
            rec.focus_efficiency_score = res['focus_efficiency_score']


class AxiomTimeBlock(models.Model):
    _name = 'axiomos.time.block'
    _description = 'Blok Mikro 5-Menit'
    _order = 'start_minute asc'

    schedule_id = fields.Many2one('axiomos.time.schedule', string='Jadwal', required=True, ondelete='cascade')
    name = fields.Char(string='Aktivitas Fokus', required=True)
    start_minute = fields.Integer(string='Menit Mulai dari 00:00 (misal 420 = 07:00)', required=True, default=420)
    duration_minutes = fields.Integer(string='Durasi (Kelipatan 5 Menit)', required=True, default=15)
    context = fields.Char(string='Konteks / Perusahaan', required=True)
    category = fields.Selection([
        ('DEEP_TECH', 'Deep Engineering / Produk'),
        ('CRITICAL_DECISION', 'Keputusan Kritis'),
        ('OPS_SYNC', 'Sinkronisasi Operasional'),
        ('RECOVERY', 'Pemulihan / Olahraga / Makan'),
    ], string='Kategori', required=True, default='DEEP_TECH')


class AxiomErpPod(models.Model):
    _name = 'axiomos.erp.pod'
    _description = 'Modul 3 (Tengah): Flat-Org DRI Pod & Autonomous Micro-ERP'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Nama Pod / Unit Otonom', required=True, tracking=True)
    mission = fields.Text(string='Misi / Output Utama')
    dri_user_id = fields.Many2one('res.users', string='User DRI', default=lambda self: self.env.user)
    dri_name = fields.Char(string='Nama DRI (Directly Responsible Individual)', required=True, tracking=True)
    team_size = fields.Integer(string='Ukuran Tim (Maks 8 A-Players)', required=True, default=5)
    hierarchy_layers = fields.Integer(string='Jumlah Layer Birokrasi (Maks 2)', required=True, default=1)

    budget_allocated = fields.Float(string='Anggaran Dialokasikan', required=True, default=0.0)
    budget_spent = fields.Float(string='Anggaran Terpakai (Real-Time)', required=True, default=0.0)
    output_units = fields.Float(string='Unit Output Selesai', required=True, default=1.0)
    hours_logged = fields.Float(string='Total Jam Kerja Aktual', required=True, default=1.0)
    source_canvas_id = fields.Many2one('axiomos.first.principles', string='Asal First Principles Canvas')

    budget_utilization_percent = fields.Float(string='Serapan Anggaran (%)', compute='_compute_pod_metrics', store=True)
    output_per_hour = fields.Float(string='Output per Jam', compute='_compute_pod_metrics', store=True)
    is_flat_compliant = fields.Boolean(string='Organisasi Datar (<=2 Layer)', compute='_compute_pod_metrics', store=True)
    is_small_team_compliant = fields.Boolean(string='Tim Kecil (<=8 Orang)', compute='_compute_pod_metrics', store=True)
    has_clear_dri = fields.Boolean(string='DRI Jelas', compute='_compute_pod_metrics', store=True)
    is_autonomous = fields.Boolean(string='Status Otonom Penuh', compute='_compute_pod_metrics', store=True)

    @api.depends('hierarchy_layers', 'team_size', 'dri_name', 'budget_allocated', 'budget_spent', 'output_units', 'hours_logged')
    def _compute_pod_metrics(self):
        for rec in self:
            res = evaluate_pod_metrics(
                rec.hierarchy_layers,
                rec.team_size,
                rec.dri_name,
                rec.budget_allocated,
                rec.budget_spent,
                rec.output_units,
                rec.hours_logged,
            )
            rec.budget_utilization_percent = res['budget_utilization_percent']
            rec.output_per_hour = res['output_per_hour']
            rec.is_flat_compliant = res['is_flat_compliant']
            rec.is_small_team_compliant = res['is_small_team_compliant']
            rec.has_clear_dri = res['has_clear_dri']
            rec.is_autonomous = res['is_autonomous']


class AxiomMeeting(models.Model):
    _name = 'axiomos.meeting'
    _description = 'Modul 4 (Hilir): Anti-Meeting Gatekeeper & Burn-Rate Tracker'
    _inherit = ['mail.thread']

    name = fields.Char(string='Judul Rapat', required=True, tracking=True)
    expected_decision = fields.Char(string='Target Keputusan Konkret (Wajib >= 10 Karakter)', required=True, tracking=True)
    duration_minutes = fields.Integer(string='Durasi Rapat (Maks 30 Menit)', required=True, default=15)
    participant_ids = fields.One2many('axiomos.meeting.participant', 'meeting_id', string='Peserta Kontributor Aktif')

    state = fields.Selection([
        ('draft', 'Draft / Gatekeeper Check'),
        ('approved', 'Disetujui (Lean Meeting)'),
        ('done', 'Selesai / Dieksekusi'),
    ], string='Status', default='draft', tracking=True)

    is_gatekeeper_approved = fields.Boolean(string='Lolos Gatekeeper', compute='_compute_meeting_metrics', store=True)
    gatekeeper_issues = fields.Text(string='Catatan Pelanggaran Gatekeeper', compute='_compute_meeting_metrics', store=True)
    burn_rate_per_minute = fields.Float(string='Burn-Rate per Menit', compute='_compute_meeting_metrics', store=True)
    burn_rate_per_second = fields.Float(string='Burn-Rate per Detik', compute='_compute_meeting_metrics', store=True)
    projected_total_cost = fields.Float(string='Estimasi Biaya Rapat Total', compute='_compute_meeting_metrics', store=True)
    total_walkout_cost_saved = fields.Float(string='Total Penghematan Walk-Out', compute='_compute_meeting_metrics', store=True)

    @api.depends(
        'expected_decision',
        'duration_minutes',
        'participant_ids.contribution_role',
        'participant_ids.hourly_rate_cost',
        'participant_ids.is_spectator',
        'participant_ids.cost_saved',
    )
    def _compute_meeting_metrics(self):
        for rec in self:
            participants = [{
                'contribution_role': p.contribution_role,
                'hourly_rate_cost': p.hourly_rate_cost,
                'is_spectator': p.is_spectator,
            } for p in rec.participant_ids]
            res = validate_meeting_rules(rec.expected_decision, rec.duration_minutes, participants)
            rec.is_gatekeeper_approved = res['approved']
            rec.gatekeeper_issues = '\n'.join(f'• {issue}' for issue in res['issues']) if res['issues'] else 'Semua syarat rapat efisien terpenuhi.'
            rec.burn_rate_per_minute = res['burn_rate_per_minute']
            rec.burn_rate_per_second = res['burn_rate_per_second']
            rec.projected_total_cost = res['projected_total_cost']
            rec.total_walkout_cost_saved = sum(p.cost_saved for p in rec.participant_ids)

    def action_approve_meeting(self):
        for rec in self:
            if not rec.is_gatekeeper_approved:
                raise ValidationError(_('Rapat Ditolak oleh Anti-Meeting Gatekeeper:\n%s') % rec.gatekeeper_issues)
            rec.state = 'approved'


class AxiomMeetingParticipant(models.Model):
    _name = 'axiomos.meeting.participant'
    _description = 'Peserta Rapat & Protokol Walk-Out'

    meeting_id = fields.Many2one('axiomos.meeting', string='Rapat', required=True, ondelete='cascade')
    name = fields.Char(string='Nama Peserta', required=True)
    contribution_role = fields.Char(string='Peran Kontribusi Langsung', required=True)
    hourly_rate_cost = fields.Float(string='Biaya Waktu per Jam', required=True, default=100.0)
    is_spectator = fields.Boolean(string='Penonton Pasif (Spectator)?', default=False)
    walked_out = fields.Boolean(string='Melakukan Walk-Out?', default=False)
    walk_out_minute = fields.Integer(string='Menit Saat Walk-Out', default=5)
    minutes_saved = fields.Integer(string='Menit Produktif Dihemat', compute='_compute_walkout', store=True)
    cost_saved = fields.Float(string='Biaya Dihemat dari Walk-Out', compute='_compute_walkout', store=True)

    @api.depends('walked_out', 'walk_out_minute', 'hourly_rate_cost', 'meeting_id.duration_minutes')
    def _compute_walkout(self):
        for rec in self:
            if rec.walked_out:
                res = calculate_walk_out_savings(rec.meeting_id.duration_minutes, rec.walk_out_minute, rec.hourly_rate_cost)
                rec.minutes_saved = res['minutes_saved']
                rec.cost_saved = res['cost_saved']
            else:
                rec.minutes_saved = 0
                rec.cost_saved = 0.0

    def action_walk_out(self):
        for rec in self:
            rec.walked_out = True
            if not rec.walk_out_minute:
                rec.walk_out_minute = 5
            rec.meeting_id.message_post(
                body=_('Walk-Out Protocol: %s meninggalkan rapat pada menit ke-%s dan menghemat %s menit waktu produktif.')
                % (rec.name, rec.walk_out_minute, rec.minutes_saved)
            )


class AxiomDecision(models.Model):
    _name = 'axiomos.decision'
    _description = 'Modul 4 (Hilir): High-Velocity Decision Log'
    _order = 'id desc'

    name = fields.Char(string='Keputusan yang Diambil', required=True)
    dri_name = fields.Char(string='Pengambil Keputusan (DRI)', required=True)
    hours_to_decide = fields.Float(string='Waktu Pengambilan Keputusan (Jam)', required=True, default=1.0)
    impact_summary = fields.Text(string='Dampak Eksekusi')
    velocity_grade = fields.Selection([
        ('S', 'Grade S (<= 6 Jam — Kecepatan Ekstrem)'),
        ('A', 'Grade A (<= 24 Jam — Cepat & Agile)'),
        ('B', 'Grade B (<= 48 Jam — Moderat)'),
        ('C', 'Grade C (> 48 Jam — Lambat / Birokratis)'),
    ], string='Peringkat Kecepatan', compute='_compute_grade', store=True)

    @api.depends('hours_to_decide')
    def _compute_grade(self):
        for rec in self:
            rec.velocity_grade = compute_decision_grade(rec.hours_to_decide)
