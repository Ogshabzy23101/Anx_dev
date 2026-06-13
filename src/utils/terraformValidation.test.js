import { describe, expect, it } from "vitest";
import { validatePracticeAnswer } from "./answerValidation";
import { terraformRules } from "./terraformValidation";

describe("Terraform HCL validation helpers", () => {
  it("checks provider, resource, and required attributes", () => {
    const rules = [
      terraformRules.provider("aws"),
      terraformRules.resource("aws_instance", "web"),
      terraformRules.attribute("ami", "ami-123456"),
      terraformRules.attribute("instance_type", "t3.micro"),
    ];
    const answer = [
      'provider "aws" {',
      '  region = "us-east-1"',
      "}",
      'resource "aws_instance" "web" {',
      '  ami = "ami-123456"',
      '  instance_type = "t3.micro"',
      "}",
    ].join("\n");

    expect(validatePracticeAnswer(answer, rules)).toEqual({
      isCorrect: true,
      missing: [],
    });
  });

  it("checks HCL references and module blocks", () => {
    const rules = [
      terraformRules.module("vpc"),
      terraformRules.reference("module.vpc.vpc_id"),
    ];
    const validation = validatePracticeAnswer(
      'module "vpc" { source = "./vpc" }\noutput "id" { value = module.vpc.vpc_id }',
      rules,
    );
    expect(validation.isCorrect).toBe(true);
  });
});
