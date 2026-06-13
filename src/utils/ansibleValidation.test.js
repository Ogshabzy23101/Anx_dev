import { describe, expect, it } from "vitest";
import { validatePracticeAnswer } from "./answerValidation";
import { ansibleRules } from "./ansibleValidation";

describe("Ansible YAML validation helpers", () => {
  it("checks play targets, privilege escalation, tasks, and modules", () => {
    const rules = [
      ansibleRules.hosts("web"),
      ansibleRules.become(true),
      ansibleRules.tasks,
      ansibleRules.module("apt"),
      ansibleRules.package("nginx"),
    ];
    const answer = [
      "---",
      "- hosts: web",
      "  become: true",
      "  tasks:",
      "    - name: Install nginx",
      "      ansible.builtin.apt:",
      "        name: nginx",
    ].join("\n");

    expect(validatePracticeAnswer(answer, rules)).toEqual({
      isCorrect: true,
      missing: [],
    });
  });

  it("checks handlers, notify, loops, conditions, and registration", () => {
    const rules = [
      ansibleRules.notify("Restart nginx"),
      ansibleRules.handlers,
      ansibleRules.loop,
      ansibleRules.register("result"),
      ansibleRules.debugVar("result.stdout"),
    ];
    const answer = [
      "notify: Restart nginx",
      "loop:",
      "  - one",
      "register: result",
      "handlers:",
      "  - name: Restart nginx",
      "var: result.stdout",
    ].join("\n");

    expect(validatePracticeAnswer(answer, rules).isCorrect).toBe(true);
  });
});
