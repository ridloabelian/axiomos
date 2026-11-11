from . import core_logic

try:
    from . import axiomos_models
except ImportError:
    # Allows running standalone unit tests on core_logic outside an Odoo runtime
    pass
