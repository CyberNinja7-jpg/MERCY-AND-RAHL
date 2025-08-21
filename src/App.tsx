import { useState } from "react";
import HeartAnimation from "./components/HeartAnimation";
import LoginCard from "./components/LoginCard";
import MainContent from "./components/MainContent";

type Stage = "hearts" | "login" | "main";

export default function App() {
  const [stage, setStage] = useState<Stage>("hearts");

  return (
    <div className="h-screen w-screen overflow-hidden">
      {stage === "hearts" && (
        <HeartAnimation onFinish={() => setStage("login")} />
      )}

      {stage === "login" && (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <LoginCard onSuccess={() => setStage("main")} />
        </div>
      )}

      {stage === "main" && <MainContent />}
    </div>
  );
}
