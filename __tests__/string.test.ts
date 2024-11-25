import { capitaliseFirstLetter } from '../src/utils/string'

test('Capitalise first letter', () => {
  expect(capitaliseFirstLetter('helloworld')).toEqual('Helloworld')
})
