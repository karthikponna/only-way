import { UsernameForm } from "@/components/username-form";

export default function Home() {
  return (
    <main className="landing-page">
      <div className="landing-noise" aria-hidden="true" />
      <p className="landing-title">
        <span>Only</span>
        <strong>Way</strong>
      </p>
      <section className="hero-card" aria-labelledby="hero-title">
        <div className="hero-eyebrow">
          <span className="status-dot" />
          Built with Unlayer Elements
        </div>

        <div className="hero-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" role="img">
            <path d="M20 14v24a10 10 0 0 0 10 10h14" />
            <circle cx="20" cy="12" r="5" />
            <circle cx="44" cy="48" r="5" />
            <path d="M20 27h17" />
            <circle cx="42" cy="27" r="5" />
          </svg>
        </div>

        <h1 id="hero-title">
          Turn your <span>GitHub</span>
          <br />
          into a cold email.
        </h1>
        <p className="hero-copy">
          One username. One editable cold email, ready to personalize, copy,
          and export.
        </p>

        <UsernameForm />
      </section>
      <p className="landing-footer">
        Your GitHub data is fetched and never stored.
      </p>
    </main>
  );
}
