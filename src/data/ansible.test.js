import { describe, expect, it } from "vitest";
import {
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
    expect(ansibleFlashcards.length).toBeGreaterThanOrEqual(20);
    expect(ansibleMultipleChoice.length).toBeGreaterThanOrEqual(30);
    expect(ansibleCommandQuiz.length).toBeGreaterThanOrEqual(25);
    expect(ansiblePractice).toHaveLength(15);
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
});
