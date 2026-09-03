import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../services/authApi'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      // ห้าม log password
      console.log('Login request', { username })

      const data = await apiLogin({
        username: username.trim(),
        password,
      })

      if (!data) {
        setError('ไม่ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์')
        return
      }

      if (!data.accessToken) {
        setError('เซิร์ฟเวอร์ไม่ได้ส่ง Access Token กลับมา')
        return
      }

      localStorage.setItem('accessToken', data.accessToken)

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      data-theme="light"
      className="relative min-h-screen overflow-hidden bg-base-200"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-secondary/15 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <section className="relative grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* Brand panel */}
        <aside className="hidden flex-col justify-between overflow-hidden bg-neutral px-14 py-12 text-neutral-content lg:flex">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-xl font-black text-primary-content shadow-lg shadow-primary/30">
              N
            </div>

            <div>
              <div className="text-xl font-bold tracking-[0.2em]">NAVA</div>
              <div className="text-xs opacity-55">
                Enterprise Resource Planning
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="badge badge-primary badge-outline mb-6 gap-2 px-4 py-3">
              Business Operating System
            </div>

            <h1 className="text-5xl font-semibold leading-[1.08]">
              One system.
              <br />
              Every operation
              <span className="text-primary"> connected.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 opacity-60">
              เชื่อมโยงบุคลากร เอกสาร กระบวนการ และข้อมูลทางธุรกิจ
              ไว้บนโครงสร้างเดียวกัน
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                ['01', 'Secure'],
                ['02', 'Connected'],
                ['03', 'Traceable'],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="font-mono text-xs text-primary">{number}</div>
                  <div className="mt-5 text-sm font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs opacity-40">
            <span>© {new Date().getFullYear()} NAVA ERP</span>
            <span>System ready</span>
          </div>
        </aside>

        {/* Login panel */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-xl font-black text-primary-content">
                N
              </div>

              <div>
                <div className="font-bold tracking-[0.2em]">NAVA</div>
                <div className="text-xs text-base-content/50">
                  Enterprise Resource Planning
                </div>
              </div>
            </div>

            <div className="card border border-base-300 bg-base-100/90 shadow-2xl shadow-base-content/5 backdrop-blur-xl">
              <div className="card-body p-7 sm:p-9">
                <div className="mb-3">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_0_5px] shadow-success/15" />
                    <span className="text-xs font-medium text-base-content/50">
                      Secure access
                    </span>
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm text-base-content/55">
                    เข้าสู่ระบบเพื่อเริ่มต้นจัดการองค์กรของคุณ
                  </p>
                </div>

                {error && (
                  <div role="alert" className="alert alert-error mt-3 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 shrink-0"
                    >
                      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                      <path
                        d="M12 7.5v5M12 16.5h.01"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>

                    <span>{error}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-5 flex flex-col gap-5"
                >
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Username
                    </legend>

                    <label className="input input-bordered flex w-full items-center gap-3 focus-within:input-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-5 w-5 opacity-40"
                      >
                        <circle cx="12" cy="8" r="3.5" strokeWidth="1.7" />
                        <path
                          d="M5 19c.7-3.7 3-5.5 7-5.5s6.3 1.8 7 5.5"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>

                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        autoComplete="username"
                        autoFocus
                        required
                        disabled={loading}
                        className="grow"
                      />
                    </label>
                  </fieldset>

                  <fieldset className="fieldset">
                    <div className="flex items-center justify-between">
                      <legend className="fieldset-legend">Password</legend>

                      <button
                        type="button"
                        className="link link-hover text-xs text-base-content/50"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <label className="input input-bordered flex w-full items-center gap-3 focus-within:input-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-5 w-5 opacity-40"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M8 10V7.5a4 4 0 0 1 8 0V10"
                          strokeWidth="1.7"
                        />
                      </svg>

                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        disabled={loading}
                        className="grow"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="btn btn-ghost btn-circle btn-xs"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary mt-1 h-12 w-full rounded-xl"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Signing in
                      </>
                    ) : (
                      <>
                        Sign in
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </form>

                {import.meta.env.DEV && (
                  <div className="mt-5 rounded-xl border border-dashed border-base-300 bg-base-200/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-base-content/55">
                        DEVELOPMENT ACCOUNT
                      </span>

                      <span className="badge badge-ghost badge-sm">DEV</span>
                    </div>

                    <button
                      type="button"
                      className="mt-2 text-left font-mono text-xs leading-5 text-base-content/60"
                      onClick={() => {
                        setUsername('admin')
                        setPassword('admin@1234')
                      }}
                    >
                      admin / admin@1234
                      <span className="ml-2 text-primary">
                        Click to fill
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-base-content/40">
              Protected by NAVA Identity & Access Management
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage