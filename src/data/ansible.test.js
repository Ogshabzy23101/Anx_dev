import { describe, expect, it } from "vitest";
import {
  ansibleCommandCatalog,
  ansibleCommandQuiz,
  ansibleFlashcards,
  ansibleMultipleChoice,
  ansiblePractice,
  ansibleReference,
} from "./ansible";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("Ansible learning data", () => {
  it("contains the required content volume", () => {
    expect(ansibleCommandCatalog).toHaveLength(124);
    expect(ansibleFlashcards).toHaveLength(124);
    expect(ansibleMultipleChoice).toHaveLength(124);
    expect(ansibleCommandQuiz).toHaveLength(124);
    expect(ansiblePractice).toHaveLength(31);

    ansibleCommandCatalog.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        command: expect.any(String),
        fullMeaning: expect.any(String),
        basicExplanation: expect.any(String),
        professionalExplanation: expect.any(String),
        commonSyntax: expect.any(String),
        commonFlags: expect.any(Array),
        examples: expect.any(Array),
        devOpsUseCase: expect.any(String),
        commonMistake: expect.any(String),
        relatedCommands: expect.any(Array),
        difficulty: expect.stringMatching(/beginner|intermediate|advanced/),
      }));
    });
  });

  it("covers the requested reference topics", () => {
    const text = ansibleReference
      .flatMap((section) => section.commands)
      .map((item) => `${item.command} ${item.description}`)
      .join(" ")
      .toLowerCase();

    [
      "ansible", "control node", "managed node", "inventory", "ansible.cfg",
      "ad-hoc", "playbook", "play", "task", "module", "yaml", "variables",
      "facts", "handler", "notify", "template", "jinja2", "role", "group_vars",
      "host_vars", "become", "tags", "loops", "conditions", "register",
      "debug", "vault", "galaxy", "idempotency",
    ].forEach((topic) => expect(text).toContain(topic));
  });

  it("accepts primary and alternative Ansible commands", () => {
    ansibleCommandQuiz.forEach((question) => {
      expect(isCommandCorrect(question.answers[0], question.answers)).toBe(true);
      if (question.answers.length > 1) {
        expect(isCommandCorrect(question.answers[1], question.answers)).toBe(true);
      }
    });
  });

  it("accepts generated alternative Ansible command forms", () => {
    const ping = ansibleCommandQuiz.find((question) => question.prompt.includes("agentless automation"));
    const checkMode = ansibleCommandQuiz.find((question) => question.prompt.includes("idempotency"));

    expect(isCommandCorrect("ansible all --module-name ping", ping.answers)).toBe(true);
    expect(isCommandCorrect("ansible-playbook --check site.yml", checkMode.answers)).toBe(true);
  });

  it("accepts every playbook reference solution", () => {
    ansiblePractice.forEach((task) => {
      expect(validatePracticeAnswer(task.solution, task.rules)).toEqual({
        isCorrect: true,
        missing: [],
      });
    });
  });

  it("detects exact missing nginx task requirements", () => {
    const task = ansiblePractice.find((item) => item.id === "ansible-yaml-apt");
    const validation = validatePracticeAnswer(
      "---\n- hosts: web\n  tasks:\n    - name: Install nginx\n",
      task.rules,
    );

    expect(validation.passed).toEqual(["hosts: web", "tasks:"]);
    expect(validation.missing).toEqual([
      "module: apt",
      "package: nginx",
      "state: present",
      "update_cache: true",
    ]);
  });

  it("validates role, variable, handler, and Vault practice coverage", () => {
    [
      "ansible-yaml-reusable-role",
      "ansible-yaml-host-vars",
      "ansible-yaml-nginx-complete",
      "ansible-yaml-vault",
      "ansible-yaml-collection",
    ].forEach((id) => {
      const task = ansiblePractice.find((item) => item.id === id);
      expect(validatePracticeAnswer(task.solution, task.rules).isCorrect).toBe(true);
    });
  });

  it("detects missing production playbook fields", () => {
    const task = ansiblePractice.find((item) => item.id === "ansible-yaml-production-playbook");
    const validation = validatePracticeAnswer(
      "---\n- name: Production deployment\n  hosts: app\n  tasks: []\n",
      task.rules,
    );

    expect(validation.missing).toEqual(expect.arrayContaining([
      "become: true",
      "serial: 2",
      "pre_tasks:",
      "roles:",
      "post_tasks:",
      "module: service",
      "service state: started",
      "deploy tag",
    ]));
  });
});
