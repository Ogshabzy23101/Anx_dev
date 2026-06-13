function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function yamlScalar(value) {
  return `["']?${escapeRegExp(value)}["']?`;
}

function blockContainsValue(answer, blockKey, key, value) {
  const lines = answer.split(/\r?\n/);
  const blockPattern = new RegExp(`^(\\s*)${escapeRegExp(blockKey)}\\s*:\\s*$`, "i");
  const valuePattern = new RegExp(
    `^\\s*${escapeRegExp(key)}\\s*:\\s*${yamlScalar(value)}\\s*(?:#.*)?$`,
    "i",
  );

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(blockPattern);
    if (!match) continue;

    const blockIndent = match[1].length;
    for (let next = index + 1; next < lines.length; next += 1) {
      const line = lines[next];
      if (!line.trim() || line.trimStart().startsWith("#")) continue;
      const indent = line.match(/^\s*/)[0].length;
      if (indent <= blockIndent) break;
      if (valuePattern.test(line)) return true;
    }
  }

  return false;
}

export function requiredString(label, value, flags = "im") {
  return {
    label,
    pattern: new RegExp(escapeRegExp(value), flags),
  };
}

export function requiredYamlKey(key, label = `${key}:`) {
  return {
    label,
    pattern: new RegExp(`^\\s*(?:-\\s*)?${escapeRegExp(key)}\\s*:`, "im"),
  };
}

export function expectedYamlValue(key, value, label = `${key}: ${value}`) {
  return {
    label,
    pattern: new RegExp(
      `^\\s*(?:-\\s*)?${escapeRegExp(key)}\\s*:\\s*${yamlScalar(value)}\\s*(?:#.*)?$`,
      "im",
    ),
  };
}

export const kubernetesRules = {
  apiVersion: (value) => expectedYamlValue("apiVersion", value),
  kind: (value) => expectedYamlValue("kind", value),
  metadataName: (value) => ({
    label: `metadata.name: ${value}`,
    test: (answer) => blockContainsValue(answer, "metadata", "name", value),
  }),
  key: requiredYamlKey,
  value: expectedYamlValue,
  replicas: (value) => expectedYamlValue("replicas", value, `spec.replicas: ${value}`),
  image: (value) => expectedYamlValue("image", value, `container image: ${value}`),
  servicePort: (value) => expectedYamlValue("port", value, `service port: ${value}`),
  targetPort: (value) => expectedYamlValue("targetPort", value),
  ingressPath: (value) => expectedYamlValue("path", value, `ingress path: ${value}`),
  rbacVerb: (value) => ({
    label: `RBAC verb: ${value}`,
    pattern: new RegExp(
      `verbs\\s*:\\s*(?:\\[[^\\]]*\\b${escapeRegExp(value)}\\b[^\\]]*\\]|(?:\\n\\s*-\\s*\\w+)*\\n\\s*-\\s*${escapeRegExp(value)}\\s*$)`,
      "im",
    ),
  }),
};
