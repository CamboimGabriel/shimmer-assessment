export function logEvent(name: string, data: Record<string, any>) {
  const ts = new Date().toISOString();
  console.log(`[telemetry] ${ts} ${name}`, data);
}