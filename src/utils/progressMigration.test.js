import { describe, expect, it } from "vitest";
import {
  PROGRESS_SCHEMA_VERSION,
  initialProgress,
  migrateProgress,
} from "./progressMigration";

describe("progress migration", () => {
  it("keeps legacy flat progress while adding structured progress", () => {
    const migrated = migrateProgress({
      masteredFlashcards: ["fc-pwd"],
      dockerPracticeLabCompletedIds: ["docker-lab-beginner-1"],
    });

    expect(migrated.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(migrated.masteredFlashcards).toEqual(["fc-pwd"]);
    expect(migrated.modules.linux.masteredFlashcards).toEqual(["fc-pwd"]);
    expect(migrated.practiceLabs.docker.completedIds).toEqual(["docker-lab-beginner-1"]);
  });

  it("provides all legacy defaults for backward compatibility", () => {
    expect(initialProgress.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(initialProgress.dockerMasteredFlashcards).toEqual([]);
    expect(initialProgress.modules.interview.completedMocks).toBe(0);
  });
});
