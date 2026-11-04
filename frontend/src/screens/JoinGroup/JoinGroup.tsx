import { useRef, useState, type FormEvent } from "react";
import { BackButton } from "../../components/BackButton/BackButton";
import { Button } from "../../components/Button/Button";
import { CodeInput } from "../../components/CodeInput/CodeInput";
import { Screen, Spacer } from "../../components/Screen/Screen";
import { TextField } from "../../components/TextField/TextField";
import type { JoinResult } from "../../api/groups";
import styles from "./JoinGroup.module.css";

/** Join codes are 4 digits, kept as text so a leading zero survives (e.g. "0427"). Matches the backend. */
export const CODE_LENGTH = 4;
const NICKNAME_MAX = 30; // backend limit

const ERROR_MESSAGES: Record<Extract<JoinResult, { ok: false }>["error"], string> = {
  GROUP_NOT_FOUND: "Code not found",
  GROUP_CLOSED: "This group has ended",
  NICKNAME_TAKEN: "Someone in this group already has that name",
};

type JoinGroupProps = {
  initialName?: string;
  onBack: () => void;
  onJoin: (code: string, nickname: string) => Promise<JoinResult>;
  onJoined: (result: Extract<JoinResult, { ok: true }>, nickname: string) => void;
};

export function JoinGroup({ initialName = "", onBack, onJoin, onJoined }: JoinGroupProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<JoinResult | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const codeComplete = code.length === CODE_LENGTH;
  const trimmedName = name.trim();
  const canJoin = codeComplete && trimmedName.length > 0 && !submitting;
  const codeError = error && !error.ok && error.error !== "NICKNAME_TAKEN";

  let hint = "";
  if (!codeComplete) hint = `Fill in all ${CODE_LENGTH} digits to join`;
  else if (!trimmedName) hint = "Add your name to join";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canJoin) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onJoin(code, trimmedName);
      if (result.ok) {
        onJoined(result, trimmedName);
      } else {
        setError(result);
        if (result.error !== "NICKNAME_TAKEN") setShakeCount((n) => n + 1);
        navigator.vibrate?.(60);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <BackButton onClick={onBack} />
        <h1 className={styles.title}>Join a group</h1>
        <p className={styles.subtitle}>Enter the {CODE_LENGTH}-digit code your friend shared.</p>

        <CodeInput
          value={code}
          length={CODE_LENGTH}
          onChange={(next) => {
            setCode(next);
            if (codeError) setError(null);
          }}
          onEnter={() => nameRef.current?.focus()}
          invalid={Boolean(codeError)}
          shakeKey={shakeCount}
          autoFocus
          aria-describedby="join-status"
        />
        {error && !error.ok && (
          <p className={styles.error} role="alert">
            {ERROR_MESSAGES[error.error]}
          </p>
        )}

        <TextField
          ref={nameRef}
          label="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error && !error.ok && error.error === "NICKNAME_TAKEN") setError(null);
          }}
          placeholder="What should friends call you?"
          maxLength={NICKNAME_MAX}
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="go"
        />

        <Spacer />

        <Button type="submit" disabled={!canJoin}>
          {submitting ? "Joining…" : "Join group"}
        </Button>
        <p id="join-status" className={styles.hint} aria-live="polite">
          {hint}
        </p>
      </form>
    </Screen>
  );
}
