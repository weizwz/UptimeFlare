function getColor(percent: number | string): string {
  const p = Number(percent)
  if (Number.isNaN(p)) {
    return 'bg-gray-200'
  } else if (p >= 99.9) {
    return 'bg-emerald-500'
  } else if (p >= 98) {
    return 'bg-emerald-300'
  } else if (p >= 95) {
    return 'bg-amber-400'
  } else {
    return 'bg-rose-500'
  }
}

export { getColor }
