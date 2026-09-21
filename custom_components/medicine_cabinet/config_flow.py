"""Configure language, sidebar title, and notification destinations locally."""

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .compat import vol
from .const import DOMAIN
from .settings import DEFAULT_TITLES, entry_options


def language_schema(default):
    return vol.Schema(
        {
            vol.Required("language", default=default): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        {"value": "ru", "label": "RUS — Русский"},
                        {"value": "en", "label": "EN — English"},
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                )
            )
        }
    )


def title_schema(default):
    return {vol.Required("sidebar_title", default=default): selector.TextSelector()}


def title_errors(value):
    return (
        {}
        if isinstance(value, str) and 0 < len(value.strip()) <= 100
        else {"sidebar_title": "invalid_title"}
    )


class MedicineCabinetConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None and user_input.get("language") in DEFAULT_TITLES:
            self._language = user_input["language"]
            return await self.async_step_name()
        default = "en" if self.hass.config.language.startswith("en") else "ru"
        return self.async_show_form(
            step_id="user",
            data_schema=language_schema(default),
            errors={"language": "invalid_language"} if user_input is not None else {},
        )

    async def async_step_name(self, user_input=None):
        title = DEFAULT_TITLES[self._language]
        errors = {}
        if user_input is not None:
            title = user_input.get("sidebar_title", "")
            errors = title_errors(title)
            if not errors:
                return self.async_create_entry(
                    title=title.strip(),
                    data={},
                    options={"language": self._language, "sidebar_title": title.strip()},
                )
        return self.async_show_form(
            step_id="name", data_schema=vol.Schema(title_schema(title)), errors=errors
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return MedicineCabinetOptionsFlow()


class MedicineCabinetOptionsFlow(config_entries.OptionsFlow):
    async def async_step_init(self, user_input=None):
        options = entry_options(self.config_entry)
        if user_input is not None and user_input.get("language") in DEFAULT_TITLES:
            self._language = user_input["language"]
            self._title = options["sidebar_title"]
            if self._title == DEFAULT_TITLES[options["language"]]:
                self._title = DEFAULT_TITLES[self._language]
            return await self.async_step_settings()
        return self.async_show_form(
            step_id="init",
            data_schema=language_schema(options["language"]),
            errors={"language": "invalid_language"} if user_input is not None else {},
        )

    async def async_step_settings(self, user_input=None):
        options = entry_options(self.config_entry)
        errors = {}
        if user_input is not None:
            errors = title_errors(user_input.get("sidebar_title"))
            if not errors:
                return self.async_create_entry(
                    title="",
                    data={
                        **self.config_entry.options,
                        **user_input,
                        "language": self._language,
                        "sidebar_title": user_input["sidebar_title"].strip(),
                    },
                )
            options.update(user_input)
        services = self.hass.services.async_services().get("notify", {})
        targets = sorted(
            {s for s in services if s.startswith("mobile_app_")} | set(options["notify_targets"])
        )
        return self.async_show_form(
            step_id="settings",
            errors=errors,
            data_schema=vol.Schema(
                {
                    **title_schema(
                        user_input.get("sidebar_title", "") if user_input else self._title
                    ),
                    vol.Required(
                        "notification_time", default=options["notification_time"]
                    ): selector.TimeSelector(),
                    vol.Required(
                        "persistent_notifications", default=options["persistent_notifications"]
                    ): selector.BooleanSelector(),
                    vol.Required(
                        "notify_targets", default=options["notify_targets"]
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=targets,
                            multiple=True,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                }
            ),
        )
