import { describe, expect, it } from "vitest";
import {
  linuxLabCategories,
  linuxPracticeLabs,
  practiceLabDifficulties,
  practiceRepository,
} from "./practiceLabs";

describe("Practice Lab data", () => {
  it("contains 75 Linux labs split evenly by difficulty", () => {
    expect(linuxPracticeLabs).toHaveLength(75);

    practiceLabDifficulties.forEach((difficulty) => {
      expect(linuxPracticeLabs.filter((lab) => lab.difficulty === difficulty)).toHaveLength(25);
    });
  });

  it("covers all required Linux lab categories", () => {
    const categories = new Set(linuxPracticeLabs.map((lab) => lab.category));

    linuxLabCategories.forEach((category) => {
      expect(categories.has(category)).toBe(true);
    });
  });

  it("uses the required lab structure", () => {
    linuxPracticeLabs.forEach((lab) => {
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
        relatedLinuxTopics: expect.any(Array),
      }));
      expect(lab.objectives.length).toBeGreaterThanOrEqual(3);
      expect(lab.expectedCommands.length).toBeGreaterThanOrEqual(3);
      expect(lab.hints).toHaveLength(3);
    });
  });

  it("defines the placeholder downloadable repository metadata", () => {
    expect(practiceRepository.root).toBe("linux-practice-lab/");
    expect(practiceRepository.publicPath).toBe("practice-repos/linux-practice-lab/");
    [
      "README.md",
      "navigation/",
      "files/",
      "permissions/",
      "logs/",
      "networking/",
      "processes/",
      "services/",
      "bash/",
      "troubleshooting/",
    ].forEach((entry) => expect(practiceRepository.files).toContain(entry));
  });
});
