const CSV_PATH = "assets/data/medal_vs_sport_participation.csv";

function toNum(x) {
  const v = parseFloat(String(x).replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  skipEmptyLines: true,

  // Your sample looks tab-separated, so we set delimiter to tab.
  // If your file is actually comma-separated, PapaParse will still often work,
  // but tab is the safest based on what you pasted.
  delimiter: "\t",

  complete: (result) => {
    const rows = result.data
      .map(r => ({
        code: (r["NOC"] || "").trim(),
        medals: toNum(r["Count*(Count(Medal))"]),
        participation: toNum(r["sport_participation_rate"])
      }))
      .filter(r => r.code && r.medals !== null && r.participation !== null);

    if (!rows.length) {
      document.getElementById("scatter").innerHTML =
        "<p style='padding:12px'>No data loaded. Check the CSV delimiter and column names.</p>";
      return;
    }

    Plotly.newPlot("scatter", [{
      type: "scatter",
      mode: "markers",
      x: rows.map(r => r.participation),
      y: rows.map(r => r.medals),
      text: rows.map(r => r.code),
      hovertemplate:
        "Country: %{text}<br>Participation: %{x}%<br>Medals: %{y}<extra></extra>"
    }], {
      margin: { t: 20, r: 20, b: 55, l: 70 },
      xaxis: { title: "Sport participation rate (%)" },
      yaxis: { title: "Total Olympic medals" }
    }, { responsive: true });
  },

  error: (err) => {
    document.getElementById("scatter").innerHTML =
      "<p style='padding:12px'>Error loading CSV: " + err + "</p>";
  }
});
