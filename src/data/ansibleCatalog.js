const categoryDefinitions = [
  ["Ansible basics", "understanding agentless ad-hoc automation and idempotent desired state", ["inventory", "module", "playbook"], ["control node", "managed node"], [["Ansible", "beginner", "ansible --version"], ["agentless automation", "beginner", "ansible all -m ping"], ["idempotency", "beginner", "ansible-playbook site.yml --check"], ["control node", "beginner", "ansible-config dump"]]],
  ["Inventory", "defining managed hosts, groups, and inventory variables", ["ini", "yaml", "plugin"], ["hosts", "groups"], [["inventory file", "beginner", "ansible-inventory -i inventory.ini --list"], ["YAML inventory", "beginner", "ansible-inventory -i inventory.yml --graph"], ["inventory plugin", "intermediate", "ansible-inventory --list"], ["inventory vars", "intermediate", "ansible-inventory --host web1"]]],
  ["Hosts", "targeting individual managed nodes safely", ["host pattern", "limit", "connection"], ["inventory", "groups"], [["host pattern", "beginner", "ansible web1 -m ping"], ["single host", "beginner", "ansible-playbook site.yml --limit web1"], ["host variables", "intermediate", "ansible-inventory --host web1"], ["unreachable host", "intermediate", "ansible web1 -m ping -vvv"]]],
  ["Groups", "organizing inventory hosts by role or environment", ["children", "vars", "patterns"], ["inventory", "group_vars"], [["group web", "beginner", "ansible web -m ping"], ["group children", "intermediate", "ansible-inventory --graph"], ["group variables", "beginner", "ansible-inventory --host web1"], ["group pattern", "intermediate", "ansible 'web:&prod' -m ping"]]],
  ["Variables", "customizing automation with scoped values", ["vars", "extra-vars", "precedence"], ["group_vars", "host_vars"], [["play vars", "beginner", "ansible-playbook site.yml"], ["extra vars", "beginner", "ansible-playbook site.yml -e app_env=prod"], ["variable precedence", "intermediate", "ansible-playbook site.yml -e @prod.yml"], ["set_fact", "intermediate", "ansible-playbook facts.yml"]]],
  ["Facts", "using discovered system information in automation", ["setup", "ansible_facts", "gather_facts"], ["when", "register"], [["gather facts", "beginner", "ansible all -m setup"], ["disable facts", "beginner", "ansible-playbook site.yml"], ["fact filter", "intermediate", "ansible all -m setup -a 'filter=ansible_distribution'"], ["fact cache", "advanced", "ansible-config dump | grep CACHE"]]],
  ["Tasks", "calling modules as ordered automation steps", ["name", "module", "changed"], ["plays", "handlers"], [["task", "beginner", "ansible-playbook site.yml --start-at-task 'Install nginx'"], ["task result", "beginner", "ansible-playbook site.yml -v"], ["changed status", "intermediate", "ansible-playbook site.yml --diff"], ["failed task", "intermediate", "ansible-playbook site.yml -vv"]]],
  ["Plays", "mapping hosts to tasks, roles, vars, and privileges", ["hosts", "become", "tasks"], ["playbooks", "roles"], [["play", "beginner", "ansible-playbook site.yml"], ["serial play", "intermediate", "ansible-playbook deploy.yml"], ["strategy", "advanced", "ansible-playbook deploy.yml"], ["pre_tasks", "intermediate", "ansible-playbook site.yml"]]],
  ["Playbooks", "storing repeatable automation in YAML files", ["plays", "tasks", "roles"], ["YAML", "inventory"], [["ansible-playbook", "beginner", "ansible-playbook site.yml"], ["syntax check", "beginner", "ansible-playbook site.yml --syntax-check"], ["check mode", "beginner", "ansible-playbook site.yml --check"], ["diff mode", "intermediate", "ansible-playbook site.yml --diff"]]],
  ["Modules", "performing idempotent units of work", ["FQCN", "arguments", "return"], ["tasks", "collections"], [["ansible.builtin.apt", "beginner", "ansible web -m apt -a 'name=nginx state=present' -b"], ["ansible.builtin.copy", "beginner", "ansible web -m copy -a 'src=a dest=b'"], ["module docs", "beginner", "ansible-doc ansible.builtin.service"], ["module return", "intermediate", "ansible-playbook site.yml -v"]]],
  ["Package management", "installing and removing operating system packages", ["apt", "dnf", "package"], ["become", "idempotency"], [["apt module", "beginner", "ansible web -m apt -a 'name=nginx state=present' -b"], ["package module", "beginner", "ansible all -m package -a 'name=curl state=present' -b"], ["update cache", "intermediate", "ansible-playbook packages.yml"], ["remove package", "intermediate", "ansible web -m apt -a 'name=nginx state=absent' -b"]]],
  ["Service management", "starting, stopping, enabling, and restarting services", ["service", "systemd", "enabled"], ["handlers", "notify"], [["service module", "beginner", "ansible web -m service -a 'name=nginx state=started enabled=true' -b"], ["systemd module", "intermediate", "ansible web -m systemd -a 'name=nginx state=restarted' -b"], ["daemon reload", "intermediate", "ansible-playbook service.yml"], ["service facts", "advanced", "ansible all -m service_facts"]]],
  ["File management", "creating directories, files, permissions, and copies", ["file", "copy", "mode"], ["templates", "handlers"], [["file module", "beginner", "ansible web -m file -a 'path=/opt/app state=directory' -b"], ["copy module", "beginner", "ansible web -m copy -a 'src=app.conf dest=/etc/app.conf' -b"], ["lineinfile", "intermediate", "ansible web -m lineinfile -a 'path=/etc/app line=enabled=true' -b"], ["synchronize", "advanced", "ansible-playbook sync.yml"]]],
  ["Templates", "rendering Jinja2 templates to managed nodes", ["src", "dest", "mode"], ["Jinja2", "variables"], [["template module", "beginner", "ansible-playbook template.yml"], ["validate template", "intermediate", "ansible-playbook nginx.yml"], ["template notify", "beginner", "ansible-playbook nginx.yml"], ["template diff", "intermediate", "ansible-playbook nginx.yml --diff"]]],
  ["Jinja2", "using expressions, filters, and control flow in templates", ["filters", "tests", "{{ }}"], ["templates", "variables"], [["Jinja2 expression", "beginner", "ansible-playbook site.yml"], ["default filter", "beginner", "ansible-playbook site.yml"], ["to_nice_yaml", "intermediate", "ansible-playbook render.yml"], ["template loop", "intermediate", "ansible-playbook users.yml"]]],
  ["Loops", "repeating tasks for each item in a collection", ["loop", "item", "loop_control"], ["tasks", "variables"], [["loop", "beginner", "ansible-playbook packages.yml"], ["loop item", "beginner", "ansible-playbook users.yml"], ["loop_control", "intermediate", "ansible-playbook users.yml"], ["dict loop", "intermediate", "ansible-playbook configs.yml"]]],
  ["Conditions", "running tasks only when expressions match", ["when", "facts", "bool"], ["facts", "register"], [["when", "beginner", "ansible-playbook site.yml"], ["fact condition", "beginner", "ansible-playbook packages.yml"], ["registered condition", "intermediate", "ansible-playbook deploy.yml"], ["failed_when", "advanced", "ansible-playbook health.yml"]]],
  ["Handlers", "running deferred tasks after changes", ["handlers", "listen", "meta"], ["notify", "services"], [["handler", "beginner", "ansible-playbook nginx.yml"], ["restart handler", "beginner", "ansible-playbook nginx.yml"], ["flush handlers", "intermediate", "ansible-playbook deploy.yml"], ["handler listen", "advanced", "ansible-playbook services.yml"]]],
  ["Notify", "queuing handlers from changed tasks", ["notify", "changed", "handler name"], ["handlers", "templates"], [["notify", "beginner", "ansible-playbook nginx.yml"], ["notify list", "intermediate", "ansible-playbook app.yml"], ["notify only on change", "beginner", "ansible-playbook nginx.yml --diff"], ["notify handler listen", "advanced", "ansible-playbook services.yml"]]],
  ["Register", "capturing task results for later decisions", ["register", "stdout", "rc"], ["debug", "when"], [["register", "beginner", "ansible-playbook register.yml"], ["stdout", "beginner", "ansible-playbook debug.yml"], ["return code", "intermediate", "ansible-playbook health.yml"], ["changed_when", "advanced", "ansible-playbook commands.yml"]]],
  ["Debug", "printing variables and messages during execution", ["debug", "var", "msg"], ["register", "verbosity"], [["debug var", "beginner", "ansible-playbook debug.yml"], ["debug msg", "beginner", "ansible-playbook site.yml"], ["verbosity debug", "intermediate", "ansible-playbook site.yml -vv"], ["inspect hostvars", "advanced", "ansible-playbook debug.yml"]]],
  ["Tags", "selecting subsets of automation at runtime", ["tags", "always", "never"], ["playbooks", "roles"], [["tags", "beginner", "ansible-playbook site.yml --tags docker"], ["skip tags", "beginner", "ansible-playbook site.yml --skip-tags docker"], ["list tags", "beginner", "ansible-playbook site.yml --list-tags"], ["role tags", "intermediate", "ansible-playbook site.yml --tags nginx"]]],
  ["Roles", "packaging reusable automation structure", ["tasks", "handlers", "defaults"], ["Galaxy", "collections"], [["role structure", "beginner", "ansible-galaxy init common"], ["role usage", "beginner", "ansible-playbook site.yml"], ["role defaults", "intermediate", "ansible-playbook site.yml"], ["role dependencies", "advanced", "ansible-galaxy install -r requirements.yml"]]],
  ["Collections", "distributing modules, roles, and plugins by namespace", ["namespace", "collection", "FQCN"], ["Galaxy", "modules"], [["collection install", "beginner", "ansible-galaxy collection install community.docker"], ["collection list", "beginner", "ansible-galaxy collection list"], ["FQCN usage", "beginner", "ansible-playbook docker.yml"], ["requirements.yml", "intermediate", "ansible-galaxy collection install -r requirements.yml"]]],
  ["Galaxy", "installing and publishing roles and collections", ["role", "collection", "requirements"], ["roles", "collections"], [["galaxy role init", "beginner", "ansible-galaxy init common"], ["galaxy role install", "beginner", "ansible-galaxy install geerlingguy.nginx"], ["galaxy collection install", "beginner", "ansible-galaxy collection install community.general"], ["galaxy requirements", "intermediate", "ansible-galaxy install -r requirements.yml"]]],
  ["Vault", "encrypting sensitive Ansible data at rest", ["encrypt", "decrypt", "vault-id"], ["secrets", "variables"], [["vault create", "beginner", "ansible-vault create secrets.yml"], ["vault edit", "beginner", "ansible-vault edit secrets.yml"], ["vault encrypt", "beginner", "ansible-vault encrypt group_vars/prod/vault.yml"], ["vault id", "intermediate", "ansible-playbook site.yml --vault-id prod@prompt"]]],
  ["Become", "escalating privileges on managed nodes", ["become", "become_user", "sudo"], ["SSH", "tasks"], [["become true", "beginner", "ansible-playbook site.yml -b"], ["become user", "intermediate", "ansible-playbook app.yml"], ["sudo password", "intermediate", "ansible-playbook site.yml --ask-become-pass"], ["task become", "beginner", "ansible-playbook packages.yml"]]],
  ["SSH", "connecting to Linux managed nodes", ["user", "key", "port"], ["inventory", "control node"], [["SSH connection", "beginner", "ansible all -m ping -u deploy"], ["private key", "beginner", "ansible all -m ping --private-key ~/.ssh/id_ed25519"], ["SSH port", "intermediate", "ansible all -m ping -e ansible_port=2222"], ["ssh common args", "advanced", "ansible-config dump | grep SSH"]]],
  ["Configuration", "setting Ansible defaults and plugin behavior", ["ansible.cfg", "defaults", "inventory"], ["inventory", "SSH"], [["ansible.cfg", "beginner", "ansible-config dump"], ["config file", "beginner", "ansible --version"], ["forks", "intermediate", "ansible-config dump | grep FORKS"], ["fact caching config", "advanced", "ansible-config dump | grep CACHE"]]],
  ["Troubleshooting", "diagnosing inventory, connection, YAML, and module failures", ["-vvv", "syntax-check", "list-hosts"], ["debug", "register"], [["verbosity", "beginner", "ansible-playbook site.yml -vvv"], ["syntax check", "beginner", "ansible-playbook site.yml --syntax-check"], ["list hosts", "beginner", "ansible web --list-hosts"], ["step execution", "advanced", "ansible-playbook site.yml --step"]]],
  ["DevOps workflows", "integrating Ansible with deployments and operations", ["check", "diff", "limit"], ["CI/CD", "roles"], [["CI syntax check", "beginner", "ansible-playbook site.yml --syntax-check"], ["dry run", "beginner", "ansible-playbook site.yml --check --diff"], ["rolling deploy", "intermediate", "ansible-playbook deploy.yml --limit web"], ["tagged deploy", "intermediate", "ansible-playbook site.yml --tags deploy"]]],
];

