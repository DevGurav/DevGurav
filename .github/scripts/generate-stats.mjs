// Renders the two GitHub stat cards as static SVGs.
//
// The public github-readme-stats instance is a single free Vercel deployment shared by
// millions of profiles; it returns 503 DEPLOYMENT_PAUSED for days at a time, which is what
// put broken-image icons on the profile. Generating the SVGs here and committing them means
// the README only ever loads files GitHub itself serves.
//
// Usage: GITHUB_TOKEN=... node generate-stats.mjs <username> <out-dir>

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const USER = process.argv[2] || "DevGurav";
const OUT_DIR = process.argv[3] || "dist";
const TOKEN = process.env.GITHUB_TOKEN;

// Two surfaces render these cards and they do not share a palette, so each run writes both.
// The README pair is tokyonight, matching the theme that page already used. The portfolio
// pair uses its own accent colours and leaves the card background transparent, because there
// the card sits inside a glass panel and a second opaque rectangle inside it looks pasted on.
const THEMES = [
  {
    suffix: "",
    bg: "#1a1b27",
    title: "#70a5fd",
    icon: "#bf91f3",
    text: "#38bdae",
  },
  {
    suffix: "-portfolio",
    bg: "none",
    title: "#22d3ee",
    icon: "#8b5cf6",
    text: "#9fb0c7",
  },
];

const FONT = "'Segoe UI', Ubuntu, Sans-Serif";

// Octicons, 16x16 viewBox.
const ICONS = {
  star: "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z",
  commit:
    "M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z",
  pr: "M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z",
  issue:
    "M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z",
  repo: "M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z",
  code: "M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z",
  people:
    "M10.561 8.073a6.005 6.005 0 013.432 5.142.75.75 0 11-1.498.07 4.5 4.5 0 00-8.99 0 .75.75 0 01-1.498-.07 6.005 6.005 0 013.431-5.142 3.999 3.999 0 115.123 0zM10.5 5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z",
};

// GitHub's own linguist colors for the languages likely to show up here.
const LANG_COLORS = {
  Python: "#3572A5",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
  C: "#555555",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  PowerShell: "#012456",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Solidity: "#AA6746",
  Circom: "#707575",
  Dockerfile: "#384d54",
  CMake: "#DA3434",
  Makefile: "#427819",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  SQL: "#e38c00",
  TeX: "#3D6117",
  Blade: "#f7523f",
};

// A .ipynb is one big JSON document that embeds every cell's output, including base64 images.
// Linguist counts those bytes as authored Jupyter Notebook code, which is how a few ML
// notebooks end up outweighing an entire Java server. Measuring written code means dropping it.
const EXCLUDED_LANGUAGES = new Set(["Jupyter Notebook"]);

// Deterministic fallback so an unmapped language keeps the same colour between runs.
function fallbackColor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360}, 55%, 55%)`;
}

const colorFor = (name) => LANG_COLORS[name] || fallbackColor(name);

async function api(path, { search = false } = {}) {
  const url = search
    ? `https://api.github.com/search/${path}`
    : `https://api.github.com/${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": `${USER}-profile-stats`,
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

// Search endpoints are the only way to get these totals, and they are the flakiest part of
// the API (secondary rate limits). A failure here should cost one number, not the whole card.
async function searchCount(query) {
  try {
    const data = await api(`issues?q=${encodeURIComponent(query)}&per_page=1`, {
      search: true,
    });
    return data.total_count ?? null;
  } catch (err) {
    console.warn(`  ! count unavailable for "${query}": ${err.message}`);
    return null;
  }
}

async function commitCount() {
  try {
    const data = await api(
      `commits?q=${encodeURIComponent(`author:${USER}`)}&per_page=1`,
      { search: true },
    );
    return data.total_count ?? null;
  } catch (err) {
    console.warn(`  ! commit count unavailable: ${err.message}`);
    return null;
  }
}

async function allRepos() {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await api(`users/${USER}/repos?per_page=100&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fmt = (n) => (n === null ? "—" : n.toLocaleString("en-US"));

function statRow(icon, label, value, y, theme) {
  return `
    <g transform="translate(0, ${y})">
      <svg x="0" y="0" viewBox="0 0 16 16" width="16" height="16" fill="${theme.icon}">
        <path d="${ICONS[icon]}"/>
      </svg>
      <text x="27" y="12.5" fill="${theme.text}" font-family="${FONT}" font-size="14">${esc(label)}:</text>
      <text x="220" y="12.5" fill="${theme.text}" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="end">${esc(value)}</text>
    </g>`;
}

