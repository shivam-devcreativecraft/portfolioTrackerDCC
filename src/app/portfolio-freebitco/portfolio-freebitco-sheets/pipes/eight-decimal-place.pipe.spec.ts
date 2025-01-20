import { EightDecimalPlacePipe } from './eight-decimal-place.pipe';

describe('EightDecimalPlacePipe', () => {
  it('create an instance', () => {
    const pipe = new EightDecimalPlacePipe();
    expect(pipe).toBeTruthy();
  });
});
