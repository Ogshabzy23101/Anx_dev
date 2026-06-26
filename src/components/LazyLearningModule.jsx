import ModuleLab from "./module/ModuleLab";
import { learningModuleRegistry } from "../data/learningModuleRegistry";

export default function LazyLearningModule({ moduleId, progress, setProgress, onWrong }) {
  const module = learningModuleRegistry[moduleId];

  if (!module) {
    return null;
  }

  return (
    <ModuleLab
      module={module}
      progress={progress}
      setProgress={setProgress}
      onWrong={onWrong}
    />
  );
}
