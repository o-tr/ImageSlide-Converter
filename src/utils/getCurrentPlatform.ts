export const getCurrentPlatform = () => {
  if (globalThis.process) {
    return "node";
  }
  if (globalThis.window) {
    return "browser";
  }
  if (globalThis.self instanceof Worker) {
    return "worker";
  }
  return "unknown";
};
