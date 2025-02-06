import { convertDateToValidFormet } from '../src/utils/date'

test('Convert date to valid formet', () => {
  expect(convertDateToValidFormet(new Date('2025-02-25'))).toEqual('25-02-2025')
})
