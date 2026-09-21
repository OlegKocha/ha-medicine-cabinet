"""Real Home Assistant bootstrap used by integration tests and local UI preview."""

from pathlib import Path

from homeassistant import bootstrap, loader
from homeassistant.core import HomeAssistant

PROJECT = Path(__file__).resolve().parents[1]


async def start_hass(
    config_dir: Path, port: int, *, language="ru", sidebar_title=None, setup_integration=True
):
    config_dir.mkdir(parents=True, exist_ok=True)
    components = config_dir / "custom_components"
    if not components.exists():
        components.symlink_to(PROJECT / "custom_components", target_is_directory=True)
    hass = HomeAssistant(str(config_dir))
    loader.async_setup(hass)
    hass.config.skip_pip = True
    config = {
        "homeassistant": {
            "name": "Аптечка — тест",
            "time_zone": "Europe/Moscow",
            "latitude": 55.75,
            "longitude": 37.62,
            "elevation": 0,
            "unit_system": "metric",
            "country": "RU",
        },
        "http": {"server_host": "127.0.0.1", "server_port": port},
        "frontend": {},
        "config": {},
    }
    result = await bootstrap.async_from_config_dict(config, hass)
    if result is None:
        raise RuntimeError("Home Assistant failed to bootstrap")
    if setup_integration:
        flow = await hass.config_entries.flow.async_init(
            "medicine_cabinet", context={"source": "user"}
        )
        if flow["type"] == "form":
            flow = await hass.config_entries.flow.async_configure(
                flow["flow_id"], {"language": language}
            )
            flow = await hass.config_entries.flow.async_configure(
                flow["flow_id"],
                {
                    "sidebar_title": sidebar_title
                    or ("Medicine Box" if language == "en" else "Аптечка")
                },
            )
        await hass.async_block_till_done()
        if "medicine_cabinet" not in hass.data:
            raise RuntimeError(f"Medicine Cabinet failed to load: {flow}")
    await hass.async_start()
    await hass.async_block_till_done()
    return hass


async def create_token(hass, name="Тест", admin=True):
    user = await hass.auth.async_create_user(
        name, group_ids=["system-admin" if admin else "system-users"]
    )
    refresh = await hass.auth.async_create_refresh_token(user, client_id="http://127.0.0.1/")
    return user, refresh, hass.auth.async_create_access_token(refresh)
