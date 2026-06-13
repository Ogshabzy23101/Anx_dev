function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hclValue(value) {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return `["']${escapeRegExp(value)}["']`;
}

export const terraformRules = {
  requiredString: (label, value) => ({
    label,
    pattern: new RegExp(escapeRegExp(value), "im"),
  }),
  block: (type, labels = [], label = `${type} block`) => {
    const quotedLabels = labels
      .map((item) => `\\s+["']${escapeRegExp(item)}["']`)
      .join("");
    return {
      label,
      pattern: new RegExp(
        `\\b${escapeRegExp(type)}${quotedLabels}\\s*\\{`,
        "im",
      ),
    };
  },
  attribute: (name, value, label = `${name} = ${value}`) => ({
    label,
    pattern: new RegExp(
      `^\\s*${escapeRegExp(name)}\\s*=\\s*${hclValue(value)}\\s*(?:#.*)?$`,
      "im",
    ),
  }),
  attributePresent: (name, label = `${name} attribute`) => ({
    label,
    pattern: new RegExp(`^\\s*${escapeRegExp(name)}\\s*=`, "im"),
  }),
  reference: (value, label = `reference: ${value}`) => ({
    label,
    pattern: new RegExp(`\\b${escapeRegExp(value)}\\b`, "im"),
  }),
  provider: (name) => ({
    label: `provider "${name}"`,
    pattern: new RegExp(`\\bprovider\\s+["']${escapeRegExp(name)}["']\\s*\\{`, "im"),
  }),
  resource: (type, name) => ({
    label: `resource "${type}" "${name}"`,
    pattern: new RegExp(
      `\\bresource\\s+["']${escapeRegExp(type)}["']\\s+["']${escapeRegExp(name)}["']\\s*\\{`,
      "im",
    ),
  }),
  data: (type, name) => ({
    label: `data "${type}" "${name}"`,
    pattern: new RegExp(
      `\\bdata\\s+["']${escapeRegExp(type)}["']\\s+["']${escapeRegExp(name)}["']\\s*\\{`,
      "im",
    ),
  }),
  variable: (name) => ({
    label: `variable "${name}"`,
    pattern: new RegExp(`\\bvariable\\s+["']${escapeRegExp(name)}["']\\s*\\{`, "im"),
  }),
  output: (name) => ({
    label: `output "${name}"`,
    pattern: new RegExp(`\\boutput\\s+["']${escapeRegExp(name)}["']\\s*\\{`, "im"),
  }),
  module: (name) => ({
    label: `module "${name}"`,
    pattern: new RegExp(`\\bmodule\\s+["']${escapeRegExp(name)}["']\\s*\\{`, "im"),
  }),
  backend: (name) => ({
    label: `backend "${name}"`,
    pattern: new RegExp(`\\bbackend\\s+["']${escapeRegExp(name)}["']\\s*\\{`, "im"),
  }),
};