function statsCard(stats, theme) {
  // A row reading "Total PRs: 0" is noise that makes the profile look emptier than the work
  // behind it. Zero/unavailable rows drop out and reappear on their own once they count.
  const optional = (icon, label, value) =>
    value ? [[icon, label, fmt(value)]] : [];

  const rows = [
    ["commit", "Total Commits", fmt(stats.commits)],
    ["repo", "Public Repositories", fmt(stats.repos)],
    ["code", "Languages Used", fmt(stats.languages)],
    ...optional("star", "Total Stars Earned", stats.stars),
    ...optional("pr", "Total PRs", stats.prs),
    ...optional("issue", "Total Issues", stats.issues),
    ["people", "Followers", fmt(stats.followers)],
  ];
  const height = 60 + rows.length * 25 + 15;
  const body = rows.map(([i, l, v], idx) => statRow(i, l, v, idx * 25, theme)).join("");

  return `<svg width="450" height="${height}" viewBox="0 0 450 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(USER)}'s GitHub statistics">
  <title>${esc(USER)}'s GitHub statistics</title>
  <rect x="0" y="0" width="450" height="${height}" rx="6" fill="${theme.bg}"/>
  <text x="25" y="35" fill="${theme.title}" font-family="${FONT}" font-size="18" font-weight="600">${esc(USER)}'s GitHub Stats</text>
  <g transform="translate(25, 55)">${body}
  </g>
</svg>
`;
}

function languageCard(langs, theme) {
  const total = langs.reduce((sum, l) => sum + l.bytes, 0) || 1;
  const withPct = langs.map((l) => ({ ...l, pct: (l.bytes / total) * 100 }));

  const barWidth = 400;
  let cursor = 0;
  const segments = withPct
    .map((l) => {
      const w = (l.pct / 100) * barWidth;
      const seg = `<rect x="${cursor.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="8" fill="${colorFor(l.name)}"/>`;
      cursor += w;
      return seg;
    })
    .join("");

  // Two columns so six languages stay inside a short card.
  const perColumn = Math.ceil(withPct.length / 2);
  const legend = withPct
    .map((l, i) => {
      const col = Math.floor(i / perColumn);
      const row = i % perColumn;
      const x = col * 200;
      const y = row * 25;
      return `
      <g transform="translate(${x}, ${y})">
        <circle cx="5" cy="6" r="5" fill="${colorFor(l.name)}"/>
        <text x="18" y="11" fill="${theme.text}" font-family="${FONT}" font-size="13">${esc(l.name)}</text>
        <text x="185" y="11" fill="${theme.text}" font-family="${FONT}" font-size="13" text-anchor="end">${l.pct.toFixed(1)}%</text>
      </g>`;
    })
    .join("");

  const height = 85 + perColumn * 25 + 10;

  return `<svg width="450" height="${height}" viewBox="0 0 450 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(USER)}'s most used languages">
  <title>${esc(USER)}'s most used languages</title>
  <rect x="0" y="0" width="450" height="${height}" rx="6" fill="${theme.bg}"/>
  <text x="25" y="35" fill="${theme.title}" font-family="${FONT}" font-size="18" font-weight="600">Most Used Languages</text>
  <g transform="translate(25, 52)">
    <mask id="bar-round"><rect x="0" y="0" width="${barWidth}" height="8" rx="4" fill="#fff"/></mask>
    <g mask="url(#bar-round)">${segments}</g>
  </g>
  <g transform="translate(25, 78)">${legend}
  </g>
</svg>
`;
}

async function main() {
  console.log(`Collecting stats for ${USER}…`);

  const [user, repos] = await Promise.all([api(`users/${USER}`), allRepos()]);

  // Forks would credit other people's stars and languages to this profile.
  const owned = repos.filter((r) => !r.fork);
  const stars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);

  const [commits, prs, issues] = await Promise.all([
    commitCount(),
    searchCount(`author:${USER} type:pr`),
    searchCount(`author:${USER} type:issue`),
  ]);

  const byteTotals = new Map();
  for (const repo of owned) {
    try {
      const langs = await api(`repos/${USER}/${repo.name}/languages`);
      for (const [name, bytes] of Object.entries(langs)) {
        if (EXCLUDED_LANGUAGES.has(name)) continue;
        byteTotals.set(name, (byteTotals.get(name) || 0) + bytes);
      }
    } catch (err) {
      console.warn(`  ! languages unavailable for ${repo.name}: ${err.message}`);
    }
  }

  const top = [...byteTotals.entries()]
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6);
  console.log("  languages:", top.map((l) => l.name).join(", "));

  if (top.length === 0) throw new Error("no language data resolved — refusing to write an empty card");

  // Linguist tags every Dockerfile, CMake and Batchfile as a "language", which inflates a raw
  // count to something indefensible in an interview. Only count a language carrying at least
  // 1% of the written bytes.
  const totalBytes = [...byteTotals.values()].reduce((a, b) => a + b, 0) || 1;
  const significant = [...byteTotals.values()].filter(
    (bytes) => (bytes / totalBytes) * 100 >= 1,
  ).length;

  const stats = {
    stars,
    commits,
    prs,
    issues,
    repos: user.public_repos,
    followers: user.followers,
    languages: significant,
  };
  console.log("  stats:", stats);

  await mkdir(OUT_DIR, { recursive: true });
  for (const theme of THEMES) {
    const statsName = `github-stats${theme.suffix}.svg`;
    const langName = `top-languages${theme.suffix}.svg`;
    await writeFile(join(OUT_DIR, statsName), statsCard(stats, theme), "utf8");
    await writeFile(join(OUT_DIR, langName), languageCard(top, theme), "utf8");
    console.log(`  wrote ${statsName} and ${langName}`);
  }
  console.log(`Wrote ${THEMES.length * 2} cards to ${OUT_DIR}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
