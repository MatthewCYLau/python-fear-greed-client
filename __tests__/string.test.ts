import {
  capitaliseFirstLetter,
  formatAmountTwoDecimals,
  generateColours
} from '../src/utils/string'

test('Capitalise first letter', () => {
  expect(capitaliseFirstLetter('helloworld')).toEqual('Helloworld')
})

test('Format amount to two decimals', () => {
  expect(formatAmountTwoDecimals('123')).toEqual('123.00')
  expect(formatAmountTwoDecimals('123.1')).toEqual('123.10')
})

test('Generates correct array of rgb string', () => {
  expect(generateColours(1).length).toEqual(1)
  expect(generateColours(1)[0].split(',').length).toEqual(3)
})
