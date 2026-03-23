/**
 * Regression tests for the plugin boolean settings bug.
 *
 * Bug: formData.get(key) always returned the hidden input's "0" value because
 * it returns the FIRST occurrence. The fix uses formData.getAll(key).includes("1").
 *
 * These tests verify the correct behaviour with a plain FormData object,
 * mirroring exactly what the saveSettings server action does.
 */
import { describe, it, expect } from "vitest";

function readBooleanSetting(formData: FormData, key: string): boolean {
  return formData.getAll(key).includes("1");
}

function buildFormData(key: string, checked: boolean): FormData {
  const fd = new FormData();
  // Mirrors the rendered form: hidden input first, then optional checkbox value
  fd.append(key, "0"); // hidden input — always present
  if (checked) {
    fd.append(key, "1"); // checkbox — only present when checked
  }
  return fd;
}

describe("plugin boolean settings — formData.getAll fix", () => {
  it("reads true when checkbox is checked", () => {
    const fd = buildFormData("requireEmail", true);
    expect(readBooleanSetting(fd, "requireEmail")).toBe(true);
  });

  it("reads false when checkbox is unchecked", () => {
    const fd = buildFormData("requireEmail", false);
    expect(readBooleanSetting(fd, "requireEmail")).toBe(false);
  });

  it("old formData.get() approach was broken — always returned false when checked", () => {
    const fd = buildFormData("requireEmail", true);
    // Demonstrate the bug: get() returns first value ("0"), not "1"
    expect(fd.get("requireEmail")).toBe("0");
    expect(fd.get("requireEmail") === "1").toBe(false); // the bug
  });

  it("handles multiple boolean settings independently", () => {
    const fd = new FormData();
    fd.append("requireEmail", "0");
    fd.append("requireEmail", "1"); // checked
    fd.append("allowReplies", "0"); // unchecked — no "1" appended

    expect(readBooleanSetting(fd, "requireEmail")).toBe(true);
    expect(readBooleanSetting(fd, "allowReplies")).toBe(false);
  });
});
