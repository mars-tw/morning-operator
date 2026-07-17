# Gerente de la Mañana / Morning Operator

[English](../README.md) · [繁體中文](../README.zh-TW.md) · [日本語](README.ja.md) · Español

Flujo autoalojable que conecta un diagnóstico operativo de Shopify con validación de pago, aprobación de alcance, construcción aislada con IA, QA, aprobación de entrega, notificaciones, auditoría y copias de seguridad.

La configuración predeterminada es una demo: no cobra, no envía emails reales, no conecta Shopify y no despliega resultados. No garantiza ingresos ni ahorro de tiempo.

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm seed
pnpm dev
```

Ejecuta `pnpm worker` en otra terminal y abre `http://localhost:3000/es`. Antes de producción, revisa [Autoalojamiento](self-hosting.md) y [Preparación para producción](production-readiness.md).

Licencia Apache-2.0. Informa vulnerabilidades de forma privada según la [política de seguridad](../SECURITY.md).
