import { describe, expect, it } from "vitest";
import { validatePracticeAnswer } from "./answerValidation";
import { helmRules } from "./helmValidation";

describe("Helm validation helpers", () => {
  it("checks .Values template expressions", () => {
    const rules = [
      helmRules.values("image.repository"),
      helmRules.values("image.tag"),
    ];

    expect(validatePracticeAnswer(
      'image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"',
      rules,
    )).toEqual({ isCorrect: true, missing: [] });
  });

  it("detects missing include usage", () => {
    const rules = [helmRules.include("webapp.fullname")];
    expect(validatePracticeAnswer("name: webapp", rules).missing).toEqual([
      'include "webapp.fullname"',
    ]);
    expect(validatePracticeAnswer(
      'name: {{ include "webapp.fullname" . }}',
      rules,
    ).isCorrect).toBe(true);
  });

  it("validates if and range template blocks", () => {
    const rules = [
      helmRules.if(".Values.ingress.enabled"),
      helmRules.range(".Values.hosts"),
      helmRules.end,
    ];
    const answer = [
      "{{- if .Values.ingress.enabled }}",
      "{{- range .Values.hosts }}",
      "- host: {{ . }}",
      "{{- end }}",
      "{{- end }}",
    ].join("\n");

    expect(validatePracticeAnswer(answer, rules).isCorrect).toBe(true);
    expect(validatePracticeAnswer("{{ if .Values.ingress.enabled }}", rules).missing)
      .toEqual(["range .Values.hosts", "{{ end }}"]);
  });

  it("checks Chart.yaml and values.yaml fields", () => {
    const rules = [
      helmRules.chartField("apiVersion", "v2"),
      helmRules.chartField("version", "0.1.0"),
      helmRules.valuesField("image"),
    ];
    expect(validatePracticeAnswer(
      "apiVersion: v2\nversion: 0.1.0\nimage:\n  tag: latest",
      rules,
    ).isCorrect).toBe(true);
  });
});
