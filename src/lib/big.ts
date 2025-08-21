import Big from 'big.js';

export class MyBig {
  private value: Big;

  constructor(value: number | string | Big) {
    this.value = new Big(value);
  }

  mul(other: number | string | Big): MyBig {
    return new MyBig(this.value.mul(other));
  }

  div(other: number | string | Big): MyBig {
    return new MyBig(this.value.div(other));
  }

  round(dp: number): MyBig {
    return new MyBig(this.value.round(dp));
  }

  toNumber(): number {
    return this.value.toNumber();
  }

  toString(): string {
    return this.value.toString();
  }
}
