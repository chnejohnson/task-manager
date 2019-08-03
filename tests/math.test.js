const {
  calculateTip,
  fahrenheiToCelsius,
  celsiusToFahrenhei,
  add
} = require("../src/math");

test("should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);

  expect(total).toBe(13);
});

test("should calculate total with default tip", () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test("should convert 32 F to 0 C", () => {
  expect(fahrenheiToCelsius(32)).toBe(0);
});

test("should convert 0 c to 32 F", () => {
  expect(celsiusToFahrenhei(0)).toBe(32);
});

test("should add two numbers", async () => {
  expect(await add(2, 3)).toBe(5);
});
