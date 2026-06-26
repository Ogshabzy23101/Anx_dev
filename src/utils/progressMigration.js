export const PROGRESS_SCHEMA_VERSION = 2;

const legacyDefaults = {
  masteredFlashcards: [],
  quizScore: 0,
  completedCommands: [],
  completedPractices: [],
  dockerMasteredFlashcards: [],
  dockerQuizScore: 0,
  dockerCompletedCommands: [],
  dockerCompletedPractices: [],
  kubernetesMasteredFlashcards: [],
  kubernetesQuizScore: 0,
  kubernetesCompletedCommands: [],
  kubernetesCommandScore: 0,
  kubernetesCompletedManifests: [],
  helmMasteredFlashcards: [],
  helmQuizScore: 0,
  helmCompletedCommands: [],
  helmCommandScore: 0,
  helmCompletedPractices: [],
  terraformMasteredFlashcards: [],
  terraformQuizScore: 0,
  terraformCompletedCommands: [],
  terraformCommandScore: 0,
  terraformCompletedPractices: [],
  ansibleMasteredFlashcards: [],
  ansibleQuizScore: 0,
  ansibleCompletedCommands: [],
  ansibleCommandScore: 0,
  ansibleCompletedPractices: [],
  interviewReviewedQuestions: [],
  interviewMasteredFlashcards: [],
  interviewQuizScore: 0,
  interviewCompletedWritten: [],
  interviewCompletedMocks: 0,
  interviewWeakCategories: [],
  practiceLabStartedIds: [],
  practiceLabCompletedIds: [],
  practiceLabFailures: {},
  dockerPracticeLabStartedIds: [],
  dockerPracticeLabCompletedIds: [],
  dockerPracticeLabFailures: {},
};

function list(value) {
  return Array.isArray(value) ? value : [];
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export const initialProgress = migrateProgress({});

export function migrateProgress(input) {
  const current = {
    ...legacyDefaults,
    ...(input && typeof input === "object" && !Array.isArray(input) ? input : {}),
  };

  return {
    ...current,
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    modules: {
      linux: {
        masteredFlashcards: list(current.masteredFlashcards),
        quizScore: current.quizScore || 0,
        completedCommands: list(current.completedCommands),
        completedPractices: list(current.completedPractices),
      },
      docker: {
        masteredFlashcards: list(current.dockerMasteredFlashcards),
        quizScore: current.dockerQuizScore || 0,
        completedCommands: list(current.dockerCompletedCommands),
        completedPractices: list(current.dockerCompletedPractices),
      },
      kubernetes: {
        masteredFlashcards: list(current.kubernetesMasteredFlashcards),
        quizScore: current.kubernetesQuizScore || 0,
        completedCommands: list(current.kubernetesCompletedCommands),
        commandScore: current.kubernetesCommandScore || 0,
        completedPractices: list(current.kubernetesCompletedManifests),
      },
      helm: {
        masteredFlashcards: list(current.helmMasteredFlashcards),
        quizScore: current.helmQuizScore || 0,
        completedCommands: list(current.helmCompletedCommands),
        commandScore: current.helmCommandScore || 0,
        completedPractices: list(current.helmCompletedPractices),
      },
      terraform: {
        masteredFlashcards: list(current.terraformMasteredFlashcards),
        quizScore: current.terraformQuizScore || 0,
        completedCommands: list(current.terraformCompletedCommands),
        commandScore: current.terraformCommandScore || 0,
        completedPractices: list(current.terraformCompletedPractices),
      },
      ansible: {
        masteredFlashcards: list(current.ansibleMasteredFlashcards),
        quizScore: current.ansibleQuizScore || 0,
        completedCommands: list(current.ansibleCompletedCommands),
        commandScore: current.ansibleCommandScore || 0,
        completedPractices: list(current.ansibleCompletedPractices),
      },
      interview: {
        reviewedQuestions: list(current.interviewReviewedQuestions),
        masteredFlashcards: list(current.interviewMasteredFlashcards),
        quizScore: current.interviewQuizScore || 0,
        completedWritten: list(current.interviewCompletedWritten),
        completedMocks: current.interviewCompletedMocks || 0,
        weakCategories: list(current.interviewWeakCategories),
      },
      ...(current.modules || {}),
    },
    practiceLabs: {
      linux: {
        startedIds: list(current.practiceLabStartedIds),
        completedIds: list(current.practiceLabCompletedIds),
        failures: object(current.practiceLabFailures),
      },
      docker: {
        startedIds: list(current.dockerPracticeLabStartedIds),
        completedIds: list(current.dockerPracticeLabCompletedIds),
        failures: object(current.dockerPracticeLabFailures),
      },
      ...(current.practiceLabs || {}),
    },
    settings: object(current.settings),
    stats: object(current.stats),
  };
}
