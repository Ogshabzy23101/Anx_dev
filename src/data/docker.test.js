import { describe, expect, it } from "vitest";
import {
  dockerCommandQuiz,
  dockerFilePractice,
  dockerReference,
} from "./docker";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("Docker learning data", () => {
  it("includes the required Docker reference topics", () => {
    const referenceText = dockerReference
      .flatMap((section) => section.commands)
      .map((item) => `${item.command} ${item.description}`)
      .join(" ")
      .toLowerCase();

    [
      "image",
      "container",
      "docker build",
      "docker run",
      "port",
      "environment",
      "volume",
      "network",
      "docker exec",
      "docker logs",
      "docker ps",
      "docker stop",
      "docker rm",
      "docker tag",
      "docker push",
      "dockerfile",
      "build context",
      "multi-stage",
    ].forEach((topic) => {
      expect(referenceText).toContain(topic);
    });
  });

  it("accepts every primary command-writing answer", () => {
    dockerCommandQuiz.forEach((question) => {
      expect(isCommandCorrect(question.answers[0], question.answers)).toBe(true);
    });
  });

  it("accepts every Docker file-practice reference solution", () => {
    dockerFilePractice.forEach((task) => {
      expect(validatePracticeAnswer(task.solution, task.rules)).toEqual({
        isCorrect: true,
        missing: [],
      });
    });
  });

  it("reports missing Dockerfile requirements", () => {
    const task = dockerFilePractice.find((item) => item.id === "dockerfile-directives");
    const validation = validatePracticeAnswer("FROM node:22\nWORKDIR /app", task.rules);

    expect(validation.isCorrect).toBe(false);
    expect(validation.missing).toEqual(
      expect.arrayContaining(["COPY", "RUN npm install", "EXPOSE", "CMD"]),
    );
  });
});
