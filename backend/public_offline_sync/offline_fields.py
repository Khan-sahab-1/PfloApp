from odoo import fields, models


class OfflineSyncFields(models.Model):
    _inherit = 'hr.attendance.online'

    pflo_event_id = fields.Char(index=True, copy=False)
    pflo_event_hash = fields.Char(copy=False)
    pflo_synced_at = fields.Datetime(copy=False)

    _sql_constraints = [
        ('pflo_employee_event_unique', 'unique(emp_code, pflo_event_id)',
         'This employee attendance event has already been synced.'),
    ]
