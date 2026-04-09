import { useMemo, useState, type ReactNode } from 'react'

type View =
  | 'active'
  | 'banner80'
  | 'banner95'
  | 'claimBlocked'
  | 'frozen'
  | 'returnVisit'

const SCENARIOS: { id: View; label: string }[] = [
  { id: 'active', label: 'Timer running' },
  { id: 'banner80', label: 'Reminder · time low' },
  { id: 'banner95', label: 'Reminder · wrap up' },
  { id: 'claimBlocked', label: 'No new tasks' },
  { id: 'frozen', label: 'Timer stopped' },
  { id: 'returnVisit', label: 'Return visit' },
]

const PAST_SESSIONS = [
  { date: 'Nov 19, 2025', total: '$30.50' },
  { date: 'Nov 10, 2025', total: '$25.50' },
  { date: 'Oct 5, 2025', total: '$28.50' },
  { date: 'Sep 19, 2025', total: '$17.50' },
  { date: 'Aug 20, 2025', total: '$12.00' },
]

function formatClock(parts: [string, string, string]) {
  return `${parts[0]} : ${parts[1]} : ${parts[2]}`
}

export default function App() {
  const [view, setView] = useState<View>('active')
  const [toastOpen, setToastOpen] = useState(false)

  const timerParts = useMemo(() => {
    if (view === 'claimBlocked') return ['00', '00', '00'] as const
    if (view === 'frozen' || view === 'returnVisit') return ['01', '14', '02'] as const
    return ['01', '14', '02'] as const
  }, [view])

  const running = view === 'active' || view === 'banner80' || view === 'banner95'
  const frozen = view === 'frozen' || view === 'returnVisit'
  const idle = !running && !frozen
  const claimBlocked = view === 'claimBlocked' || view === 'returnVisit'
  const show80 = view === 'banner80'
  const show95 = view === 'banner95'

  return (
    <div className="relative min-h-full overflow-x-hidden bg-[#fbfbfb]">
      <OutlierBackground />

      <div className="relative z-10">
        <TopNavigation />

        <div className="mx-auto max-w-[1280px] px-6 pb-16 pt-6 md:px-[130px]">
          <DesignContextFromThread />

          <PreviewScenarioControls
            view={view}
            onChange={setView}
            onToast={() => {
              setToastOpen(true)
              window.setTimeout(() => setToastOpen(false), 4000)
            }}
          />

          <BackButton />

          <header className="mt-10 flex max-w-[1022px] flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-[35px] font-semibold leading-[1.14] tracking-[-0.011em] text-black">
                Timesheet for Aether
              </h1>
              <p className="max-w-[1022px] text-base font-normal leading-normal text-[#636363]">
                To track your hours, start the timer when you begin tasking and pause it whenever you
                take a break. For accurate time tracking and payment, keep your browser open while the
                timer is running.{' '}
                <span className="font-medium text-[#1f1f1f]">
                  This project has a <strong className="font-semibold">daily hour limit</strong> shared by
                  everyone working today—your time counts toward that pool so we stay within what the
                  customer expects, not only a personal cap.
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <OutlinePill>Project Guideline</OutlinePill>
              <OutlinePill>Pay Terms</OutlinePill>
            </div>
          </header>

          <div className="mt-10 flex max-w-[1022px] flex-col gap-10">
            {show80 && <StatusBanner variant="info" />}
            {show95 && <StatusBanner variant="urgent" />}
            {claimBlocked && (
              <Callout>
                Today’s limit for this project has been reached, so new tasks aren’t available to claim.
                If you were already in a session, you can still finish and submit—you’ll be paid for time
                recorded up to when your timer stopped.
              </Callout>
            )}
            {view === 'returnVisit' && (
              <p className="text-base leading-normal text-[#636363]">
                Welcome back. We’ve hit today’s project limit, so new tasks aren’t open—but your in-progress
                work is still here, your timer has stopped, and you can submit to get paid for time up to
                the freeze.
              </p>
            )}

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold leading-normal tracking-[-0.02em] text-[#636363]">
                Your Current Session
              </h2>

              <div className="flex flex-col items-center gap-8 rounded-2xl border border-[#d9d9d9] bg-white px-8 py-10 md:px-16">
                <div className="flex w-full flex-col items-center gap-3">
                  <p className="text-sm font-normal text-[#636363]">Task Rate: $20.00/hr</p>
                  <p
                    className={`text-center font-semibold tracking-[-0.02em] text-[#1f1f1f] ${
                      frozen || idle ? 'text-[#636363]' : ''
                    }`}
                    style={{
                      fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                      lineHeight: 1.21,
                    }}
                  >
                    {formatClock([...timerParts])}
                  </p>
                  {frozen && (
                    <p className="max-w-[458px] text-center text-sm leading-relaxed text-[#636363]">
                      This project’s daily limit has been reached, so your timer has stopped. You can still
                      submit—you’ll see paid time in Outlier for everything recorded up to the freeze.
                    </p>
                  )}
                </div>

                <div className="flex w-full max-w-[458px] flex-col gap-2">
                  <span className="text-sm font-normal text-[#636363]">Session Title</span>
                  <div className="min-h-12 rounded-md border border-[#cecece] bg-white/90 px-3 py-3 text-base text-[#1f1f1f]">
                    Tasking 2 MM
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  {running && (
                    <div className="flex flex-wrap justify-center gap-4">
                      <OrangePillButton>Pause</OrangePillButton>
                      <OutlinePillButton>Submit task</OutlinePillButton>
                    </div>
                  )}
                  {frozen && (
                    <div className="flex flex-wrap justify-center gap-4">
                      <button
                        type="button"
                        disabled
                        className="h-10 cursor-not-allowed rounded-full border border-black/10 bg-[#ececec] px-4 text-lg font-semibold text-[#636363]"
                      >
                        Pause
                      </button>
                      <OrangePillButton>Submit task</OrangePillButton>
                    </div>
                  )}
                  {(idle || (claimBlocked && !frozen)) && (
                    <OrangePillButton disabled={claimBlocked}>
                      Start Timer &amp; Go to Multimango
                    </OrangePillButton>
                  )}
                  {frozen && (
                    <p className="text-center text-xs text-[#636363]">
                      Submit to finalize; pay matches your timesheet up to when the timer froze.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#636363]">
                Your Past Sessions
              </h2>

              <div
                className="flex h-[60px] items-center rounded-[49px] bg-white px-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                style={{ maxWidth: 377 }}
              >
                <IconSearch className="mr-[18px] h-[22px] w-[22px] shrink-0 text-[#828282]" />
                <span className="text-lg font-medium text-[#828282]">Search</span>
              </div>

              <div className="max-w-[894px] rounded-2xl border border-[#d9d9d9] bg-white px-8 pb-10 pt-6 md:px-16">
                <ul className="divide-y divide-[#d9d9d9]">
                  {PAST_SESSIONS.map((row) => (
                    <li
                      key={row.date}
                      className="flex items-center gap-2 py-4 first:pt-0"
                    >
                      <span className="text-xl text-[#ff5c00]" aria-hidden>
                        ⌄
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xl font-semibold text-[#1f1f1f]">{row.date}</p>
                      </div>
                      <p className="text-base text-[#1f1f1f]">Total: {row.total}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-center gap-2 text-base text-[#1f1f1f]">
                  <IconButtonChevron dir="left" muted />
                  <span>1 of 5</span>
                  <IconButtonChevron dir="right" />
                </div>
              </div>
            </section>
          </div>
        </div>

        <SiteFooter />
      </div>

      {toastOpen && <SampleToast onClose={() => setToastOpen(false)} />}
    </div>
  )
}

function OutlierBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute -right-32 -top-40 h-[380px] w-[380px] rounded-full opacity-70 blur-[120px]"
        style={{ background: 'var(--blur-cyan)' }}
      />
      <div
        className="absolute -left-40 top-20 h-[420px] w-[500px] rounded-full opacity-80 blur-[100px]"
        style={{ background: 'var(--blur-pink)' }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[742px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, rgba(251, 251, 251, 1) 100%)',
        }}
      />
    </div>
  )
}

function TopNavigation() {
  return (
    <header className="flex h-16 items-center gap-6 border-b border-black/5 bg-white/80 px-6 backdrop-blur-sm md:px-6">
      <div className="flex h-5 w-[75px] shrink-0 items-center">
        <span className="text-[15px] font-semibold tracking-tight text-black">Outlier</span>
      </div>
      <nav
        className="hidden flex flex-1 flex-wrap items-center justify-center gap-3 text-sm text-[#636363] md:flex"
        aria-label="Breadcrumb"
      >
        <span>Projects</span>
        <span className="text-black/30">/</span>
        <span>Aether</span>
        <span className="text-black/30">/</span>
        <span className="font-medium text-black">Timesheet</span>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#8c8c8c] hover:bg-black/5"
            aria-label="Notifications"
          >
            <IconBell />
          </button>
          <span className="absolute -right-1 -top-1 flex min-w-[22px] items-center justify-center rounded-full bg-[#ffe3d2] px-1.5 py-0.5 text-xs font-medium text-[#c15000]">
            9+
          </span>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-amber-100 text-sm font-semibold text-[#1f1f1f]"
          aria-hidden
        >
          CL
        </div>
      </div>
    </header>
  )
}

function DesignContextFromThread() {
  return (
    <details className="mb-6 max-w-[1022px] rounded-xl border border-[#d9d9d9] bg-white/95 px-5 py-4 shadow-sm open:shadow-md">
      <summary className="cursor-pointer list-none text-sm font-semibold text-[#1f1f1f] [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block text-[#f7803c]">●</span>
        Design context — Hubstaff / daily cap (ops, PRD, Mick · Calvin Apr 9)
      </summary>
      <div className="mt-4 space-y-4 border-t border-[#ececec] pt-4 text-sm leading-relaxed text-[#636363]">
        <p>
          <strong className="text-[#1f1f1f]">Problem.</strong> Hour volume on the in-system (Outlier)
          timer grew faster than we could mirror Hubstaff-style daily controls at the{' '}
          <em>project</em> level. That created friction for generalist workflows that rely on a daily
          cap, contributor sentiment (&quot;no cap in Outlier&quot;), and customer risk when total
          delivered hours drift from contracted bands—ops needs predictable totals, not only
          per-person limits.
        </p>
        <p>
          <strong className="text-[#1f1f1f]">Product response.</strong> This pattern implements a{' '}
          <strong className="font-semibold text-[#1f1f1f]">shared daily project limit</strong>: everyone’s
          time rolls up to one cap. Staged warnings (~early / ~late), then at full capacity timers freeze
          and pay reflects earned time in Outlier—aligned with PM direction to be{' '}
          <em>straightforward</em> (&quot;this project has a limit&quot;) while keeping exact contract
          numbers internal; legal/STO can refine wording.
        </p>
        <p>
          <strong className="text-[#1f1f1f]">Ops coordination (from thread).</strong> Teams reduced new
          experiment enrollment until limit config shipped, split headroom between Hubstaff and
          in-system tracking, and routed special cohorts (e.g. separate Hubstaff projects / verticals)
          where workflows require different tracking—without blocking the long-term goal of a single
          in-system global daily cap.
        </p>
        <p className="rounded-lg bg-[#f8f8f8] px-3 py-2 text-xs text-[#636363]">
          Internal-only note for reviewers: this prototype is aligned with the &quot;global shared
          project time budget&quot; MVP and the Outlier timer × daily limit discussion—use it for
          copy, layout, and stakeholder review; it is not end-user documentation.
        </p>
      </div>
    </details>
  )
}

function PreviewScenarioControls({
  view,
  onChange,
  onToast,
}: {
  view: View
  onChange: (v: View) => void
  onToast: () => void
}) {
  return (
    <div className="mb-6 flex max-w-[1022px] flex-col gap-3 rounded-lg border border-dashed border-black/15 bg-white/60 p-4 text-sm backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[#636363]">
        Preview only — pick a state
      </p>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              view === s.id
                ? 'bg-black text-white'
                : 'bg-black/5 text-[#1f1f1f] hover:bg-black/10'
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onToast}
          className="rounded-full border border-[#d9d9d9] px-3 py-1.5 text-xs font-medium text-[#636363] hover:bg-black/5"
        >
          Sample toast
        </button>
      </div>
    </div>
  )
}

function BackButton() {
  return (
    <button
      type="button"
      className="mb-8 inline-flex h-8 items-center gap-2 rounded px-3 text-sm font-semibold text-[#f24c00]"
    >
      <span className="text-base" aria-hidden>
        ‹
      </span>
      Back
    </button>
  )
}

function OutlinePill({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center rounded-full border border-[rgba(0,0,0,0.19)] px-4 text-lg font-semibold tracking-[-0.022em] text-[#1f1f1f] hover:bg-black/[0.03]"
    >
      {children}
    </button>
  )
}

function OutlinePillButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center rounded-full border border-[rgba(0,0,0,0.19)] px-4 text-lg font-semibold tracking-[-0.022em] text-[#1f1f1f] hover:bg-black/[0.03]"
    >
      {children}
    </button>
  )
}

function OrangePillButton({
  children,
  disabled,
}: {
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex h-10 min-w-[200px] items-center justify-center rounded-full px-5 text-lg font-semibold tracking-[-0.022em] ${
        disabled
          ? 'cursor-not-allowed bg-[#f5c4a8] text-black/40'
          : 'bg-[#f7803c] text-black hover:brightness-95'
      }`}
    >
      {children}
    </button>
  )
}

function StatusBanner({ variant }: { variant: 'info' | 'urgent' }) {
  const isUrgent = variant === 'urgent'
  return (
    <div
      role="status"
      className={`w-full rounded-lg border-l-4 px-4 py-3 ${
        isUrgent
          ? 'border-amber-500 bg-amber-50 text-[#1f1f1f]'
          : 'border-blue-600 bg-blue-50 text-[#1f1f1f]'
      }`}
    >
      <p className="font-semibold">
        {isUrgent
          ? 'Almost at today’s limit for this project'
          : 'This project’s daily limit is filling up'}
      </p>
      <p className="mt-1 text-sm text-[#636363]">
        {isUrgent
          ? 'We’re very close to the daily cap for this project. Save your work, wrap up your current task if you can, and submit soon—once the limit is hit, timers will stop and you won’t accrue more time until the next cycle.'
          : 'We’re approaching today’s cap for this project (early warning). There’s still time to work, but less headroom than earlier—if you’re in a long session, consider finishing or pausing so you’re not surprised as we get closer to the limit.'}
      </p>
    </div>
  )
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="w-full rounded-lg border-l-4 border-[#c41e1e] bg-[#fff5f5] px-4 py-3 text-sm leading-relaxed text-[#1f1f1f]"
    >
      {children}
    </div>
  )
}

function SiteFooter() {
  const links = [
    ['Terms of Use', 'Community Guidelines'],
    ['Privacy Policy', 'Work Location Policy'],
    ['Cookies Policy', 'Data Processing Addendum'],
  ]
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/90 px-6 py-10 backdrop-blur-sm md:px-12">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <p className="text-xs text-[rgba(0,0,0,0.6)]">
          © 2025 Smart Ecosystems. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          {links.map((pair) => (
            <div key={pair[0]} className="flex flex-col gap-2">
              {pair.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-xs text-[rgba(0,0,0,0.6)] underline-offset-2 hover:underline"
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

function SampleToast({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-lg"
      role="status"
    >
      <div className="flex justify-between gap-3">
        <p className="font-medium">This project’s daily limit is filling up</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-amber-800/80 hover:text-amber-950"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <p className="mt-1 text-xs text-amber-900/90">
        Same reminder we send by email and in your inbox—early heads-up before we reach the daily
        project cap.
      </p>
    </div>
  )
}

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function IconButtonChevron({ dir, muted }: { dir: 'left' | 'right'; muted?: boolean }) {
  const label = dir === 'left' ? 'Previous page' : 'Next page'
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full ${
        muted ? 'text-black/25' : 'text-[#8c8c8c] hover:bg-black/5'
      }`}
    >
      <span className="text-lg">{dir === 'left' ? '‹' : '›'}</span>
    </button>
  )
}
