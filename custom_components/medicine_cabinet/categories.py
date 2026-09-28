"""Starter category catalog and validation shared by all medicine boxes."""

import re

MAX_CATEGORIES_PER_MEDICINE = 5

# Optional organizational labels, never assigned to medicines automatically.
STARTER_CATEGORIES = (
    (
        "antibiotics",
        "Антибиотики и противомикробные",
        "Antibiotics and antimicrobials",
        "mdi:bacteria-outline",
        "#7963ad",
    ),
    (
        "fever",
        "Жаропонижающие и противовирусные",
        "Fever relief and antivirals",
        "mdi:thermometer",
        "#ce7951",
    ),
    ("heart", "Сердечно-сосудистые", "Cardiovascular", "mdi:heart-pulse", "#be6570"),
    ("cold", "Простуда и грипп", "Cold and flu", "mdi:virus-outline", "#5786b8"),
    ("wounds", "Раны и ожоги", "Wounds and burns", "mdi:bandage", "#bd884b"),
    ("emergency", "Экстренные средства", "Emergency supplies", "mdi:medical-bag", "#c46565"),
    (
        "nasal",
        "Назальные и ингаляционные средства",
        "Nasal and inhalation remedies",
        "mdi:spray",
        "#529f9d",
    ),
    (
        "digestive",
        "Желудок, кишечник, ЖКТ",
        "Stomach and digestive health",
        "mdi:stomach",
        "#77994f",
    ),
    ("hormonal", "Гормональные препараты", "Hormonal medicines", "mdi:pill", "#9872a8"),
    ("children", "Детская аптечка", "Children's medicine box", "mdi:baby-face-outline", "#58a08c"),
    ("vitamins", "Витамины и БАДы", "Vitamins and supplements", "mdi:pill-multiple", "#b69543"),
    ("joints", "Суставы, мышцы, боли", "Joints, muscles and pain", "mdi:bone", "#b48058"),
    ("travel", "Дорожная аптечка", "Travel medicine box", "mdi:bag-suitcase-outline", "#6a84b3"),
    (
        "respiratory",
        "Кашель и заболевания дыхательных путей",
        "Cough and respiratory conditions",
        "mdi:lungs",
        "#5a9ba9",
    ),
    ("skin", "Кожные проблемы", "Skin care", "mdi:lotion-outline", "#a7836c"),
    (
        "antiseptics",
        "Антисептики и дезинфекция",
        "Antiseptics and disinfection",
        "mdi:spray-bottle",
        "#569c82",
    ),
    ("eyes_ears", "Глазные и ушные капли", "Eye and ear drops", "mdi:eye-outline", "#628fc1"),
    ("men", "Мужское здоровье", "Men's health", "mdi:gender-male", "#658fa7"),
    ("women", "Женское здоровье", "Women's health", "mdi:gender-female", "#b5789b"),
    ("allergy", "Аллергия", "Allergy", "mdi:water-outline", "#978a52"),
    ("sleep", "Нервная система и сон", "Nervous system and sleep", "mdi:weather-night", "#787aa9"),
)


def default_categories() -> dict:
    return {
        f"default_{key}": {
            "id": f"default_{key}",
            "name": name,
            "name_en": english,
            "icon": icon,
            "color": color,
        }
        for key, name, english, icon, color in STARTER_CATEGORIES
    }


def valid_color(value: object) -> bool:
    return isinstance(value, str) and re.fullmatch(r"#[a-fA-F0-9]{6}", value) is not None


def valid_icon(value: object) -> bool:
    return (
        isinstance(value, str)
        and len(value) <= 160
        and re.fullmatch(r"[a-z0-9_-]+:[a-z0-9_-]+", value) is not None
    )
