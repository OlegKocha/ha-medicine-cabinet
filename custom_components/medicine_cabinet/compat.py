"""HA switched its validation library in 2026; retain the supported older API."""

try:
    import probatio as vol
except ImportError:
    import voluptuous as vol

__all__ = ["vol"]
