import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";
import { joinGroup } from "./api/groups";
import { Home } from "./screens/Home/Home";
import { JoinGroup } from "./screens/JoinGroup/JoinGroup";

// Mock location until the location flow is built (see Figma notes for 1. Home).
const MOCK_LOCATION = "Berkeley, CA";

// Remember the nickname on this device so returning users don't retype it.
const NICKNAME_KEY = "crave.nickname";
function loadNickname() {
  try {
    return localStorage.getItem(NICKNAME_KEY) ?? "";
  } catch {
    return "";
  }
}
function saveNickname(name: string) {
  try {
    localStorage.setItem(NICKNAME_KEY, name);
  } catch {
    // Private mode or storage blocked: not important.
  }
}

/** Go back if we came from inside the app, otherwise go to Home (e.g. someone opened /join directly). */
function useGoBack() {
  const navigate = useNavigate();
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/", { replace: true });
  };
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <Home
      locationLabel={MOCK_LOCATION}
      // TODO: Lobby and location picker screens.
      onCreateGroup={() => console.info("Create a group")}
      onJoinWithCode={() => navigate("/join")}
      onChangeLocation={() => console.info("Change location")}
    />
  );
}

function JoinRoute() {
  const goBack = useGoBack();
  return (
    <JoinGroup
      initialName={loadNickname()}
      onBack={goBack}
      onJoin={joinGroup}
      onJoined={(result, nickname) => {
        saveNickname(nickname);
        // TODO: open the Lobby as a guest once that screen exists.
        console.info("Joined", result);
      }}
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/join" element={<JoinRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
