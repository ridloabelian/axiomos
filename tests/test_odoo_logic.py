import unittest
from odoo_addons.axiomos_erp.models.core_logic import (
    compute_first_principles_metrics,
    evaluate_daily_time_blocks,
    evaluate_pod_metrics,
    validate_meeting_rules,
    calculate_walk_out_savings,
    compute_decision_grade,
)


class TestOdooAxiomOSLogic(unittest.TestCase):
    def test_module_1_first_principles(self):
        res = compute_first_principles_metrics(65000000, [750000, 550000], 6500000)
        self.assertEqual(res['raw_material_cost'], 1300000)
        self.assertEqual(res['raw_cost_percentage'], 2.0)
        self.assertEqual(res['idiocy_index'], 50.0)
        self.assertEqual(res['verdict'], 'RADICAL_BREAKTHROUGH_OPPORTUNITY')
        self.assertEqual(res['potential_savings_percent'], 90.0)

    def test_module_2_time_blocks(self):
        blocks = [
            {'start_minute': 420, 'duration_minutes': 60, 'context': 'SpaceX', 'category': 'DEEP_TECH'},
            {'start_minute': 480, 'duration_minutes': 45, 'context': 'SpaceX', 'category': 'CRITICAL_DECISION'},
        ]
        clean = evaluate_daily_time_blocks('SpaceX', 6.5, blocks)
        self.assertEqual(clean['context_switch_violations'], 0)
        self.assertTrue(clean['sleep_compliant'])
        self.assertGreaterEqual(clean['focus_efficiency_score'], 95)

        messy = evaluate_daily_time_blocks('SpaceX', 4.5, blocks + [
            {'start_minute': 540, 'duration_minutes': 25, 'context': 'OtherCo', 'category': 'OPS_SYNC'},
        ])
        self.assertEqual(messy['context_switch_violations'], 1)
        self.assertFalse(messy['sleep_compliant'])
        self.assertLess(messy['focus_efficiency_score'], clean['focus_efficiency_score'])

    def test_module_3_flat_org_pod(self):
        pod = evaluate_pod_metrics(1, 6, 'Budi DRI', 100000, 40000, 30, 10)
        self.assertTrue(pod['is_autonomous'])
        self.assertEqual(pod['budget_utilization_percent'], 40.0)
        self.assertEqual(pod['output_per_hour'], 3.0)

    def test_module_4_anti_meeting_and_velocity(self):
        valid = validate_meeting_rules(
            'Putuskan pemasok baja tahan karat 304L hari ini',
            15,
            [{'contribution_role': 'Lead Metalurgi', 'hourly_rate_cost': 600, 'is_spectator': False}],
        )
        self.assertTrue(valid['approved'])
        self.assertEqual(valid['burn_rate_per_minute'], 10.0)

        walkout = calculate_walk_out_savings(30, 5, 600)
        self.assertEqual(walkout['minutes_saved'], 25)
        self.assertEqual(walkout['cost_saved'], 250.0)
        self.assertEqual(compute_decision_grade(2.5), 'S')


if __name__ == '__main__':
    unittest.main()
