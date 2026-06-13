import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  it("loads saved progress and merges newly introduced fields", () => {
    localStorage.setItem(
      "progress",
      JSON.stringify({ quizScore: 80, masteredFlashcards: ["card-1"] }),
    );

    const { result } = renderHook(() =>
      useLocalStorage("progress", {
        quizScore: 0,
        masteredFlashcards: [],
        completedPractices: [],
      }),
    );

    expect(result.current[0]).toEqual({
      quizScore: 80,
      masteredFlashcards: ["card-1"],
      completedPractices: [],
    });
  });

  it("persists progress updates", async () => {
    const { result } = renderHook(() =>
      useLocalStorage("progress", { quizScore: 0 }),
    );

    act(() => {
      result.current[1]({ quizScore: 100 });
    });

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("progress"))).toEqual({
        quizScore: 100,
      });
    });
  });
});
