const CSV_PATH = "assets/data/medal_vs_sport_participation.csv";

function toNum(x) {
  const v = parseFloat(String(x).replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  complete: (result) => {
    const rows = result.data
      .map(r => ({
        code: (r.NOC || r.geo || r.country_code || "").trim(),
        participation: toNum(r.sport_participation_rate || r.obs_value || r.participation_rate),
        medals: toNum(r.medals || r.medals_total || r.medal_count || r["Count*(Count(Medal))"])
      }))
      .filter(r => r.code && r.participation !== null && r.medals !== null);

    Plotly.newPlot("scatter", [{
      type: "scatter",
      mode: "markers",
      x: rows.map(r => r.participation),
      y: rows.map(r => r.medals),
      text: rows.map(r => r.code),
      hovertemplate: "Country: %{text}<br>Participation: %{x}%<br>Medals: %{y}<extra></extra>"
    }], {
      margin: { t: 20, r: 20, b: 50, l: 60 },
      xaxis: { title: "Sport participation rate (%)" },
      yaxis: { title: "Total Olympic medals" }
    }, { responsive: true });
  }
});