function buildAnswers(example) {
  const answers = new Set([example]);

  if (example.includes(" -m ")) {
    answers.add(example.replace(" -m ", " --module-name "));
  }

  const playbookFlagMatch = example.match(/^ansible-playbook ([^ ]+\.ya?ml) (--[a-z-]+)(.*)$/);
  if (playbookFlagMatch) {
    answers.add(`ansible-playbook ${playbookFlagMatch[2]}${playbookFlagMatch[3]} ${playbookFlagMatch[1]}`.trim());
  }

  if (example.startsWith("ansible-galaxy init ")) {
    answers.add(example.replace("ansible-galaxy init", "ansible-galaxy role init"));
  }

  if (example.startsWith("ansible-galaxy install ")) {
    answers.add(example.replace("ansible-galaxy install", "ansible-galaxy role install"));
  }

  return Array.from(answers);
}

function makeEntry([category, purpose, options, related, items]) {
  return items.map(([command, difficulty, example]) => ({
    category,
    difficulty,
    command,
    topic: command,
    fullMeaning: command,
    description: `${command} is used for ${purpose}. Category: ${category}. Common options: ${options.join(", ")}. Related concepts: ${related.join(", ")}. Example workflow: ${example}.`,
    basicExplanation: `${command} is used for ${purpose}.`,
    professionalExplanation: `${command} supports repeatable configuration management by making inventory, task intent, or execution behavior explicit and reviewable.`,
    commonSyntax: example,
    syntax: example,
    commonFlags: options,
    commonOptions: options,
    examples: [example],
    devOpsUseCase: `Useful for ${purpose} in provisioning, deployment, configuration drift control, and operations.`,
    commonMistake: `Using ${command} without checking inventory targeting, variable precedence, privilege escalation, or idempotency.`,
    relatedCommands: related,
    relatedConcepts: related,
    answers: buildAnswers(example),
  }));
}

