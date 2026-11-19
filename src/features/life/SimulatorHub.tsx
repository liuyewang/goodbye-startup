"use client";
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n";
import Simulator from "../simulator/Simulator";
import LifeModule from "./LifeModule";
import { lifeCopy } from "./copy";

/** Keep startup inputs mounted while the optional third-party experience is open. */
export default function SimulatorHub(): React.JSX.Element {
  const { language } = useI18n();
  const c = lifeCopy[language];
  const [life, setLife] = useState(false);
  useEffect(() => {
    const sync = (): void => setLife(location.hash === "#silicon-valley");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  function choose(value: boolean): void {
    setLife(value);
    const url = new URL(location.href);
    url.hash = value ? "silicon-valley" : "";
    history.replaceState(
      history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  }
  return (
    <>
      <section
        id="silicon-valley"
        aria-label={c.choose}
        className="mx-auto max-w-5xl scroll-mt-20 px-4 pt-6 sm:px-6"
      >
        <h2 className="mb-3 text-sm font-semibold text-dark-600">{c.choose}</h2>
        <div className="flex flex-wrap gap-3">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={life === value}
              onClick={() => choose(value)}
              className={
                (life === value ? "btn-primary" : "btn-secondary") +
                " min-h-11 px-5 py-3"
              }
            >
              {value ? c.life : c.startup}
            </button>
          ))}
        </div>
      </section>
      <div hidden={life}>
        <Simulator />
      </div>
      {life && <LifeModule />}
    </>
  );
}
