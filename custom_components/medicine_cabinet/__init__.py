"""A local, multi-cabinet medicine inventory for Home Assistant."""

from hashlib import sha256
from pathlib import Path

from .const import DOMAIN, PANEL_URL, VERSION
from .settings import entry_options


def frontend_module_url(path: Path) -> str:
    """Invalidate browser caches when the installed bundle changes."""
    digest = sha256(path.read_bytes()).hexdigest()[:16]
    return f"/{DOMAIN}/frontend/medicine-cabinet.js?v={VERSION}&build={digest}"


async def async_setup_entry(hass, entry):
    from homeassistant.components import panel_custom
    from homeassistant.components.http import StaticPathConfig

    from .api import async_register_api
    from .manager import CabinetManager

    frontend_path = Path(__file__).parent / "frontend"
    module_url = await hass.async_add_executor_job(
        frontend_module_url, frontend_path / "medicine-cabinet.js"
    )
    manager = CabinetManager(hass, entry)
    await manager.async_load()
    hass.data[DOMAIN] = manager
    if not hass.data.get(f"{DOMAIN}_api_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(f"/{DOMAIN}/frontend", str(frontend_path), True)]
        )
        async_register_api(hass)
        hass.data[f"{DOMAIN}_api_registered"] = True
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL,
        webcomponent_name="medicine-cabinet-panel",
        sidebar_title=entry_options(entry)["sidebar_title"],
        sidebar_icon="mdi:medical-bag",
        module_url=module_url,
        require_admin=False,
    )
    entry.async_on_unload(entry.add_update_listener(async_options_updated))
    await manager.async_start()
    return True


async def async_options_updated(hass, entry):
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass, entry):
    from homeassistant.components import frontend

    manager = hass.data.get(DOMAIN)
    if manager:
        await manager.async_stop()
        hass.data.pop(DOMAIN, None)
    frontend.async_remove_panel(hass, PANEL_URL)
    return True
