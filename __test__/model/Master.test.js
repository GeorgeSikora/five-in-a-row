/**
 * Created by Xin on 28/05/2017.
 */
test('generatePattern', () => {
  let master = new Master('x', 'easy', 'o');

  let points = [
    [' ', ' ', 'o', '√', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    ['o', 'o', 'o', ' ', ' ', ' '],
  ];
  let pattern;
  pattern = master.generatePattern(points, 0, 3, 0, 1, master.id);
  expect(pattern).toEqual('oxx');
  pattern = master.generatePattern(points, 0, 3, 1, 0, master.id);
  expect(pattern).toEqual('oooox');
  pattern = master.generatePattern(points, 0, 3, 1, 1, master.id);
  expect(pattern).toEqual('oxx');
  pattern = master.generatePattern(points, 0, 3, 1, -1, master.id);
  expect(pattern).toEqual('oxxx');


  points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', 'o'],
    [' ', 'o', ' ', '√', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'x'],
    ['o', 'o', 'o', ' ', ' ', ' '],
  ];
  pattern = master.generatePattern(points, 2, 3, 0, 1, master.id);
  expect(pattern).toEqual('xoxx');
  pattern = master.generatePattern(points, 2, 3, 1, 0, master.id);
  expect(pattern).toEqual('xoooxx');
  pattern = master.generatePattern(points, 2, 3, 1, 1, master.id);
  expect(pattern).toEqual('xxoxo');
  pattern = master.generatePattern(points, 2, 3, 1, -1, master.id);
  expect(pattern).toEqual('xxoxx');

  points = [
    ['x', 'o', ' ', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', ' ', ' '],
    ['o', 'o', 'x', 'o', 'o', 'o'],
    ['o', 'o', 'x', ' ', 'o', 'o'],
    ['o', 'o', ' ', 'o', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', ' '],
  ];
  pattern = master.generatePattern(points, 1, 4, 0, 1, master.id);
  expect(pattern).toEqual('ooooox');
  pattern = master.generatePattern(points, 1, 5, 0, 1, master.id);
  expect(pattern).toEqual('oooxo');
});


test('evaluatePattern', () => {
  let master = new Master('x', 'easy', 'o');
  expect(master.evaluatePattern('ooooo')).toBe(99999);
  expect(master.evaluatePattern('xoooxx')).toBe(6000);
  expect(master.evaluatePattern('xxoxo')).toBe(80);
});


test('evaluatePoint', () => {
  let master = new Master('x', 'easy', 'o');

  let points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', 'o'],
    [' ', 'o', ' ', '√', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'x'],
    ['o', 'o', 'o', ' ', ' ', ' '],
  ];

  let pattern = master.generatePattern(points, 2, 3, 0, 1, master.id);
  expect(pattern).toEqual('xoxx');
  expect(master.evaluatePattern(pattern)).toEqual(0);
  pattern = master.generatePattern(points, 2, 3, 1, 0, master.id);
  expect(pattern).toEqual('xoooxx');
  expect(master.evaluatePattern(pattern)).toEqual(6000);
  pattern = master.generatePattern(points, 2, 3, 1, 1, master.id);
  expect(pattern).toEqual('xxoxo');
  expect(master.evaluatePattern(pattern)).toEqual(80);
  pattern = master.generatePattern(points, 2, 3, 1, -1, master.id);
  expect(pattern).toEqual('xxoxx');
  expect(master.evaluatePattern(pattern)).toEqual(40);
  let value = master.evaluatePoint(points, { row: 2, column: 3 }, master.id);
  expect(value).toBe(6120);


  points = [
    ['x', 'o', ' ', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', ' ', ' '],
    ['o', 'o', 'x', 'o', 'o', 'o'],
    ['o', 'o', 'x', ' ', 'o', 'o'],
    ['o', 'o', ' ', 'o', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', ' '],
  ];
  value = master.evaluatePoint(points, { row: 4, column: 4 }, master.id);
  expect(value).toBe(6380);
  value = master.evaluatePoint(points, { row: 1, column: 5 }, master.id);
  expect(value).toBe(3500);


  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.evaluatePoint(points, { row: 1, column: 0 }, master.id);
  expect(value).toBe(5500);
  value = master.evaluatePoint(points, { row: 1, column: 4 }, master.id);
  expect(value).toBe(5500);


  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.evaluatePoint(points, { row: 1, column: 0 }, master.id);
  expect(value).toBe(5500);
  value = master.evaluatePoint(points, { row: 1, column: 4 }, master.id);
  expect(value).toBe(5500);
});


test('evaluatePoints', () => {
  let master = new Master('x', 'easy', 'o');


  let points = [
    ['x', 'x', 'x', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'o', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    ['o', 'o', 'o', ' ', ' ', ' '],
  ];

  let value = master.evaluatePoints(points, master.id);
  expect(value).toBe(22000);


  points = [
    ['x', 'x', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'o', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    ['o', 'o', 'o', ' ', ' ', ' '],
  ];

  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(4500);


  points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    ['o', 'o', ' ', ' ', ' ', ' '],
  ];

  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(600);

  points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', 'o'],
    [' ', 'o', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'x'],
    ['o', 'o', 'o', ' ', ' ', ' '],
  ];

  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(18280);


  points = [
    ['x', 'o', ' ', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', ' ', ' '],
    ['o', 'o', 'x', 'o', 'o', 'o'],
    ['o', 'o', 'x', ' ', 'o', 'o'],
    ['o', 'o', ' ', 'o', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', ' '],
  ];
  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(44500);


  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(18000);


  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', 'x', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(22000);

  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.evaluatePoints(points, master.id);
  expect(value).toBe(22000);

});


test('findAvailableMoves', () => {
  let master = new Master('x', 'easy', 'o');
  let points = [
    [' ', 'x', 'o'],
    ['x', 'x', ' '],
    [' ', 'o', 'o'],
  ];

  const moves = master.findAvailableMoves(points);
  expect(moves.length).toBe(3);
  expect(moves[0]).toEqual({ row: 0, column: 0 });
  expect(moves[1]).toEqual({ row: 1, column: 2 });
  expect(moves[2]).toEqual({ row: 2, column: 0 });
});


test('sortMoves', () => {

  let master = new Master('x', 'easy', 'o');
  let points = [
    ['x', 'o', ' ', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', ' ', ' '],
    ['o', 'o', 'x', 'o', 'o', 'o'],
    ['o', 'o', 'x', ' ', 'o', 'o'],
    ['o', 'o', ' ', 'o', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', ' '],
  ];

  const moves = master.findAvailableMoves(points);

  expect(moves.length).toBe(7);
  console.time("sortMoves")
  master.sortMoves(points, moves, master.id);
  console.timeEnd("sortMoves")
  expect(moves[0]).toHaveProperty('row', 1);
  expect(moves[0]).toHaveProperty('column', 4);
  expect(moves[1]).toHaveProperty('row', 4);
  expect(moves[1]).toHaveProperty('column', 4);
  expect(moves[2]).toHaveProperty('row', 0);
  expect(moves[2]).toHaveProperty('column', 2);
  expect(moves[3]).toHaveProperty('row', 3);
  expect(moves[3]).toHaveProperty('column', 3);
});

test('oooox', () => {
  let master = new Master('x', 'easy', 'o');
  let attacker = 'x';
  let defender = 'o';
  // let points = [
  //   [' ', ' ', ' ', ' ', ' ', ' '],
  //   [' ', ' ', ' ', ' ', ' ', ' '],
  //   [' ', ' ', ' ', ' ', ' ', ' '],
  //   [' ', ' ', ' ', ' ', ' ', ' '],
  //   [' ', ' ', ' ', ' ', ' ', ' '],
  //   [' ', ' ', 'o', ' ', ' ', ' '],
  // ];
  let points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', '√', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  let value = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 4
  }, 1, Number.MIN_VALUE, Number.MAX_VALUE);
  expect(value).toBe(499995);

  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', 'x', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 0
  }, 1, Number.MIN_VALUE, Number.MAX_VALUE);
  expect(value).toBe(499995);

  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', ' ', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 0
  }, 3, Number.MIN_VALUE, Number.MAX_VALUE);
  expect(value).toBe(499995);


  points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', ' ', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  value = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 2
  }, 3, Number.MIN_VALUE, Number.MAX_VALUE);
  expect(value).toBe(Number.MIN_VALUE);
});


