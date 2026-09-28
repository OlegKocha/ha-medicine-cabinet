"""Serialised durable transactions and optimistic concurrency."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from copy import deepcopy
from typing import Any

from .model import InventoryError, load_inventory, mutate, public_snapshot


class Repository:
    def __init__(self, store: Any, clock: Callable):
        self.store = store
        self.clock = clock
        self.lock = asyncio.Lock()
        self.data = load_inventory(None)
        self.accept_changes = True

    async def load(self):
        async with self.lock:
            stored = await self.store.async_load()
            loaded = load_inventory(stored)
            if stored is not None and loaded != stored:
                # Persist schema/catalog migrations before publishing; older open forms
                # must refresh instead of submitting stale identifiers.
                loaded["revision"] += 1
                await self.store.async_save(loaded)
            self.data = loaded

    def snapshot(self):
        return public_snapshot(self.data, self.clock())

    async def change(self, operation: str, payload: dict, revision: int):
        async with self.lock:
            if not self.accept_changes:
                raise InventoryError("not_loaded", "Интеграция перезагружается. Повторите действие")
            changed = mutate(self.data, operation, payload, revision, self.clock())
            await self.store.async_save(changed)
            self.data = changed
            return self.snapshot()

    async def mark_notified(self, key: str, channel: str):
        """Caller holds lock so edits cannot race notification delivery."""
        changed = deepcopy(self.data)
        channels = changed["notifications"].setdefault(key, [])
        if channel not in channels:
            channels.append(channel)
        await self.store.async_save(changed)
        self.data = changed
