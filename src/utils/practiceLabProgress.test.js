import { describe, expect, it } from "vitest";
import { linuxPracticeLabs } from "../data/practiceLabs";
import { calculatePracticeLabStats } from "./practiceLabProgress";

describe("practice lab progress", () => {
  it("calculates started, completed, difficulty, and category completion", () => {
    const grepLab = linuxPracticeLabs.find((lab) => lab.category === "Grep" && lab.difficulty === "Beginner");
    const advancedLab = linuxPracticeLabs.find((lab) => lab.difficulty === "Advanced");
    const stats = calculatePracticeLabStats({
      practiceLabStartedIds: [grepLab.id, advancedLab.id],
      practiceLabCompletedIds: [grepLab.id],
      practiceLabFailures: {},
    }, linuxPracticeLabs);

    expect(stats.startedCount).toBe(2);
    expect(stats.completedCount).toBe(1);
    expect(stats.completionPercentage).toBe(1);
    expect(stats.difficultyCompletion.Beginner.completed).toBe(1);
    expect(stats.categoryCompletion.Grep.completed).toBe(1);
  });

  it("recommends weak practice areas from failures and low completion", () => {
    const stats = calculatePracticeLabStats({
      practiceLabStartedIds: [],
      practiceLabCompletedIds: [],
      practiceLabFailures: { Permissions: 3, "Bash Scripting": 2 },
    }, linuxPracticeLabs);

    expect(stats.recommendedPracticeAreas).toContain("Permissions");
    expect(stats.recommendedPracticeAreas).toContain("Bash Scripting");
  });
});
