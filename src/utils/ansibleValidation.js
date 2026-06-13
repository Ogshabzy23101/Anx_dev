function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function yamlValue(value) {
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return `["']?${escapeRegExp(value)}["']?`;
}

export const ansibleRules = {
  requiredString: (label, value) => ({
    label,
    pattern: new RegExp(escapeRegExp(value), "im"),
  }),
  key: (key, label = `${key}:`) => ({
    label,
    pattern: new RegExp(`^\\s*(?:-\\s*)?${escapeRegExp(key)}\\s*:`, "im"),
  }),
  value: (key, value, label = `${key}: ${value}`) => ({
    label,
    pattern: new RegExp(
      `^\\s*(?:-\\s*)?${escapeRegExp(key)}\\s*:\\s*${yamlValue(value)}\\s*(?:#.*)?$`,
      "im",
    ),
  }),
  hosts: (value) => ({
    label: `hosts: ${value}`,
    pattern: new RegExp(`^\\s*(?:-\\s*)?hosts\\s*:\\s*${yamlValue(value)}\\s*$`, "im"),
  }),
  become: (value = true) => ({
    label: `become: ${value}`,
    pattern: new RegExp(`^\\s*become\\s*:\\s*${value}\\s*$`, "im"),
  }),
  tasks: {
    label: "tasks:",
    pattern: /^\s*tasks\s*:/im,
  },
  module: (name) => ({
    label: `module: ${name}`,
    pattern: new RegExp(
      `^\\s*(?:-\\s*)?(?:ansible\\.builtin\\.)?${escapeRegExp(name)}\\s*:`,
      "im",
    ),
  }),
  package: (name) => ({
    label: `package: ${name}`,
    pattern: new RegExp(`^\\s*name\\s*:\\s*${yamlValue(name)}\\s*$`, "im"),
  }),
  serviceState: (state) => ({
    label: `service state: ${state}`,
    pattern: new RegExp(`^\\s*state\\s*:\\s*${yamlValue(state)}\\s*$`, "im"),
  }),
  handlers: {
    label: "handlers:",
    pattern: /^\s*handlers\s*:/im,
  },
  notify: (name) => ({
    label: `notify: ${name}`,
    pattern: new RegExp(`^\\s*notify\\s*:\\s*${yamlValue(name)}\\s*$`, "im"),
  }),
  vars: {
    label: "vars:",
    pattern: /^\s*vars\s*:/im,
  },
  loop: {
    label: "loop:",
    pattern: /^\s*loop\s*:/im,
  },
  when: (expression) => ({
    label: `when: ${expression}`,
    pattern: new RegExp(`^\\s*when\\s*:\\s*${escapeRegExp(expression)}\\s*$`, "im"),
  }),
  register: (name) => ({
    label: `register: ${name}`,
    pattern: new RegExp(`^\\s*register\\s*:\\s*${escapeRegExp(name)}\\s*$`, "im"),
  }),
  debugVar: (name) => ({
    label: `debug var: ${name}`,
    pattern: new RegExp(
      `^\\s*(?:var\\s*:\\s*${escapeRegExp(name)}|msg\\s*:[^\\n]*${escapeRegExp(name)})`,
      "im",
    ),
  }),
};
