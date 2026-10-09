# Brew & Bean – a11y-demo

Demosida som får **0 fel i axe** och **100 i Lighthouse** men som har minst 13 allvarliga tillgänglighetsbrister.

```bash
npm install
npx playwright install chromium
npm run dev         # visa sidan
npm run test:a11y   # bygg + kör axe-core (7 UI-tillstånd) och Lighthouse
```

Se [FACIT.md](FACIT.md) för alla brister, demoupplägg och NVDA-kommandon.
**Visa inte facit för publiken innan demon.**
