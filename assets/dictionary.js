(() => {
  const filter = document.getElementById("dictionary-filter");
  const rows = Array.from(document.querySelectorAll("#dictionary-rows tr"));
  const count = document.getElementById("dictionary-count");
  const empty = document.getElementById("no-results");

  if (filter && rows.length) {
    const update = () => {
      const query = filter.value.trim().toLowerCase();
      let shown = 0;
      for (const row of rows) {
        const haystack = (row.dataset.word || "") + " " + (row.dataset.stroke || "");
        const match = !query || haystack.toLowerCase().includes(query);
        row.hidden = !match;
        if (match) shown += 1;
      }
      if (count) {
        count.textContent = query
          ? `Showing ${shown} of ${rows.length} words`
          : `Showing all ${rows.length} words`;
      }
      if (empty) empty.hidden = shown !== 0;
    };
    filter.addEventListener("input", update);
    update();
  }

  const flash = (button, text) => {
    const original = button.textContent;
    button.textContent = text;
    window.setTimeout(() => { button.textContent = original; }, 1800);
  };

  const copy = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        const copied = await Promise.race([
          navigator.clipboard.writeText(text).then(() => true, () => false),
          new Promise((resolve) => window.setTimeout(() => resolve(false), 350)),
        ]);
        if (copied) return true;
      } catch (_) {
        // Fall through to the selection-based fallback. Some browsers expose
        // the API but deny it without an explicit permission.
      }
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    document.body.removeChild(area);
    return ok;
  };

  for (const button of document.querySelectorAll(".copy-button")) {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy || window.location.href;
      const ok = await copy(text);
      flash(button, ok ? "Copied" : "Copy failed");
    });
  }
})();
