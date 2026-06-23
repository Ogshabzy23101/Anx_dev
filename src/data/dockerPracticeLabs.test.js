import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  dockerLabCategories,
  dockerPracticeLabs,
  dockerPracticeRepository,
} from "./dockerPracticeLabs";
import { practiceLabDifficulties } from "./practiceLabs";

const repoRoot = join(process.cwd(), "public", dockerPracticeRepository.publicPath);

describe("Docker Practice Lab data", () => {
  it("contains 75 Docker labs split evenly by difficulty", () => {
    expect(dockerPracticeLabs).toHaveLength(75);

    practiceLabDifficulties.forEach((difficulty) => {
      expect(dockerPracticeLabs.filter((lab) => lab.difficulty === difficulty)).toHaveLength(25);
    });
  });

  it("covers all required Docker lab categories", () => {
    const categories = new Set(dockerPracticeLabs.map((lab) => lab.category));

    dockerLabCategories.forEach((category) => {
      expect(categories.has(category), category).toBe(true);
    });
  });

  it("uses the required Docker lab structure", () => {
    dockerPracticeLabs.forEach((lab) => {
      expect(lab).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        difficulty: expect.stringMatching(/Beginner|Intermediate|Advanced/),
        category: expect.any(String),
        scenario: expect.any(String),
        objectives: expect.any(Array),
        expectedCommands: expect.any(Array),
        hints: expect.any(Array),
        solution: expect.any(String),
        realWorldExplanation: expect.any(String),
        relatedDockerTopics: expect.any(Array),
      }));
      expect(lab.objectives.length).toBeGreaterThanOrEqual(3);
      expect(lab.expectedCommands.length).toBeGreaterThanOrEqual(3);
      expect(lab.hints).toHaveLength(3);
    });
  });

  it("keeps repository metadata and download path backed by real content", () => {
    expect(dockerPracticeRepository.root).toBe("docker-practice-lab/");
    expect(dockerPracticeRepository.publicPath).toBe("practice-repos/docker-practice-lab/");

    [
      "README.md",
      "dockerfiles/simple.Dockerfile",
      "dockerfiles/broken.Dockerfile",
      "dockerfiles/multistage.Dockerfile",
      "dockerfiles/insecure.Dockerfile",
      "dockerfiles/optimized.Dockerfile",
      "compose/compose-stack.yml",
      "compose/broken-compose.yml",
      "compose/compose-networking-issue.yml",
      "compose/compose-env-issue.yml",
      "logs/startup-failure.log",
      "logs/missing-env.log",
      "logs/connection-refused.log",
      "logs/database-failure.log",
      "logs/healthcheck-failure.log",
      "security/exposed-secret.md",
      "troubleshooting/container-exits.md",
      "troubleshooting/port-conflict.md",
    ].forEach((relativePath) => {
      expect(existsSync(join(repoRoot, relativePath)), relativePath).toBe(true);
    });
  });

  it("maps every Docker lab category to practice repository content", () => {
    dockerLabCategories.forEach((category) => {
      expect(dockerPracticeRepository.labMappings[category], category).toBeDefined();
      expect(dockerPracticeRepository.labMappings[category].length, category).toBeGreaterThan(0);
    });

    expect(dockerPracticeRepository.labMappings.Dockerfile).toContain("dockerfiles/");
    expect(dockerPracticeRepository.labMappings.Compose).toContain("compose/");
    expect(dockerPracticeRepository.labMappings.Troubleshooting).toContain("troubleshooting/");
  });

  it("documents purpose, tasks, commands, and outcomes in every major folder", () => {
    [
      "images",
      "containers",
      "dockerfiles",
      "compose",
      "volumes",
      "networking",
      "logs",
      "security",
      "troubleshooting",
    ].forEach((folder) => {
      const readme = readFileSync(join(repoRoot, folder, "README.md"), "utf8");
      expect(readme, folder).toContain("Purpose:");
      expect(readme, folder).toContain("Sample tasks:");
      expect(readme, folder).toContain("Suggested commands:");
      expect(readme, folder).toContain("Expected outcome:");
    });
  });
});
