"""
Pure Python domain logic for AxiomOS (Odoo 20 Addon).
Mirrors src/core/engine.js so that all 4 Hulu-Hilir pillars behave identically
across the standalone Web OS and the Odoo 20 ERP Addon.
"""


def compute_first_principles_metrics(market_price, component_costs, target_build_cost=0.0):
    market_price = float(market_price or 0.0)
    raw_material_cost = sum(float(c or 0.0) for c in (component_costs or []))

    if market_price <= 0 or raw_material_cost <= 0:
        return {
            'raw_material_cost': raw_material_cost,
            'raw_cost_percentage': 0.0,
            'idiocy_index': 0.0,
            'potential_savings_percent': 0.0,
            'verdict': 'DATA_INCOMPLETE',
        }

    raw_cost_percentage = round((raw_material_cost / market_price) * 100.0, 2)
    idiocy_index = round(market_price / raw_material_cost, 2)
    effective_target = float(target_build_cost) if float(target_build_cost or 0.0) > 0 else raw_material_cost * 2.5
    potential_savings_percent = max(
        0.0,
        round(((market_price - effective_target) / market_price) * 100.0, 1),
    )

    verdict = 'INCREMENTAL'
    if idiocy_index >= 10.0:
        verdict = 'RADICAL_BREAKTHROUGH_OPPORTUNITY'
    elif idiocy_index >= 3.0:
        verdict = 'HIGH_OPTIMIZATION_POTENTIAL'

    return {
        'raw_material_cost': raw_material_cost,
        'raw_cost_percentage': raw_cost_percentage,
        'idiocy_index': idiocy_index,
        'potential_savings_percent': potential_savings_percent,
        'verdict': verdict,
    }


def evaluate_daily_time_blocks(designated_context, sleep_hours, blocks):
    designated_context = (designated_context or 'General').strip()
    sleep_hours = float(sleep_hours or 0.0)
    block_list = list(blocks or [])

    total_scheduled_minutes = 0
    five_min_aligned_count = 0
    context_switch_violations = 0
    context_transitions = 0
    morning_deep_work_minutes = 0
    previous_context = None

    sorted_blocks = sorted(block_list, key=lambda b: int(b.get('start_minute', 0)))

    for block in sorted_blocks:
        duration = int(block.get('duration_minutes', 0) or 0)
        start_min = int(block.get('start_minute', 0) or 0)
        ctx = (block.get('context') or '').strip()
        category = block.get('category') or 'DEEP_TECH'

        total_scheduled_minutes += duration

        if duration > 0 and duration % 5 == 0 and start_min % 5 == 0:
            five_min_aligned_count += 1

        if ctx and ctx != designated_context and category != 'RECOVERY':
            context_switch_violations += 1

        if previous_context and ctx and ctx != previous_context and category != 'RECOVERY':
            context_transitions += 1

        if category != 'RECOVERY' and ctx:
            previous_context = ctx

        if 420 <= start_min < 660 and category in ('DEEP_TECH', 'CRITICAL_DECISION'):
            morning_deep_work_minutes += duration

    five_minute_slot_count = total_scheduled_minutes // 5
    sleep_compliant = sleep_hours >= 6.0
    context_penalty = (context_switch_violations * 15) + (context_transitions * 8)
    sleep_penalty = 0 if sleep_compliant else round((6.0 - sleep_hours) * 20)
    morning_bonus = min(20, (morning_deep_work_minutes // 15) * 4)

    focus_efficiency_score = max(0, min(100, 85 - context_penalty - sleep_penalty + morning_bonus))
    aligned_ratio = round((five_min_aligned_count / len(block_list)) * 100) if block_list else 100

    return {
        'total_scheduled_minutes': total_scheduled_minutes,
        'five_minute_slot_count': five_minute_slot_count,
        'five_min_aligned_ratio': aligned_ratio,
        'context_switch_violations': context_switch_violations,
        'context_transitions': context_transitions,
        'morning_deep_work_minutes': morning_deep_work_minutes,
        'sleep_compliant': sleep_compliant,
        'focus_efficiency_score': focus_efficiency_score,
    }


def evaluate_pod_metrics(hierarchy_layers, team_size, dri_name, budget_allocated, budget_spent, output_units, hours_logged):
    depth = int(hierarchy_layers or 1)
    size = int(team_size or 1)
    allocated = float(budget_allocated or 0.0)
    spent = float(budget_spent or 0.0)
    units = float(output_units or 0.0)
    hours = max(1.0, float(hours_logged or 1.0))

    is_flat_compliant = depth <= 2
    is_small_team_compliant = size <= 8
    has_clear_dri = bool(dri_name and str(dri_name).strip())
    is_autonomous = is_flat_compliant and is_small_team_compliant and has_clear_dri

    budget_utilization_percent = round((spent / allocated) * 100.0, 1) if allocated > 0 else 0.0
    output_per_hour = round(units / hours, 2)

    return {
        'is_flat_compliant': is_flat_compliant,
        'is_small_team_compliant': is_small_team_compliant,
        'has_clear_dri': has_clear_dri,
        'is_autonomous': is_autonomous,
        'budget_utilization_percent': budget_utilization_percent,
        'output_per_hour': output_per_hour,
    }


def validate_meeting_rules(expected_decision, duration_minutes, participants):
    issues = []
    goal = (expected_decision or '').strip()
    duration = int(duration_minutes or 0)
    part_list = list(participants or [])

    if len(goal) < 10:
        issues.append('Rapat wajib memiliki 1 keputusan/output konkret yang jelas (minimal 10 karakter).')
    if len(part_list) == 0:
        issues.append('Rapat membutuhkan minimal 1 kontributor langsung.')
    if len(part_list) > 6:
        issues.append('Terlalu banyak peserta (>6 orang). Pangkas menjadi tim kecil yang berkontribusi langsung.')

    passive = [
        p for p in part_list
        if not (p.get('contribution_role') or '').strip() or bool(p.get('is_spectator'))
    ]
    if passive:
        issues.append(f'{len(passive)} peserta tidak memiliki peran kontribusi langsung (penonton pasif dilarang).')

    if duration > 30:
        issues.append('Durasi rapat melebihi 30 menit. Pecah atau persingkat menjadi blok 5-25 menit yang to-the-point.')

    total_hourly = sum(float(p.get('hourly_rate_cost', 0.0) or 0.0) for p in part_list)
    burn_per_min = round(total_hourly / 60.0, 2)
    burn_per_sec = round(total_hourly / 3600.0, 2)
    projected_cost = round(burn_per_min * duration, 2)

    return {
        'approved': len(issues) == 0,
        'issues': issues,
        'burn_rate_per_minute': burn_per_min,
        'burn_rate_per_second': burn_per_sec,
        'projected_total_cost': projected_cost,
    }


def calculate_walk_out_savings(duration_minutes, walk_out_minute, participant_hourly_rate):
    total_duration = max(0, int(duration_minutes or 30))
    elapsed = max(0, min(total_duration, int(walk_out_minute or 0)))
    minutes_saved = max(0, total_duration - elapsed)
    cost_saved = round((minutes_saved / 60.0) * float(participant_hourly_rate or 0.0), 2)
    return {
        'minutes_saved': minutes_saved,
        'cost_saved': cost_saved,
    }


def compute_decision_grade(hours_to_decide):
    hours = float(hours_to_decide or 0.0)
    if hours <= 6.0:
        return 'S'
    if hours <= 24.0:
        return 'A'
    if hours <= 48.0:
        return 'B'
    return 'C'
