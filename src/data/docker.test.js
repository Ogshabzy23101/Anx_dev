import { describe, expect, it } from "vitest";
import {
  dockerCommandQuiz,
  dockerCommandCatalog,
  dockerFilePractice,
  dockerFlashcards,
  dockerMultipleChoice,
  dockerReference,
} from "./docker";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("Docker learning data", () => {
  it("contains the enriched Docker content volume and learning fields", () => {
    expect(dockerCommandCatalog).toHaveLength(80);
    expect(dockerFlashcards).toHaveLength(80);
    expect(dockerMultipleChoice).toHaveLength(80);
    expect(dockerCommandQuiz).toHaveLength(80);
    expect(dockerFilePractice).toHaveLength(25);

    dockerCommandCatalog.forEach((item) => {
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
    const task = dockerFilePractice.find((item) => item.id === "dockerfile-node");
    const validation = validatePracticeAnswer("FROM node:22\nWORKDIR /app", task.rules);

    expect(validation.isCorrect).toBe(false);
    expect(validation.missing).toEqual(
      expect.arrayContaining([
        "COPY package files",
        "RUN npm install",
        "EXPOSE 3000",
        "CMD npm start",
      ]),
    );
  });

  it("validates Compose requirements and detects missing services", () => {
    const task = dockerFilePractice.find((item) => item.id === "compose-three-tier");
    const validation = validatePracticeAnswer(
      "services:\n  frontend:\n    image: nginx\n",
      task.rules,
    );

    expect(validation.isCorrect).toBe(false);
    expect(validation.passed).toContain("service: frontend");
    expect(validation.missing).toEqual(expect.arrayContaining([
      "service: backend",
      "service: postgres",
      "backend depends on postgres",
      "PostgreSQL volume mount",
    ]));
  });
});
