"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;

export function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = username.trim().replace(/^@/, "");

    if (!USERNAME_PATTERN.test(normalized)) {
      setError("Enter a valid GitHub username.");
      return;
    }

    setError("");
    router.push(`/create/${encodeURIComponent(normalized)}`);
  }

  return (
    <form className="username-form" onSubmit={handleSubmit} noValidate>
      <div className="username-field">
        <span aria-hidden="true">@</span>
        <input
          id="github-username"
          name="username"
          aria-label="GitHub username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="github username"
          autoCapitalize="none"
          autoComplete="username"
          spellCheck={false}
          aria-describedby={error ? "username-error" : "username-hint"}
          aria-invalid={Boolean(error)}
        />
      </div>
      <button type="submit">
        Build my email
        <span aria-hidden="true">↗</span>
      </button>
      {error ? (
        <p className="form-error" id="username-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="form-hint" id="username-hint">
          No sign-in required. We only use public profile data.
        </p>
      )}
    </form>
  );
}