test('xooox', () => {
  let master = new Master('x', 'easy', 'o');
  let attacker = 'x';
  let defender = 'o';
  let points = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    [' ', 'x', 'x', 'x', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', ' ', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  let value2 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 0
  }, 3, Number.MIN_VALUE, Number.MAX_VALUE);
  let value3 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 4
  }, 3, Number.MIN_VALUE, Number.MAX_VALUE);
  let value4 = master.minMax(points, attacker, attacker, defender, {
    row: 4,
    column: 4
  }, 3, Number.MIN_VALUE, Number.MAX_VALUE);

  expect(value3).toEqual(value2);
});


test('minMax', () => {
  let master = new Master('x', 'easy', 'o');
  let attacker = 'x';
  let defender = 'o';

  let points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'o', ' ', ' ', ' '],
  ];

  let value2 = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 0
  }, 5, Number.MIN_VALUE, Number.MAX_VALUE);
  let value3 = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 3
  }, 5, Number.MIN_VALUE, Number.MAX_VALUE);
  let value4 = master.minMax(points, attacker, attacker, defender, {
    row: 3,
    column: 3
  }, 5, Number.MIN_VALUE, Number.MAX_VALUE);

  expect(value3).toBeGreaterThan(value2);
  expect(value4).toBeGreaterThan(value3);


  points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
  ];

  value2 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 3
  }, 5, Number.MIN_VALUE, Number.MAX_VALUE);
  value3 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 1
  }, 5, Number.MIN_VALUE, Number.MAX_VALUE);
  value4 = master.minMax(points, attacker, attacker, defender, {
    row: 4,
    column: 3
  }, 5, Number.MIN_VALUE, Number.MAX_VALUE);
  expect(value4).toBeGreaterThan(value2);
  expect(value2).toBeGreaterThan(value3);

});


