from custom_components.medicine_cabinet import frontend_module_url


def test_installed_frontend_changes_its_url_without_a_version_bump(tmp_path):
    bundle = tmp_path / "medicine-cabinet.js"
    bundle.write_bytes(b"original frontend")
    original = frontend_module_url(bundle)
    assert frontend_module_url(bundle) == original
    # Replacing code under the same integration version must bypass the old cache.
    bundle.write_bytes(b"fixed frontend")
    updated = frontend_module_url(bundle)
    assert updated != original
    assert updated.split("&build=")[0] == original.split("&build=")[0]
    # A timestamp change alone must not force another download.
    bundle.touch()
    assert frontend_module_url(bundle) == updated
