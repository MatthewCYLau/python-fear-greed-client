export const capitaliseFirstLetter = (val: string): string => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

export const formatAmountTwoDecimals = (value: string): string =>
  parseFloat(value).toFixed(2)
