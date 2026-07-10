const commandPrefixes = [
  "ansible",
  "ansible-config",
  "ansible-galaxy",
  "ansible-inventory",
  "ansible-playbook",
  "ansible-vault",
  "apt",
  "awk",
  "cat",
  "cd",
  "chmod",
  "chown",
  "cp",
  "curl",
  "df",
  "diff",
  "docker",
  "du",
  "env",
  "find",
  "free",
  "grep",
  "helm",
  "journalctl",
  "kubectl",
  "ls",
  "mkdir",
  "mv",
  "ps",
  "pwd",
  "rm",
  "sed",
  "ssh",
  "systemctl",
  "tar",
  "terraform",
  "top",
  "watch",
];

const executablePattern = new RegExp(`^(${commandPrefixes.join("|")})(\\s|$)`);

export function isExecutableReference(value = "") {
  return executablePattern.test(value.trim());
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function toLectureNote(entry, module) {
  const title = entry.topic || entry.resource || entry.command;
  return {
    id: `${module.toLowerCase()}-note-${slug(entry.category)}-${slug(title)}`,
    module,
    title,
    category: entry.category,
    difficulty: entry.difficulty,
    summary: entry.description || entry.basicExplanation,
    beginnerExplanation: entry.basicExplanation,
    professionalExplanation: entry.professionalExplanation,
    example: entry.examples?.[0] || entry.commonSyntax || entry.syntax,
    useCase: entry.devOpsUseCase,
    commonMistakes: entry.commonMistake,
    relatedTopics: entry.relatedConcepts || entry.relatedCommands || [],
  };
}

export function toCommandReference(entry, module, command = entry.command) {
  return {
    id: `${module.toLowerCase()}-command-${slug(entry.category)}-${slug(command)}`,
    module,
    command,
    category: entry.category,
    difficulty: entry.difficulty,
    syntax: command,
    explanation: entry.basicExplanation || entry.description,
    commonFlags: entry.commonFlags || entry.commonFields || [],
    examples: entry.examples || [command],
    useCase: entry.devOpsUseCase,
    commonMistakes: entry.commonMistake,
    relatedCommands: entry.relatedCommands || entry.relatedConcepts || [],
    fullMeaning: command,
    basicExplanation: entry.basicExplanation || entry.description,
    professionalExplanation: entry.professionalExplanation || entry.description,
    commonSyntax: command,
    commonMistake: entry.commonMistake,
    devOpsUseCase: entry.devOpsUseCase,
  };
}

export function splitReferenceContent(entries, module) {
  const notes = [];
  const commandMap = new Map();

  entries.forEach((entry) => {
    const primaryIsCommand = isExecutableReference(entry.command);
    if (!primaryIsCommand) {
      notes.push(toLectureNote(entry, module));
    }

    // commonSyntax/syntax are excluded here: unlike examples, they may be a
    // template pattern with placeholders (e.g. "helm install RELEASE_NAME
    // CHART [flags]") rather than a concrete runnable command, and would
    // otherwise get promoted into its own nonsensical reference card.
    const commandCandidates = [
      primaryIsCommand ? entry.command : null,
      ...(entry.examples || []),
    ].filter(Boolean);

    commandCandidates
      .filter(isExecutableReference)
      .forEach((command) => {
        if (!commandMap.has(command)) {
          commandMap.set(command, toCommandReference(entry, module, command));
        }
      });
  });

  return {
    notes,
    commands: Array.from(commandMap.values()),
  };
}
