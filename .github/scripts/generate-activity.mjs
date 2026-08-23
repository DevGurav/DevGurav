// Renders the contribution activity graph as a static SVG.
//
// Same reasoning as generate-stats.mjs: the graph on the portfolio came from a shared free
// Vercel deployment, and anything on a page that is meant to be evidence of work should not
// be able to disappear because someone else's side project ran out of quota.
//
// Usage: GITHUB_TOKEN=... node generate-activity.mjs <username> <out-dir>

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const USER = process.argv[2] || "DevGurav";
const OUT_DIR = process.argv[3] || "dist";
const TOKEN = process.env.GITHUB_TOKEN;

const FONT = "'Segoe UI', Ubuntu, Sans-Serif";

// Same two surfaces as the stat cards. See generate-stats.mjs for why the portfolio pair is
// drawn on a transparent background.
const THEMES = [
  {
    suffix: "",
    bg: "#1a1b27",
    title: "#70a5fd",
    text: "#38bdae",
    line: "#bf91f3",
    grid: "#2b2f45",
  },
  {
    suffix: "-portfolio",
    bg: "none",
    title: "#22d3ee",
    text: "#9fb0c7",
    line: "#8b5cf6",
    grid: "#1e293b",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// The contribution calendar is not in the REST API at all. GraphQL is the only source of
// exact daily counts, so it is the one to try first.
async function fromGraphQL() {
  if (!TOKEN) throw new Error("no GITHUB_TOKEN in the environment");

  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          totalContributions
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": `${USER}-profile-activity`,
    },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });

  if (!res.ok) throw new Error(`graphql -> HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`graphql -> ${JSON.stringify(json.errors)}`);

  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error("graphql returned no contribution calendar");

  return cal.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));
}

// The Actions GITHUB_TOKEN is scoped to the repository, and user-level contribution data sits
// outside that scope. Rather than make this workflow depend on a personal access token the
// owner has to rotate by hand, fall back to the public calendar the profile page itself
// renders. It needs no auth; the exact counts live in the per-cell tooltips.
async function fromPublicCalendar() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": `${USER}-profile-activity` },
  });
  if (!res.ok) throw new Error(`contributions page -> HTTP ${res.status}`);
  const html = await res.text();

  const dateById = new Map();
  const cell = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="(contribution-day-component-\d+-\d+)"/g;
  for (const m of html.matchAll(cell)) dateById.set(m[2], m[1]);

  const days = [];
  const tip = /<tool-tip[^>]*?for="(contribution-day-component-\d+-\d+)"[^>]*?>([^<]*)<\/tool-tip>/g;
  for (const m of html.matchAll(tip)) {
    const date = dateById.get(m[1]);
    if (!date) continue;
    // "No contributions on August 17th." / "12 contributions on August 18th."
    const lead = m[2].trim().match(/^(\d[\d,]*)/);
    days.push({ date, count: lead ? Number(lead[1].replace(/,/g, "")) : 0 });
  }

  if (days.length === 0) throw new Error("parsed no days out of the contributions page");
  return days;
}

// Round the axis up to a value a person would have chosen, so the top gridline is a number
// like 125 rather than 118.
function niceScale(rawMax) {
  const rough = Math.max(rawMax, 1) / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= rough) ?? 10 * mag;
  return { step, max: Math.ceil(Math.max(rawMax, 1) / step) * step };
}

function activityCard(days, total, theme) {
  const W = 900;
  const H = 260;
  const padL = 58;
  const padR = 22;
  const padT = 58;
  const padB = 38;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const counts = days.map((d) => d.count);
  const { step, max } = niceScale(Math.max(...counts));

  const x = (i) => padL + (i / Math.max(days.length - 1, 1)) * plotW;
  const y = (v) => padT + plotH - (v / max) * plotH;

  const line = days.map((d, i) => `${x(i).toFixed(1)},${y(d.count).toFixed(1)}`).join(" L ");
  const area = `M ${padL},${padT + plotH} L ${line} L ${(padL + plotW).toFixed(1)},${padT + plotH} Z`;

  const gid = `act-fill${theme.suffix}`;

  let grid = "";
  for (let v = 0; v <= max; v += step) {
    const gy = y(v).toFixed(1);
    grid += `
    <line x1="${padL}" y1="${gy}" x2="${padL + plotW}" y2="${gy}" stroke="${theme.grid}" stroke-width="1" stroke-dasharray="2 4"/>
    <text x="${padL - 10}" y="${(Number(gy) + 4).toFixed(1)}" fill="${theme.text}" font-family="${FONT}" font-size="11" text-anchor="end">${v}</text>`;
  }

  let months = "";
  days.forEach((d, i) => {
    if (!d.date.endsWith("-01")) return;
    const label = MONTHS[Number(d.date.slice(5, 7)) - 1];
    months += `
    <text x="${x(i).toFixed(1)}" y="${H - 14}" fill="${theme.text}" font-family="${FONT}" font-size="11" text-anchor="middle">${label}</text>`;
  });

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(USER)}'s contribution activity over the last year">
  <title>${esc(USER)}'s contribution activity over the last year</title>
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.line}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${theme.line}" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" rx="6" fill="${theme.bg}"/>
  <text x="${W / 2}" y="30" fill="${theme.title}" font-family="${FONT}" font-size="17" font-weight="600" text-anchor="middle">Contribution Activity — ${total.toLocaleString("en-US")} in the last year</text>
  <text transform="translate(18, ${padT + plotH / 2}) rotate(-90)" fill="${theme.text}" font-family="${FONT}" font-size="11" text-anchor="middle">Contributions</text>
  <g>${grid}
  </g>
  <path d="${area}" fill="url(#${gid})"/>
  <path d="M ${line}" fill="none" stroke="${theme.line}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
  <g>${months}
  </g>
</svg>
`;
}

async function main() {
  console.log(`Collecting contribution activity for ${USER}…`);

  let days;
  try {
    days = await fromGraphQL();
    console.log("  source: graphql");
  } catch (err) {
    console.warn(`  ! graphql unavailable (${err.message.slice(0, 160)})`);
    days = await fromPublicCalendar();
    console.log("  source: public contributions page");
  }

  // Both sources can run a few days past today at the edges of the calendar grid.
  const today = new Date().toISOString().slice(0, 10);
  days = days
    .filter((d) => d.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-365);

  if (days.length < 30) throw new Error(`only ${days.length} days resolved — refusing to write a misleading graph`);

  const total = days.reduce((sum, d) => sum + d.count, 0);
  console.log(`  ${days.length} days, ${total} contributions, peak ${Math.max(...days.map((d) => d.count))}/day`);

  await mkdir(OUT_DIR, { recursive: true });
  for (const theme of THEMES) {
    const name = `activity-graph${theme.suffix}.svg`;
    await writeFile(join(OUT_DIR, name), activityCard(days, total, theme), "utf8");
    console.log(`  wrote ${name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
