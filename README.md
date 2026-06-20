<h1 align="center">Hi, I'm Devendra Gurav</h1>

<p align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=00C9FF&center=true&vCenter=true&width=600&lines=AI+%26+Data+Science+Engineer;Full-Stack+Developer;ML+%7C+FastAPI+%7C+React+%7C+Real-Time+Systems;Open+to+Internships+%26+Placements+2026" alt="Typing SVG" /></a>
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/devendra-gurav-14a121381/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
  <a href="mailto:dev.gurav011@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>
  <a href="https://leetcode.com/u/Devgurav1/" target="_blank"><img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black"/></a>
  <a href="YOUR_PORTFOLIO_URL" target="_blank"><img src="https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=googlechrome&logoColor=white"/></a>
</p>

---

## About Me

- 🎓 Final Year B.E. in **Artificial Intelligence & Data Science** — VCET, Mumbai University
- 🤖 Building intelligent systems at the intersection of **ML, backend APIs, and real-time data pipelines**
- 🛡️ Currently shipping **Fall Guardian v3** — an end-to-end wearable AI fall detection platform (ConvLSTM + FastAPI + Redis + PostgreSQL)
- 🔍 Actively seeking **SDE / ML internship & placement opportunities for 2026**
- 📫 Reach me at **dev.gurav011@gmail.com**

---

## Tech Stack

**Languages**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white)

**Frameworks & Libraries**

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![ONNX](https://img.shields.io/badge/ONNX-005CED?style=for-the-badge&logo=onnx&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)
![Netty](https://img.shields.io/badge/Netty-1F72AC?style=for-the-badge&logo=java&logoColor=white)

**Databases & Infrastructure**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)

---

## Featured Projects

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🛡️ Fall Guardian — AI Fall Detection System</h3>
      <p>Industry-grade, end-to-end wearable fall prediction pipeline. Predicts falls <strong>PRE-impact</strong> (~300 ms lead time). Architecture is split between an ultra-low-latency edge predictor and a heavy cloud validator, avoiding network roundtrips for raw sensor data.</p>
      <p>
        <strong>0.7% ADL False Positive Rate · 96.5% Recall · &lt;80ms Edge Latency</strong>
      </p>
      <p>
        <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"/>
        <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white"/>
        <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white"/>
        <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white"/>
      </p>
      <a href="https://github.com/DevGurav/fall-detect-system"><img src="https://img.shields.io/badge/View%20Repository-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
      <br/><br/>
      <blockquote>
        <p><em>"Designed for the ~300ms window between fall initiation and ground impact."</em></p>
      </blockquote>
      <p><strong>Technical highlights:</strong></p>
      <ul>
        <li><strong>Edge ML:</strong> Quantized ConvLSTM-tiny (INT8, ~46 KB) via TFLite Micro for live 50Hz IMU inference.</li>
        <li><strong>Cloud Validation:</strong> FastAPI + ONNX Transformer model with 5-fold cross-validation.</li>
        <li><strong>Active Learning:</strong> Local ~10s grace period allows users to cancel false alarms, feeding labeled data directly into MLOps.</li>
        <li><strong>Client App:</strong> Flutter caregiver app (Riverpod 3) with timeline, background FCM, and SOS.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📖 3D Book Reader</h3>
      <p>Open-source 3D PDF e-reader built entirely in the browser with Next.js and React Three Fiber. It completely eliminates native plugins by relying on <code>pdf.js</code> for local parsing, and maps the high-DPI vector canvas onto interactive 3D meshes to simulate realistic book reading.</p>
      <p>
        <strong>100% Client-Side Privacy · WebGL Rendering · Accessibility First</strong>
      </p>
      <p>
        <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white"/>
        <img src="https://img.shields.io/badge/React_Three_Fiber-20232A?style=flat-square&logo=react&logoColor=61DAFB"/>
        <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white"/>
      </p>
      <a href="https://github.com/DevGurav/3d-book-reader"><img src="https://img.shields.io/badge/View%20Repository-181717?style=for-the-badge&logo=github&logoColor=white"/></a>&nbsp;<a href="https://3d-book-reader.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white"/></a>
      <br/><br/>
      <blockquote>
        <p><em>"Merging immersive 3D graphics with rigorous web accessibility."</em></p>
      </blockquote>
      <p><strong>Core engineering features:</strong></p>
      <ul>
        <li><strong>Dynamic Resolution:</strong> Adaptive re-rendering of PDF vectors when the 3D camera zooms, maintaining crisp typography.</li>
        <li><strong>Text-to-Speech Engine:</strong> Custom recursive paragraph-chunking bypassing browser memory limits, with auto-page flips.</li>
        <li><strong>Dictionary Integration:</strong> Select any text to immediately trigger an API lookup with phonetics and encyclopedic data.</li>
        <li><strong>Structural Reflow Mode:</strong> Mathematical re-typesetting of raw PDF layout data into a responsive, dyslexic-friendly view.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <h3>🗄️ Mnemo — Redis Built From Scratch</h3>
      <p>A Redis-compatible in-memory data store written entirely in Java 21 — without using any built-in Java collections. Implements the real Redis wire protocol (RESP2), so <code>redis-cli</code>, Jedis, Lettuce, and <code>redis-benchmark</code> all connect to it with zero changes. Every internal piece is hand-built: a custom hash table with incremental rehashing, a span-augmented skip list for O(log N) rank queries, LRU/LFU eviction, TTL with lazy + active expiry, AOF crash recovery, and CRC-16 sharding across N lock-free executor threads via Netty.</p>
      <p>
        <strong>39 commands · 126 tests green · 14 Architecture Decision Records</strong>
      </p>
      <p>
        <img alt="Java 21" src="https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white"/>
        <img alt="Netty" src="https://img.shields.io/badge/Netty-1F72AC?style=flat-square&logo=java&logoColor=white"/>
        <img alt="RESP2" src="https://img.shields.io/badge/RESP2-DC382D?style=flat-square&logo=redis&logoColor=white"/>
        <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/>
      </p>
      <a href="https://github.com/DevGurav/mnemo-redis-compatible-server"><img alt="View Repository" src="https://img.shields.io/badge/View%20Repository-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
      <br/>
      <blockquote>
        <p><em>"Most developers learn to <strong>use</strong> Redis. I learned to <strong>build</strong> one."</em></p>
        <p>Mnemo covers exactly what systems engineering interviews probe: custom data structures, concurrency without locks, memory management, and network protocol design. Every non-obvious design choice is backed by a written Architecture Decision Record.</p>
      </blockquote>
      <p><strong>Real-world use cases it can power:</strong></p>
      <ul>
        <li>Session & auth token cache (SET + TTL)</li>
        <li>Live leaderboards (Sorted Sets)</li>
        <li>Background task queues (Lists)</li>
        <li>API rate limiting (INCR + EXPIRE)</li>
        <li>User profile cache (Hashes)</li>
      </ul>
    </td>
  </tr>
</table>

---

## GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=DevGurav&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" width="48%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=DevGurav&layout=compact&theme=tokyonight&hide_border=true&langs_count=6" width="40%" />
</p>

<p align="center">
  <img src="https://streak-stats.demolab.com?user=DevGurav&theme=tokyonight&hide_border=true" width="55%" />
</p>

---

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=DevGurav&label=Profile%20Views&color=0e75b6&style=flat" alt="profile views" />
</p>
