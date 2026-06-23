import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  linuxLabCategories,
  linuxPracticeLabs,
  practiceLabDifficulties,
  practiceRepository,
} from "./practiceLabs";

const repoRoot = join(process.cwd(), "public", practiceRepository.publicPath);

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

  it("defines the populated downloadable repository metadata", () => {
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
      "archives/",
      "configs/",
      "data/",
      "scripts/",
    ].forEach((entry) => expect(practiceRepository.files).toContain(entry));
  });

  it("keeps the public download path backed by real repository content", () => {
    [
      "README.md",
      "logs/app.log",
      "logs/auth.log",
      "logs/nginx.log",
      "logs/system.log",
      "configs/nginx.conf",
      "configs/app.env",
      "configs/database.conf",
      "configs/sshd_config",
      "scripts/deploy.sh",
      "scripts/backup.sh",
      "scripts/cleanup.sh",
      "scripts/healthcheck.sh",
      "data/users.csv",
      "data/orders.csv",
      "data/errors.txt",
      "data/servers.txt",
      "permissions/private.key",
      "permissions/public.key",
      "archives/backup.tar.gz",
      "archives/logs.tar.gz",
      "troubleshooting/incident-502.md",
    ].forEach((relativePath) => {
      expect(existsSync(join(repoRoot, relativePath)), relativePath).toBe(true);
    });

    expect(statSync(join(repoRoot, "archives/backup.tar.gz")).size).toBeGreaterThan(100);
    expect(statSync(join(repoRoot, "archives/logs.tar.gz")).size).toBeGreaterThan(100);
  });

  it("maps every Linux lab category to practice repository content", () => {
    linuxLabCategories.forEach((category) => {
      expect(practiceRepository.labMappings[category], category).toBeDefined();
      expect(practiceRepository.labMappings[category].length, category).toBeGreaterThan(0);
    });

    expect(practiceRepository.labMappings.Grep).toEqual(
      expect.arrayContaining(["logs/app.log", "logs/auth.log", "logs/nginx.log"]),
    );
    expect(practiceRepository.labMappings.Permissions).toContain("permissions/private.key");
    expect(practiceRepository.labMappings.Troubleshooting).toContain("troubleshooting/incident-502.md");
  });

  it("documents setup, sample tasks, and learning outcomes in major folders", () => {
    const rootReadme = readFileSync(join(repoRoot, "README.md"), "utf8");
    expect(rootReadme).toContain("Setup");
    expect(rootReadme).toContain("Difficulty progression");
    expect(rootReadme).toContain("Recommended exercises");

    [
      "navigation",
      "files",
      "permissions",
      "logs",
      "networking",
      "processes",
      "services",
      "bash",
      "troubleshooting",
      "archives",
      "configs",
      "data",
      "scripts",
    ].forEach((folder) => {
      const readme = readFileSync(join(repoRoot, folder, "README.md"), "utf8");
      expect(readme, folder).toContain("Purpose:");
      expect(readme, folder).toContain("Sample tasks:");
      expect(readme, folder).toContain("Suggested commands:");
      expect(readme, folder).toContain("Expected outcome:");
    });
  });
});
