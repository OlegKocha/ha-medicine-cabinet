"""Constants for Medicine Cabinet."""

DOMAIN = "medicine_cabinet"
VERSION = "1.4.0"
PANEL_URL = "medicine-cabinet"
STORAGE_VERSION = 1
EVENT_CHANGED = f"{DOMAIN}_changed"
DEFAULT_OPTIONS = {
    "notification_time": "09:00:00",
    "notify_targets": [],
    "persistent_notifications": True,
}
MAX_IMAGE_BYTES = 10 * 1024 * 1024
