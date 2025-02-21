import {
  capitaliseFirstLetter,
  formatAmountTwoDecimals
} from '../src/utils/string'

test('Capitalise first letter', () => {
  expect(capitaliseFirstLetter('helloworld')).toEqual('Helloworld')
})

test('Format amount to two decimals', () => {
  expect(formatAmountTwoDecimals('123')).toEqual('123.00')
  expect(formatAmountTwoDecimals('123.1')).toEqual('123.10')
})
