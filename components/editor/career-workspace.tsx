"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { buildColdEmailBody, createCareerDraft } from "@/lib/career-profile";
import type {
  CareerDraft,
  CareerProfile,
  RenderedEmail,
} from "@/lib/types";

type ApiError = {
  error?: string;
};

function downloadBlob(content: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function CareerWorkspace({ username }: { username: string }) {
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [draft, setDraft] = useState<CareerDraft | null>(null);
  const [rendered, setRendered] = useState<RenderedEmail | null>(null);
  const [profileError, setProfileError] = useState("");
  const [renderError, setRenderError] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      setIsLoadingProfile(true);
      setProfileError("");

      try {
        const response = await fetch(
          `/api/github/${encodeURIComponent(username)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as CareerProfile & ApiError;

        if (!response.ok) {
          throw new Error(data.error || "This profile could not be loaded.");
        }

        setProfile(data);
        setDraft(createCareerDraft(data));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProfileError(
          error instanceof Error
            ? error.message
            : "This profile could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoadingProfile(false);
      }
    }

    void loadProfile();
    return () => controller.abort();
  }, [username]);

  useEffect(() => {
    if (!draft) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setRenderError("");

      try {
        const response = await fetch("/api/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
          signal: controller.signal,
        });
        const data = (await response.json()) as RenderedEmail & ApiError;

        if (!response.ok) {
          throw new Error(data.error || "The preview could not be rendered.");
        }

        setRendered(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRenderError(
          error instanceof Error
            ? error.message
            : "The preview could not be rendered.",
        );
      }
    }, 320);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [draft]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  function setField<K extends keyof CareerDraft>(
    field: K,
    value: CareerDraft[K],
  ) {
    setDraft((current) =>
      current ? { ...current, [field]: value } : current,
    );
  }

  function bindInput(field: keyof CareerDraft) {
    return {
      value: String(draft?.[field] ?? ""),
      onChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setField(field, event.target.value as never),
    };
  }

  function updateTargetCompany(value: string) {
    setDraft((current) => {
      if (!current) return current;
      const company = value.trim() || "Cursor";

      return {
        ...current,
        targetCompany: value,
        emailBody: current.emailBody.replace(
          /Want to intern for .*? this summer/,
          () => `Want to intern for ${company} this summer`,
        ),
      };
    });
  }

  async function copyEmail() {
    if (!rendered) return;
    await navigator.clipboard.writeText(rendered.emailText);
    showToast("Email copied to clipboard");
  }

  function downloadEmail() {
    if (!rendered || !draft) return;
    downloadBlob(
      rendered.emailHtml,
      "text/html;charset=utf-8",
      `${draft.username}-cold-email.html`,
    );
    showToast("Email HTML downloaded");
  }

  if (isLoadingProfile) {
    return (
      <main className="preview-loading">
        <div className="loading-card">
          <span className="step-label">Reading public GitHub data</span>
          <h1>Preparing @{username}&apos;s email…</h1>
          <p>Fetching the public profile and building an editable draft.</p>
          <div className="loading-bar" aria-hidden="true" />
        </div>
      </main>
    );
  }

  if (profileError || !draft || !profile) {
    return (
      <main className="workspace-error">
        <div className="error-card">
          <span className="step-label">Profile unavailable</span>
          <h1>We hit a GitHub-shaped snag.</h1>
          <p>{profileError || "This profile could not be loaded."}</p>
          <Link className="primary-button" href="/">
            Try another username
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <Link href="/" className="brand" aria-label="Only Way home">
          <span>Only</span>
          <strong>Way</strong>
        </Link>
        <div className="workspace-header-meta">
          <a
            className="profile-pill"
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={profile.avatarUrl}
              alt=""
              width={23}
              height={23}
              unoptimized
            />
            <span>@{profile.username}</span>
          </a>
        </div>
      </header>

      <div className="workspace-shell">
        <aside className="editor-panel" aria-label="Cold email editor">
          <div className="editor-panel-inner">
            <div className="editor-intro">
              <h1>
                Edit the facts.
                <br />
                Own the story.
              </h1>
            </div>

            <details className="form-section identity-section" open>
              <summary>
                <span>
                  <span className="section-number">01</span>
                  Identity & target
                </span>
              </summary>
              <div className="form-section-body">
                <div className="field full">
                  <label htmlFor="fullName">Full name</label>
                  <input id="fullName" {...bindInput("fullName")} />
                </div>
                <div className="field full">
                  <label htmlFor="targetCompany">Target company</label>
                  <input
                    id="targetCompany"
                    placeholder="Cursor"
                    value={draft.targetCompany}
                    onChange={(event) =>
                      updateTargetCompany(event.target.value)
                    }
                  />
                </div>
              </div>
            </details>

            <details className="form-section cold-email-section" open>
              <summary>
                <span>
                  <span className="section-number">02</span>
                  Cold email
                </span>
              </summary>
              <div className="form-section-body">
                <div className="field full">
                  <label htmlFor="emailSubject">Subject</label>
                  <input
                    id="emailSubject"
                    placeholder="Internship"
                    {...bindInput("emailSubject")}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="emailBody">Message</label>
                  <textarea
                    id="emailBody"
                    rows={12}
                    placeholder={buildColdEmailBody(
                      draft.fullName,
                      draft.targetCompany || "Cursor",
                    )}
                    {...bindInput("emailBody")}
                  />
                </div>
              </div>
            </details>

            <div className="editor-actions">
              <button
                type="button"
                className="primary-button"
                onClick={downloadEmail}
                disabled={!rendered}
              >
                Download email
              </button>
            </div>
          </div>
        </aside>

        <section className="preview-panel" aria-label="Rendered email preview">
          <div className="preview-toolbar">
            <span className="preview-label">Email preview</span>
            <div className="preview-actions">
              <button
                type="button"
                className="icon-button"
                onClick={copyEmail}
                disabled={!rendered}
              >
                Copy text
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={downloadEmail}
                disabled={!rendered}
              >
                HTML ↓
              </button>
            </div>
          </div>

          {renderError ? <p className="notice">{renderError}</p> : null}

          <div className="preview-frame-wrap">
            {rendered?.emailHtml ? (
              <iframe
                className="preview-frame"
                title="Email preview"
                srcDoc={rendered.emailHtml}
                sandbox=""
              />
            ) : (
              <div className="preview-loading">
                <div className="loading-card">
                  <h1>Rendering with Elements…</h1>
                  <div className="loading-bar" aria-hidden="true" />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
