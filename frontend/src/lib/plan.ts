export type Plan = 'free' | 'pro'

const STORAGE_KEY = 'mockly_plan'

export function readPlan(): Plan {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'pro' ? 'pro' : 'free'
  } catch {
    return 'free'
  }
}

export function setPlan(plan: Plan) {
  try {
    window.localStorage.setItem(STORAGE_KEY, plan)
  } catch {
    // Sin localStorage, se mantiene el plan Free en memoria de la sesión.
  }
}
