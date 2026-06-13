import { describe, expect, it } from "vitest";
import {
  terraformCommandQuiz,
  terraformFlashcards,
  terraformMultipleChoice,
  terraformPractice,
  terraformReference,
} from "./terraform";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("Terraform learning data", () => {
  it("contains the required content volume", () => {
    expect(terraformFlashcards.length).toBeGreaterThanOrEqual(20);
    expect(terraformMultipleChoice.length).toBeGreaterThanOrEqual(30);
    expect(terraformCommandQuiz.length).toBeGreaterThanOrEqual(25);
    expect(terraformPractice).toHaveLength(15);
  });

  it("covers the requested reference topics", () => {
    const text = terraformReference
      .flatMap((section) => section.commands)
      .map((item) => `${item.command} ${item.description}`)
      .join(" ")
      .toLowerCase();

    [
      "infrastructure as code", "provider", "resource", "variable", "output",
      "data source", "state file", "remote state", "backend", "module",
      "terraform init", "terraform validate", "terraform plan",
      "terraform apply", "terraform destroy", "terraform fmt",
      "terraform import", "workspace", "dependency graph", "lifecycle",
      "count", "for_each", "dynamic block", "local value", "tfvars",
      "sensitive variable",
    ].forEach((topic) => expect(text).toContain(topic));
  });

  it("accepts primary and alternative Terraform commands", () => {
    terraformCommandQuiz.forEach((question) => {
      expect(isCommandCorrect(question.answers[0], question.answers)).toBe(true);
      if (question.answers.length > 1) {
        expect(isCommandCorrect(question.answers[1], question.answers)).toBe(true);
      }
    });
  });

  it("accepts every Terraform HCL reference solution", () => {
    terraformPractice.forEach((task) => {
      expect(validatePracticeAnswer(task.solution, task.rules)).toEqual({
        isCorrect: true,
        missing: [],
      });
    });
  });

  it("identifies exact missing EC2 fields", () => {
    const task = terraformPractice.find((item) => item.id === "tf-hcl-ec2");
    const validation = validatePracticeAnswer(
      'provider "aws" {\n  region = "us-east-1"\n}\nresource "aws_instance" "web" {}',
      task.rules,
    );

    expect(validation.passed).toEqual([
      'provider "aws"',
      'resource "aws_instance" "web"',
    ]);
    expect(validation.missing).toEqual([
      "ami = ami-123456",
      "instance_type = t3.micro",
    ]);
  });
});
