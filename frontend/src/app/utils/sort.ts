export const sortByUserId = (arr: any[]) => {
  return [...arr].sort((a, b) => a.user_id - b.user_id)
}

export const sortByBrokerId = (arr: any[]) => {
  return [...arr].sort((a, b) => a.broker_id - b.broker_id)
}
