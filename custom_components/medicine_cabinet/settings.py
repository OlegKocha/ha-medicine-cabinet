"""Shared presentation settings, including defaults for existing installations."""

from .const import DEFAULT_OPTIONS

DEFAULT_TITLES = {"ru": "Аптечка", "en": "Medicine Box"}


def entry_options(entry):
    options = {**DEFAULT_OPTIONS, **entry.data, **entry.options}
    language = options.get("language", "ru")
    if language not in DEFAULT_TITLES:
        language = "ru"
    options["language"] = language
    options["sidebar_title"] = options.get("sidebar_title", "").strip() or DEFAULT_TITLES[language]
    return options
