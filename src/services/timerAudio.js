let sharedCtx = null

// Must be called from a user-gesture handler to satisfy auto-play policy
export function initAudioContext() {
  if (sharedCtx) return
  try {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  } catch (_) {}
}

export function playBeep() {
  const ctx = sharedCtx
  if (!ctx) return
  try {
    const doBeep = (delay) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0, ctx.currentTime + delay)
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.25)
    }
    doBeep(0)
    doBeep(0.35)
  } catch (_) {}
}
