import { test } from "node:test";
import assert from "node:assert/strict";
import {
  searchTravel,
  validateSearch,
  type SearchQuery,
} from "../src/lib/travel-data.ts";

const base: SearchQuery = {
  service: "Flights",
  destination: "bali",
  origin: "Karachi",
  date: "2030-01-10",
  endDate: "2030-01-13",
  travelers: 2,
};

test("flights reflect departure city and multiply prices by party size", () => {
  const one = searchTravel({ ...base, travelers: 1 });
  const two = searchTravel(base);
  assert.match(two[0].title, /Karachi → Bali/);
  assert.equal(two[0].price, one[0].price * 2);
});
test("hotel quote prices use nights and rooms for the whole party", () => {
  const results = searchTravel({ ...base, service: "Hotels", travelers: 3 });
  assert.equal(results[0].price, 119 * 3 * 2);
  assert.equal(results[0].unit, "3 nights · 2 room(s)");
});
test("car rental quotes use the rental duration and seat capacity", () => {
  const results = searchTravel({
    ...base,
    service: "Car rental",
    travelers: 6,
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "car-2");
  assert.equal(results[0].price, 79 * 3);
});
test("visa fees use applicant count and disclose government fees", () => {
  const results = searchTravel({ ...base, service: "Visa", travelers: 3 });
  assert.equal(results[0].price, 89 * 3);
  assert.ok(
    results[0].details.some((detail) =>
      detail.includes("Government fees excluded"),
    ),
  );
});
test("rejects past dates, invalid ranges, unknown destinations and party sizes", () => {
  assert.match(
    validateSearch({ ...base, date: "2020-01-01" }, "2026-11-02")!,
    /future/,
  );
  assert.match(
    validateSearch({ ...base, service: "Hotels", endDate: base.date })!,
    /after/,
  );
  assert.match(
    validateSearch({ ...base, service: "Car rental", endDate: "2030-01-09" })!,
    /after/,
  );
  assert.match(validateSearch({ ...base, travelers: 0 })!, /1 and 6/);
  assert.match(
    validateSearch({ ...base, destination: "unknown" })!,
    /available destinations/,
  );
  assert.equal(validateSearch(base, "2026-11-02"), null);
  assert.deepEqual(searchTravel({ ...base, destination: "unknown" }), []);
});
