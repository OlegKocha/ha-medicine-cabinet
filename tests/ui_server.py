"""Local-only, disposable HA instance for real API browser tests. Never use in production."""

import asyncio
import json
import logging
import os
import signal

from aiohttp import web
from homeassistant.components.http import HomeAssistantView

from tests.ha_runtime import PROJECT, create_token, start_hass


class HarnessView(HomeAssistantView):
    url = "/test-panel"
    name = "test:medicine-panel"
    requires_auth = False

    async def get(self, request):
        return web.FileResponse(PROJECT / "tests/ui/harness.html")


async def main():
    config = PROJECT / ".ha-test"
    port = int(os.environ.get("MC_TEST_PORT", "18123"))
    hass = await start_hass(config, port)
    hass.http.register_view(HarnessView())
    _, refresh, token = await create_token(hass)
    access = {"token": token, "refresh_token": refresh.token, "url": f"http://127.0.0.1:{port}"}
    (config / "access.json").write_text(json.dumps(access))
    print(f"READY http://127.0.0.1:{port}/test-panel", flush=True)
    done = asyncio.Event()
    for name in (signal.SIGTERM, signal.SIGINT):
        asyncio.get_running_loop().add_signal_handler(name, done.set)
    await done.wait()
    await hass.async_stop(force=True)


if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)
    asyncio.run(main())
