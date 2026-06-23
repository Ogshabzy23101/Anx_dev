import {
  expectedYamlValue,
  requiredString,
  requiredYamlKey,
} from "./kubernetesValidation.js";

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function templatePattern(expression) {
  return new RegExp(
    `{{-?\\s*${escapeRegExp(expression).replace(/\\ /g, "\\s+")}\\s*-?}}`,
    "im",
  );
}

export const helmRules = {
  requiredString,
  yamlKey: requiredYamlKey,
  yamlValue: expectedYamlValue,
  template: (expression, label = `template expression: ${expression}`) => ({
    label,
    pattern: templatePattern(expression),
  }),
  values: (path) => ({
    label: `.Values.${path}`,
    pattern: new RegExp(
      `{{-?\\s*[^}]*\\.Values\\.${escapeRegExp(path)}\\b[^}]*-?}}`,
      "im",
    ),
  }),
  include: (name) => ({
    label: `include "${name}"`,
    pattern: new RegExp(
      `{{-?\\s*include\\s+["']${escapeRegExp(name)}["']\\s+[^}]+-?}}`,
      "im",
    ),
  }),
  if: (expression) => ({
    label: `if ${expression}`,
    pattern: new RegExp(
      `{{-?\\s*if\\s+${escapeRegExp(expression)}\\s*-?}}`,
      "im",
    ),
  }),
  range: (expression) => ({
    label: `range ${expression}`,
    pattern: new RegExp(
      `{{-?\\s*range\\s+${escapeRegExp(expression)}\\s*-?}}`,
      "im",
    ),
  }),
  end: {
    label: "{{ end }}",
    pattern: /{{-?\s*end\s*-?}}/im,
  },
  define: (name) => ({
    label: `define "${name}"`,
    pattern: new RegExp(
      `{{-?\\s*define\\s+["']${escapeRegExp(name)}["']\\s*-?}}`,
      "im",
    ),
  }),
  chartField: (key, value) => expectedYamlValue(key, value, `${key}: ${value}`),
  valuesField: (key, label = `${key}:`) => requiredYamlKey(key, label),
};
