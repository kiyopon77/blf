// app/utils/sort.ts
export const sortByUserId = (arr: any[]) => {
  return [...arr].sort((a, b) => a.user_id - b.user_id)
}

export const sortByBrokerId = (arr: any[]) => {
  return [...arr].sort((a, b) => a.broker_id - b.broker_id)
}

export const sortByFloorNo = (arr: any[]) => {
  return [...arr].sort((a, b) => a.floor_no - b.floor_no)
}

// handles sort by customer id functionality
export const sortByCustomerId = (arr: any[]) => {
  return [...arr].sort((a, b) => a.customer_id - b.customer_id)
}