export const ansibleCategories = categoryDefinitions.map(([category]) => category);
export const ansibleCommandCatalog = categoryDefinitions.flatMap(makeEntry);
export const ansibleReference = ansibleCategories.map((category) => ({
  category,
  commands: ansibleCommandCatalog.filter((item) => item.category === category),
}));

export const ansibleFlashcards = ansibleCommandCatalog.map((item, index) => ({
  id: index === 0 ? "ansible-fc-ansible" : `ansible-fc-${index + 1}`,
  category: item.category,
  difficulty: item.difficulty,
  front: `What should you know about \`${item.command}\`?`,
  basicExplanation: item.basicExplanation,
  professionalExplanation: item.professionalExplanation,
  example: item.examples[0],
  useCase: item.devOpsUseCase,
  relatedConcepts: item.relatedCommands,
}));

export const ansibleMultipleChoice = ansibleCommandCatalog.map((item, index, catalog) => ({
  id: `ansible-mcq-${index + 1}`,
  category: item.category,
  question: `Which Ansible topic or command best matches: ${item.basicExplanation.toLowerCase()}`,
  options: [
    item.command,
    catalog[(index + 9) % catalog.length].command,
    catalog[(index + 47) % catalog.length].command,
    catalog[(index + 83) % catalog.length].command,
  ],
  answer: 0,
  explanation: `\`${item.command}\`: ${item.professionalExplanation}`,
}));

export const ansibleCommandQuiz = ansibleCommandCatalog.map((item, index) => ({
  id: `ansible-command-${index + 1}`,
  category: item.category,
  prompt: `Write an Ansible command that demonstrates or inspects this topic: ${item.command}.`,
  answers: item.answers,
  explanation: `A valid workflow is \`${item.answers[0]}\`.`,
}));
