const CSV_PATH = "assets/data/medal_vs_sport_participation.csv";

function toNum(x) {
  const v = parseFloat(String(x).replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

// robust row getter (handles weird whitespace)
function get(r, key) {
  if (r[key] !== undefined) return r[key];
  // try trimmed keys (sometimes headers contain spaces)
  const k = Object.keys(r).find(h => h.trim() === key);
  return k ? r[k] : undefined;
}

Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  skipEmptyLines: true,

  // AUTO-detect delimiter instead of hardcoding tab/comma/semicolon
  delimiter: "",

  complete: (result) => {
    const rows = (result.data || [])
      .map(r => ({
        code: String(get(r, "NOC") ?? "").trim(),
        medals: toNum(get(r, "Count*(Count(Medal))")),
        participation: toNum(get(r, "sport_participation_rate"))
      }))
      .filter(r => r.code && r.medals !== null && r.participation !== null);

    if (!rows.length) {
      const headers = result.meta?.fields ? result.meta.fields.join(", ") : "(none)";
      document.getElementById("scatter").innerHTML =
        `<p style="padding:12px">
          No data loaded.<br>
          Detected headers: <code>${headers}</code><br>
          Check that the file is at <code>${CSV_PATH}</code>.
        </p>`;
      return;
    }

    Plotly.newPlot("scatter", [{
      type: "scatter",
      mode: "markers",
      x: rows.map(r => r.participation),
      y: rows.map(r => r.medals),
      text: rows.map(r => r.code),
      hovertemplate: "Country: %{text}<br>Participation: %{x}%<br>Medals: %{y}<extra></extra>"
    }], {
      margin: { t: 20, r: 20, b: 55, l: 70 },
      xaxis: { title: "Sport participation rate (%)" },
      yaxis: { title: "Total Olympic medals" }
    }, { responsive: true });
  },

  error: (err) => {
    document.getElementById("scatter").innerHTML =
      `<p style="padding:12px">Error loading CSV: ${err}</p>`;
  }
});
