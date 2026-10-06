import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import net from 'node:net';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('audit-raw', { recursive: true });
const results = [];
for (const mode of ['mobile', 'desktop']) {
  const socket = net.createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const browserServer = await chromium.launchServer({
    headless: true,
    args: [`--remote-debugging-port=${port}`],
  });
  let timeout;
  try {
    const options = {
      port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      maxWaitForLoad: 45000,
      maxWaitForFcp: 20000,
    };
    const result = await Promise.race([
      lighthouse('http://127.0.0.1:3000/', options, mode === 'desktop' ? desktopConfig : undefined),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`${mode} audit exceeded 120 seconds`)), 120000);
      }),
    ]);
    if (!result) throw new Error('Lighthouse returned no report');
    await fs.writeFile(`audit-raw/lighthouse-${mode}.json`, result.report);
    const { lhr } = result;
    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([key, value]) => [key, value.score * 100]),
    );
    const metrics = Object.fromEntries(
      [
        'first-contentful-paint',
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'speed-index',
      ].map((key) => [
        key,
        { value: lhr.audits[key].numericValue, display: lhr.audits[key].displayValue },
      ]),
    );
    const issues = Object.values(lhr.audits)
      .filter((a) => a.score !== null && a.score < 1 && a.details?.type !== 'debugdata')
      .map((a) => ({ id: a.id, title: a.title, score: a.score, display: a.displayValue }));
    results.push({
      mode,
      date: lhr.fetchTime,
      lighthouseVersion: lhr.lighthouseVersion,
      userAgent: lhr.environment.hostUserAgent,
      settings: {
        formFactor: lhr.configSettings.formFactor,
        throttlingMethod: lhr.configSettings.throttlingMethod,
        throttling: lhr.configSettings.throttling,
        screenEmulation: lhr.configSettings.screenEmulation,
      },
      scores,
      metrics,
      issues,
    });
    console.log(JSON.stringify({ mode, scores, metrics, issues }, null, 2));
    await fs.writeFile('docs/performance-results.json', JSON.stringify(results, null, 2));
  } finally {
    clearTimeout(timeout);
    const cleanupTimeout = setTimeout(() => void browserServer.kill(), 10000);
    try {
      await browserServer.close();
    } finally {
      clearTimeout(cleanupTimeout);
    }
    if (browserServer.process().exitCode === null) {
      throw new Error(`Audit-owned ${mode} browser did not exit`);
    }
    console.log(`${mode}: audit-owned browser exited; no user browser was touched.`);
  }
}
await fs.writeFile('docs/performance-results.json', JSON.stringify(results, null, 2));