test('minMax easy vs normal 1', () => {

  let attacker = 'x';
  let defender = 'o';


  let points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'x', 'x', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
  ];

  let master = new Master('x', 'easy', 'o');
  let value2 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 3
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  let value3 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 1
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  let value4 = master.minMax(points, attacker, attacker, defender, {
    row: 4,
    column: 3
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  console.log('easy value2, value3, value4:', value2, value3, value4);
  expect(value4).toEqual(value2);
  expect(value3).toBeGreaterThan(value2);

  master = new Master('x', 'normal', 'o');
  value2 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 3
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  value3 = master.minMax(points, attacker, attacker, defender, {
    row: 1,
    column: 1
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  value4 = master.minMax(points, attacker, attacker, defender, {
    row: 4,
    column: 3
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  console.log('normal value2, value3, value4:', value2, value3, value4);

  expect(value2).toBeGreaterThan(value4); // diff from easy
  expect(value3).toBeGreaterThan(value2);


});


test('minMax easy vs normal 2', () => {

  let attacker = 'x';
  let defender = 'o';


  let points = [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'o', ' ', ' '],
    [' ', 'o', ' ', 'o', ' ', ' '],
    [' ', 'x', 'x', 'x', 'o', ' '],
    [' ', 'o', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
  ];

  let master = new Master('x', 'easy', 'o');
  let value2 = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 4
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  let value3 = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 2
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  console.log('easy value2, value3:', value2, value3);
  expect(value2).toBeGreaterThan(value3);

  master = new Master('x', 'normal', 'o');

  value2 = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 4
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  value3 = master.minMax(points, attacker, attacker, defender, {
    row: 2,
    column: 2
  }, master.depth, Number.MIN_VALUE, Number.MAX_VALUE);
  console.log('normal value2, value3:', value2, value3);
  expect(value3).toBeGreaterThan(value2);  // diff from easy

});