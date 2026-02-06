export const capitaliseFirstLetter = (val: string): string => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

export const formatAmountTwoDecimals = (value: string): string =>
  parseFloat(value).toFixed(2)

export const generateColours = (count: number) =>
  Array.from(
    { length: count },
    (_, i) => `rgb(${75 + i * 6}, ${60 + i * 8}, ${200 - i * 6})`
  )
