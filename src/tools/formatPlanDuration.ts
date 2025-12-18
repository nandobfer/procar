export const formatPlanDuration = (timestamp: number | string) => {
    timestamp = Number(timestamp)
    const seconds = timestamp / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24
    const months = days / 30
    const years = months / 12

    return `${Math.floor(years)} ano(s)` || `${Math.floor(months)} meses`
}
