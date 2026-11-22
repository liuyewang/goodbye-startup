"use client";
import {
  useCallback,
  useRef,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { z } from "zod";
import { useI18n } from "../../i18n";
import { getVerdict } from "../../domain/simulation/engine";
import { SetupSchema } from "../../domain/simulation/schema";
import {
  api,
  deviceTimeZone,
  sessionPath,
  fitTurnHistory,
  ApiError,
  BootstrapSchema,
  RunSchema,
  TurnResultSchema,
  type Bootstrap,
  type Run,
} from "./api";
import {
  downloadRecord,
  downloadText,
  loadTranscript,
  readLegacy,
  readLastRun,
  mergeTranscripts,
  saveTranscript,
  type Transcript,
} from "./persistence";
import { simulatorCopy } from "./copy";
import Dashboard from "./Dashboard";
import Review from "./Review";
import History from "./History";
import { simulationFormat } from "./format";
import { reviewCopy } from "./reviewCopy";

const inputClass =
  "mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-dark-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";
const buttonClass =
  "rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-wait disabled:opacity-50";
const secondaryClass =
  "rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm font-medium text-dark-700 hover:bg-dark-50 disabled:opacity-50";
const draftKey = (runId: string) => `gs_decision_draft_${runId}`;
type ReplacementRequest = {
  setup: z.infer<typeof SetupSchema>;
  timeZone: string;
  replaceRunId: string;
  creationRequestId: string;
};
const confirmedTurnFailures = new Set([
  "FREE_LIMIT",
  "INVALID_INPUT",
  "INVALID_JSON",
  "BODY_TOO_LARGE",
  "RUN_NOT_FOUND",
  "RUN_EXPIRED",
  "ATTEMPTS_EXHAUSTED",
  "DAILY_LIMIT",
  "RUN_COMPLETED",
  "VERSION_CONFLICT",
  "REQUEST_FAILED",
  "REQUEST_EXPIRED",
  "STALE_REQUEST",
  "AI_TIMEOUT",
  "AI_INVALID_RESPONSE",
  "AI_UNAVAILABLE",
]);
/** Coordinates server authority and browser-only narrative with explicit recovery states. */
export default function Simulator(): React.JSX.Element {
  const { language } = useI18n();
  const c = simulatorCopy[language];
  const { money, percent } = simulationFormat[language];
  const [bootstrap, setBootstrap] = useState<Bootstrap | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [record, setRecord] = useState<Transcript | null>(null);
  const recordRef = useRef<Transcript | null>(null);
  const [idea, setIdea] = useState("");
  const ideaRunId = useRef<string | null>(null);
  const [cash, setCash] = useState("10000");
  const [cost, setCost] = useState("1500");
  const [team, setTeam] = useState("1");
  const [employment, setEmployment] = useState<"part-time" | "full-time">(
    "part-time",
  );
  const [decision, setDecision] = useState("");
  const draftRef = useRef<{ runId: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const [legacy, setLegacy] = useState<string | null>(null);
  const [damagedSaves, setDamagedSaves] = useState<string[]>([]);
  const [showQuota, setShowQuota] = useState(false);
  const [replacement, setReplacement] = useState<{
    runId: string;
    requestId: string;
  } | null>(null);
  const [pendingReplacement, setPendingReplacement] =
    useState<ReplacementRequest | null>(null);
  const setupIdeaRef = useRef<HTMLTextAreaElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  function storeDraft(runId: string, text: string): void {
    draftRef.current = { runId, text };
    setDecision(text);
    try {
      if (text) sessionStorage.setItem(draftKey(runId), text);
      else sessionStorage.removeItem(draftKey(runId));
    } catch {
      setStorageWarning(true);
    }
  }
  function applyRecord(data: Transcript | null): void {
    recordRef.current = data;
    setRecord(data);
  }
  function persist(data: Transcript, clearedRequestId?: string): void {
    let merged = mergeTranscripts(recordRef.current, data, clearedRequestId);
    try {
      const saved = loadTranscript(data.runId, localStorage);
      setDamagedSaves(saved.recovery);
      merged = mergeTranscripts(saved.data, merged, clearedRequestId);
      if (!saveTranscript(merged, localStorage, clearedRequestId))
        setStorageWarning(true);
    } catch {
      setStorageWarning(true);
    }
    applyRecord(merged);
  }
  function exportCurrent(): void {
    let current = recordRef.current;
    try {
      if (current)
        current = mergeTranscripts(
          loadTranscript(current.runId, localStorage).data,
          current,
        );
    } catch {
      /* The in-memory copy remains exportable. */
    }
    downloadRecord(
      {
        record: run && current?.runId !== run.id ? null : current,
        state: run?.state ?? null,
        exportedAt: new Date().toISOString(),
      },
      "goodbye-simulation.json",
    );
  }
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api(sessionPath(), BootstrapSchema);
      setBootstrap(result);
      setRun(result.run);
      setReplacement(null);
      setPendingReplacement(null);
      setShowQuota(false);
      setDeleteTarget((target) => (target === result.run?.id ? target : null));
      const runId = result.run?.id ?? null;
      if (ideaRunId.current && ideaRunId.current !== runId) setIdea("");
      ideaRunId.current = runId;
      try {
        setLegacy(readLegacy(localStorage));
        const id =
          result.run?.id ??
          result.session.runId ??
          readLastRun(localStorage) ??
          recordRef.current?.runId;
        if (id) {
          const saved = loadTranscript(id, localStorage);
          const memory =
            recordRef.current?.runId === id ? recordRef.current : null;
          const recovered = memory
            ? mergeTranscripts(saved.data, memory)
            : saved.data;
          applyRecord(recovered);
          setStorageWarning(saved.warning);
          setDamagedSaves(saved.recovery);
          if (runId && recovered?.idea) setIdea(recovered.idea);
        } else setDamagedSaves([]);
        setDecision(
          !runId
            ? ""
            : draftRef.current?.runId === runId
              ? draftRef.current.text
              : (sessionStorage.getItem(draftKey(runId)) ?? "").slice(0, 2000),
        );
      } catch {
        setStorageWarning(true);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.code : "NETWORK");
      // Server availability should not prevent exporting this browser's text.
      try {
        setLegacy(readLegacy(localStorage));
        const id =
          ideaRunId.current ??
          recordRef.current?.runId ??
          readLastRun(localStorage);
        if (id) {
          const saved = loadTranscript(id, localStorage);
          const memory = recordRef.current;
          applyRecord(
            memory ? mergeTranscripts(saved.data, memory) : saved.data,
          );
          setDamagedSaves(saved.recovery);
          setStorageWarning(saved.warning);
        }
      } catch {
        setStorageWarning(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const eligibleAt = bootstrap?.session.eligibleAt ?? null;
  useEffect(() => {
    if (busy || loading) return;
    let cancelled = false;
    const checkEligibility = async () => {
      try {
        const result = await api(sessionPath(), BootstrapSchema);
        if (!cancelled) setBootstrap(result);
      } catch {
        // Keep the current record; the explicit refresh control can retry.
      }
    };
    const timer =
      eligibleAt === null
        ? undefined
        : window.setTimeout(
            () => void checkEligibility(),
            Math.max(1000, Math.min(2147483647, eligibleAt - Date.now() + 250)),
          );
    const onVisible = () => {
      if (document.visibilityState === "visible") void checkEligibility();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [eligibleAt, busy, loading]);
  async function submit(
    target: Run,
    text: string,
    prior: Transcript | null = record,
    retry?: NonNullable<Transcript["pending"]>,
  ): Promise<void> {
    if (busy || (prior?.runId === target.id && prior.pending && !retry)) return;
    if (
      !idea.trim() ||
      !text.trim() ||
      idea.length > 2000 ||
      text.length > 2000
    ) {
      setError("INVALID_INPUT");
      return;
    }
    let base: Transcript =
      prior?.runId === target.id
        ? prior
        : {
            schemaVersion: 1,
            runId: target.id,
            idea,
            turns: [],
            pending: null,
          };
    ideaRunId.current = target.id;
    if (!retry) {
      try {
        const saved = loadTranscript(target.id, localStorage);
        base = mergeTranscripts(saved.data, base);
        if (saved.warning) setStorageWarning(true);
        if (base.pending && saved.data?.idea) {
          base = { ...base, idea: saved.data.idea };
          setIdea(base.idea);
        }
      } catch {
        setStorageWarning(true);
      }
      if (base.pending) {
        applyRecord(base);
        return;
      }
    }
    setBusy(true);
    setError(null);
    const pending = retry ?? {
      requestId: crypto.randomUUID(),
      expectedVersion: target.state.version,
      decision: text,
    };
    const next = { ...base, idea, pending };
    if (!retry) {
      persist(next);
      storeDraft(target.id, "");
    }
    const history = base.turns.flatMap((turn) => [
      { role: "user" as const, content: turn.decision },
      ...(turn.proposal
        ? [{ role: "assistant" as const, content: turn.proposal.scenario }]
        : []),
    ]);
    try {
      const result = await api(
        `/api/simulations/${target.id}/turn`,
        TurnResultSchema,
        "POST",
        fitTurnHistory({ ...pending, idea, language, history }),
        65_000, // Allow the 60-second server lease and network overhead.
      );
      const version = pending.expectedVersion + 1;
      // Replay can return a newer run; the decision belongs to its original stage.
      const stage = result.run.state.history[pending.expectedVersion];
      if (
        result.run.id !== target.id ||
        !stage ||
        result.run.state.version < version ||
        (!result.replayed && result.run.state.version !== version)
      )
        throw new ApiError("NETWORK");
      setRun(result.run);
      persist(
        {
          ...next,
          pending: null,
          turns: [
            ...base.turns.filter((turn) => turn.version !== version),
            {
              version,
              day: stage.day,
              decision: pending.decision,
              proposal:
                result.proposal ??
                base.turns.find((turn) => turn.version === version)?.proposal ??
                null,
            },
          ].slice(-6),
        },
        pending.requestId,
      );
      setBootstrap((prev) =>
        prev ? { ...prev, session: { ...prev.session, used: true } } : prev,
      );
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "NETWORK";
      setError(code);
      // Only a definite outcome clears an ID. A preflight rejection of a retry
      // does not tell us whether the original attempt committed.
      const confirmed =
        confirmedTurnFailures.has(code) ||
        (!retry &&
          ["RATE_LIMIT", "SESSION_REQUIRED", "FORBIDDEN_ORIGIN"].includes(
            code,
          ));
      if (confirmed) {
        persist({ ...next, pending: null }, pending.requestId);
        if (!retry || !decision) storeDraft(target.id, pending.decision);
      }
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (replacement) setupIdeaRef.current?.focus();
  }, [replacement]);
  async function startAnother(): Promise<void> {
    if (busy || loading || !run) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api(sessionPath(), BootstrapSchema);
      setBootstrap(result);
      setShowQuota(true);
      if (result.session.used || result.session.eligibleAt !== null) return;
      if (
        result.run?.id !== run.id ||
        result.run.state.status !== "completed"
      ) {
        await refresh();
        return;
      }
      setReplacement({ runId: run.id, requestId: crypto.randomUUID() });
      setRun(null);
      setIdea("");
      setDecision("");
      setShowQuota(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.code : "NETWORK");
    } finally {
      setBusy(false);
    }
  }
  async function begin(event?: FormEvent): Promise<void> {
    event?.preventDefault();
    if (busy) return;
    setError(null);
    const parsed = SetupSchema.safeParse({
      cashCents: Math.round(Number(cash) * 100),
      monthlyCostCents: Math.round(Number(cost) * 100),
      teamSize: Number(team),
      employment,
    });
    if (!parsed.success || !idea.trim() || idea.length > 2000) {
      setError("INVALID_INPUT");
      return;
    }
    const setup = { setup: parsed.data, timeZone: deviceTimeZone() };
    const retryable =
      pendingReplacement ??
      (replacement && {
        ...setup,
        replaceRunId: replacement.runId,
        creationRequestId: replacement.requestId,
      });
    setBusy(true);
    let created: Run;
    try {
      created = (
        await api(
          "/api/simulations",
          z.object({ run: RunSchema }),
          "POST",
          retryable ?? setup,
        )
      ).run;
      setRun(created);
      setReplacement(null);
      setPendingReplacement(null);
      ideaRunId.current = created.id;
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "NETWORK";
      if (
        retryable &&
        (pendingReplacement ||
          ["NETWORK", "CLIENT_TIMEOUT", "SERVICE_UNAVAILABLE"].includes(code))
      ) {
        setPendingReplacement(code === "VERSION_CONFLICT" ? null : retryable);
      }
      setError(code);
      setBusy(false);
      return;
    }
    setBusy(false);
    if (created.state.version > 0) {
      await refresh();
      return;
    }
    const initial: Transcript = {
      schemaVersion: 1,
      runId: created.id,
      idea,
      turns: [],
      pending: null,
    };
    // Pass the created run directly; React's next render has not happened yet.
    await submit(created, c.startDecision, initial);
  }
  async function remove(): Promise<void> {
    if (!run || loading || busy || run.id !== deleteTarget) return;
    setBusy(true);
    try {
      await api(
        `/api/simulations/${run.id}`,
        z.object({ deleted: z.boolean() }),
        "DELETE",
      );
      setRun(null);
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.code : "NETWORK");
    } finally {
      setBusy(false);
    }
  }
  const activeRecord = run && record?.runId === run.id ? record : null;
  const latestTurn = activeRecord?.turns.at(-1);
  const latest =
    latestTurn &&
    latestTurn.version === run?.state.version &&
    latestTurn.day === run.state.day
      ? latestTurn.proposal
      : null;
  const missing = !!run && run.state.version > 0 && !latest;
  const blocked =
    !!bootstrap &&
    (bootstrap.session.used || bootstrap.session.eligibleAt !== null);
  const nextAvailable =
    eligibleAt === null
      ? null
      : new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: bootstrap?.session.timeZone ?? deviceTimeZone(),
        }).format(eligibleAt);
  const terminal = run?.state.status === "completed";
  const pendingDecision = activeRecord?.pending;
  const verdict = run ? getVerdict(run.state) : null;
  const errorText = error
    ? Object.hasOwn(c.errors, error)
      ? c.errors[error as keyof typeof c.errors]
      : c.errors.SERVICE_UNAVAILABLE
    : null;
  return (
    <div className="mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-600">
          Goodbye Startup
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-5xl">
          {c.title}
        </h1>
        <p className="mt-4 leading-relaxed text-dark-500">{c.subtitle}</p>
      </header>
      {bootstrap?.mode === "mock" && (
        <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {c.mock}
        </p>
      )}
      {legacy && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-dark-200 p-3 text-sm">
          <p>{c.legacy}</p>
          <button
            className={secondaryClass}
            onClick={() => downloadText(legacy, "goodbye-legacy-save.txt")}
          >
            {c.legacyExport}
          </button>
        </div>
      )}
      {storageWarning && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-900"
        >
          {c.storage}
        </p>
      )}
      {damagedSaves.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {damagedSaves.map((raw, index) => (
            <button
              key={index}
              type="button"
              className={secondaryClass + " min-h-11"}
              onClick={() =>
                downloadText(raw, `goodbye-damaged-save-${index + 1}.txt`)
              }
            >
              {c.recoveryExport}
              {damagedSaves.length > 1 ? ` ${index + 1}` : ""}
            </button>
          ))}
        </div>
      )}
      {errorText && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          <p>{errorText}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={secondaryClass}
              disabled={busy}
              onClick={() => void (pendingReplacement ? begin() : refresh())}
            >
              {pendingReplacement ? c.retrySetup : c.refresh}
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <p role="status" className="py-10 text-dark-500">
          {c.loading}
        </p>
      ) : (
        <>
          {!run && bootstrap?.session.expired && (
            <p className="mb-5 rounded-xl bg-amber-50 p-4">{c.expired}</p>
          )}
          {!run && blocked ? (
            <div className="rounded-2xl border border-dark-200 p-6">
              <h2 className="font-semibold">
                {bootstrap?.session.attempts === 10 && !bootstrap.session.used
                  ? c.errors.ATTEMPTS_EXHAUSTED
                  : c.used}
              </h2>
              <p className="mt-2 text-dark-500">{c.paid}</p>
              {nextAvailable && (
                <p className="mt-2 text-sm">
                  {c.nextAvailable} {nextAvailable} (
                  {bootstrap?.session.timeZone ?? deviceTimeZone()})
                </p>
              )}
              <button
                type="button"
                className={`${secondaryClass} mt-4 min-h-12`}
                onClick={() => void refresh()}
              >
                {c.refresh}
              </button>
            </div>
          ) : (
            !run && (
              <form
                onSubmit={begin}
                className="space-y-5 rounded-2xl border border-dark-200 bg-white p-5 shadow-sm sm:p-8"
              >
                <label className="block font-medium">
                  {c.idea}
                  <textarea
                    ref={setupIdeaRef}
                    className={inputClass}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    required
                    disabled={busy || !!pendingReplacement}
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    [c.cash, cash, setCash, "1", "10000000"],
                    [c.cost, cost, setCost, "0", "1000000"],
                    [c.team, team, setTeam, "1", "50"],
                  ].map(([label, value, set, min, max]) => (
                    <label
                      className="block text-sm font-medium"
                      key={label as string}
                    >
                      {label as string}
                      <input
                        className={inputClass}
                        type="number"
                        min={min as string}
                        max={max as string}
                        step={label === c.team ? "1" : "0.01"}
                        value={value as string}
                        onChange={(e) =>
                          (set as (v: string) => void)(e.target.value)
                        }
                        required
                        disabled={busy || !!pendingReplacement}
                      />
                    </label>
                  ))}
                  <label className="block text-sm font-medium">
                    {c.employment}
                    <select
                      className={inputClass}
                      value={employment}
                      onChange={(e) =>
                        setEmployment(
                          e.target.value === "full-time"
                            ? "full-time"
                            : "part-time",
                        )
                      }
                      disabled={busy || !!pendingReplacement}
                    >
                      <option value="part-time">{c.part}</option>
                      <option value="full-time">{c.full}</option>
                    </select>
                  </label>
                </div>
                <p className="text-sm leading-relaxed text-dark-500">
                  {c.free}
                </p>
                {replacement && (
                  <p className="text-sm text-dark-600">{c.replaceNote}</p>
                )}
                <button
                  className={buttonClass}
                  disabled={busy || bootstrap?.ready === false}
                >
                  {busy ? c.busy : c.begin}
                </button>
                {replacement && (
                  <button
                    type="button"
                    className={`${secondaryClass} ml-3 min-h-12`}
                    disabled={busy}
                    onClick={() => void refresh()}
                  >
                    {c.returnToSave}
                  </button>
                )}
                {bootstrap?.ready === false && (
                  <p role="status" className="text-sm text-amber-800">
                    {c.errors.SERVICE_UNAVAILABLE}
                  </p>
                )}
              </form>
            )
          )}
          {run && (
            <div className="space-y-6">
              <Dashboard state={run.state} />
              {missing && (
                <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  {c.missing}
                </p>
              )}
              {latest && !terminal && (
                <details
                  open
                  className="rounded-2xl border border-dark-200 bg-white p-5 sm:p-7"
                >
                  <summary className="cursor-pointer font-semibold">
                    {reviewCopy[language].context}
                  </summary>
                  <p className="my-3 text-sm text-dark-600">
                    {reviewCopy[language].contextNote}
                  </p>
                  <h2 className="mb-3 text-sm font-semibold text-primary-700">
                    {c.assumptions}
                  </h2>
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {latest.scenario}
                  </p>
                  <ul className="mt-4 space-y-2 text-dark-600">
                    {latest.insights.map((item, i) => (
                      <li key={i} className="break-words">
                        {item.text}
                      </li>
                    ))}
                  </ul>
                  <details className="mt-5 text-sm text-dark-500">
                    <summary className="cursor-pointer font-medium">
                      {c.assumptionsLabel}
                    </summary>
                    <dl className="mt-3 grid grid-cols-2 gap-3">
                      {[
                        [c.visits, latest.visits],
                        [c.signup, percent(latest.signupRate)],
                        [c.paidRate, percent(latest.paidRate)],
                        [c.churn, percent(latest.monthlyChurn)],
                        [c.price, money(latest.priceCents)],
                        [c.costLabel, money(latest.monthlyCostCents)],
                        [c.oneTime, money(latest.oneTimeCostCents)],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd className="break-words font-medium text-dark-800">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </details>
              )}
              {pendingDecision && (
                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-dark-900">
                  <p className="font-semibold">{c.originalDecision}</p>
                  <p className="my-2 whitespace-pre-wrap break-words">
                    {pendingDecision.decision}
                  </p>
                  <p id="pending-decision-help">{c.pending}</p>
                  <button
                    type="button"
                    className={secondaryClass + " mt-3 min-h-12"}
                    aria-describedby="pending-decision-help"
                    disabled={busy}
                    onClick={() =>
                      void submit(
                        run,
                        pendingDecision.decision,
                        activeRecord,
                        pendingDecision,
                      )
                    }
                  >
                    {c.retryOriginal}
                  </button>
                </div>
              )}
              {terminal ? (
                <>
                  <section className="rounded-2xl bg-dark-900 p-6 text-white">
                    <h2 className="text-xl font-bold">{c.complete}</h2>
                    <p className="mt-3 text-lg">{verdict ? c[verdict] : ""}</p>
                    <p className="mt-3 text-sm text-dark-300">
                      {c.verdictNote}
                    </p>
                    <button
                      onClick={() => void startAnother()}
                      disabled={busy || loading}
                      className="mt-5 rounded-lg bg-white px-4 py-2 font-semibold text-dark-900"
                    >
                      {c.another}
                    </button>
                    {showQuota && (
                      <div className="mt-4">
                        <p>{c.used}</p>
                        {nextAvailable && (
                          <p className="mt-2 text-sm">
                            {c.nextAvailable} {nextAvailable} (
                            {bootstrap?.session.timeZone ?? deviceTimeZone()})
                          </p>
                        )}
                        <p className="mt-2 text-sm text-dark-300">{c.paid}</p>
                      </div>
                    )}
                  </section>
                  {decision && (
                    <section className="rounded-xl border border-dark-200 p-4">
                      <h2 className="font-semibold">{c.draft}</h2>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                        {decision}
                      </p>
                    </section>
                  )}
                  <Review key={run.id} state={run.state} />
                </>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit(run, decision);
                  }}
                  className="rounded-2xl border border-dark-200 p-5 sm:p-7"
                >
                  {!activeRecord?.idea && (
                    <label className="mb-4 block text-sm font-medium">
                      {c.restoreIdea}
                      <textarea
                        aria-label={c.idea}
                        className={inputClass}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        maxLength={2000}
                        required
                      />
                    </label>
                  )}
                  {latest && (
                    <div className="mb-5 grid gap-2 sm:grid-cols-3">
                      {latest.choices.map((choice, index) => (
                        <button
                          type="button"
                          key={index}
                          className={secondaryClass + " text-left"}
                          disabled={busy || !!pendingDecision}
                          onClick={() => void submit(run, choice)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="block text-sm font-semibold">
                    {pendingDecision ? c.draft : c.decision}
                    <textarea
                      className={inputClass}
                      name="decision"
                      aria-describedby={
                        pendingDecision ? "pending-decision-help" : undefined
                      }
                      value={decision}
                      onChange={(e) => storeDraft(run.id, e.target.value)}
                      rows={3}
                      maxLength={2000}
                      required
                      disabled={busy}
                      onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing) return;
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          if (!pendingDecision)
                            e.currentTarget.form?.requestSubmit();
                        }
                      }}
                    />
                  </label>
                  <button
                    type="submit"
                    className={buttonClass + " mt-4"}
                    disabled={busy || !!pendingDecision || !decision.trim()}
                  >
                    {busy ? c.busy : c.send}
                  </button>
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-2 text-sm text-dark-500"
                  >
                    {busy ? c.busy : ""}
                  </p>
                </form>
              )}
              <History state={run.state} record={activeRecord} />
            </div>
          )}
        </>
      )}
      {(record || run) && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button className={secondaryClass} onClick={exportCurrent}>
            {c.export}
          </button>
          {run && (
            <button
              className={secondaryClass}
              disabled={busy || loading}
              onClick={() => setDeleteTarget(run.id)}
            >
              {c.delete}
            </button>
          )}
        </div>
      )}
      {run && !loading && deleteTarget === run.id && (
        <div className="mt-4 rounded-xl border border-red-200 p-4">
          <p>{c.deleteConfirm}</p>
          <div className="mt-3 flex gap-3">
            <button
              className={secondaryClass}
              onClick={() => setDeleteTarget(null)}
            >
              {c.cancel}
            </button>
            <button
              className={secondaryClass}
              disabled={busy}
              onClick={() => void remove()}
            >
              {c.confirm}
            </button>
          </div>
        </div>
      )}
      <p className="mt-7 text-xs leading-relaxed text-dark-500">{c.privacy}</p>
      <section className="mt-12 border-t border-dark-200 pt-8">
        <h2 className="text-xl font-semibold">{c.guide}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-dark-500">
          {c.guideText}
        </p>
      </section>
    </div>
  );
}
