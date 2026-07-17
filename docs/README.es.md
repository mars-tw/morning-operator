# Gerente de la Mañana / Morning Operator

[English](../README.md) · [繁體中文](../README.zh-TW.md) · [日本語](README.ja.md) · Español

Flujo autoalojable y neutral respecto a proveedores que conecta un diagnóstico de tareas repetitivas de varios sectores con selección de paquete, evaluación de riesgo y ajuste, validación de pago, aprobación de alcance, construcción aislada con IA, QA, aprobación de entrega, notificaciones, auditoría y copias de seguridad.

La configuración predeterminada es una demo: no cobra, no envía emails reales, no conecta plataformas externas y no despliega resultados. Los ingresos, el plazo de recuperación y el ahorro de tiempo son estimaciones; no se garantiza ningún resultado comercial.

Incluye seis paquetes sectoriales estáticos y revisables: comercio, servicios profesionales, citas, creadores/educación, inmuebles/servicios de campo y operaciones administrativas. Cada paquete declara objetivos compatibles, rango estimado de automatización, métricas, aprobaciones y usos prohibidos. Consulta la [especificación de paquetes sectoriales](industry-packs.md).

```powershell
git clone https://github.com/mars-tw/morning-operator.git
Set-Location morning-operator
pnpm install
Copy-Item .env.example .env.local
pnpm seed
pnpm dev
```

Ejecuta `pnpm worker` en otra terminal y abre `http://localhost:3000/es`. Antes de producción, revisa [Autoalojamiento](self-hosting.md) y [Preparación para producción](production-readiness.md).

Licencia Apache-2.0. Informa vulnerabilidades de forma privada según la [política de seguridad](../SECURITY.md).
