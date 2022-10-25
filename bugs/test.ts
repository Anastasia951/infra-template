type SomethingComplex = {
  foo: number
  bar: string
}
function takeSomethingComplex(arg: SomethingComplex) {}
function getBar(): string {
  return 'some bar'
}

const fail = {
  foo: 123,
  bar: getBar,
}

takeSomethingComplex(fail) // TS ОШИБКА ПРОИСХОДИТ ЗДЕСЬ
