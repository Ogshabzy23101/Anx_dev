import { describe, expect, it } from "vitest";
import {
  terraformCommandQuiz,
  terraformCommandCatalog,
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
    expect(terraformCommandCatalog).toHaveLength(124);
    expect(terraformFlashcards).toHaveLength(124);
    expect(terraformMultipleChoice).toHaveLength(124);
    expect(terraformCommandQuiz).toHaveLength(124);
    expect(terraformPractice).toHaveLength(31);

    terraformCommandCatalog.forEach((item) => {
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

  it("validates provider, resource, data, module, and backend exercises", () => {
    [
      "tf-hcl-provider",
      "tf-hcl-ec2",
      "tf-hcl-data",
      "tf-hcl-module",
      "tf-hcl-backend-complete",
    ].forEach((id) => {
      const task = terraformPractice.find((item) => item.id === id);
      expect(validatePracticeAnswer(task.solution, task.rules).isCorrect).toBe(true);
    });
  });

  it("detects missing backend and state locking fields", () => {
    const task = terraformPractice.find((item) => item.id === "tf-hcl-backend-complete");
    const validation = validatePracticeAnswer(
      'terraform {\n  backend "s3" {\n    bucket = "company-tf-state"\n  }\n}',
      task.rules,
    );

    expect(validation.missing).toEqual(expect.arrayContaining([
      "key = prod/app/terraform.tfstate",
      "region = us-east-1",
      "encrypt = true",
      "dynamodb_table = terraform-locks",
    ]));
  });
});
