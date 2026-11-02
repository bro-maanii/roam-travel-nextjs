import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../src/lib/contact-validation.ts";

const valid = {
  name: "Alex Morgan",
  email: "alex@example.com",
  service: "A complete trip",
  message: "A quiet week in Bali for two people.",
};
test("valid enquiry is accepted", () =>
  assert.deepEqual(validateContact(valid), {}));
test("empty and malformed fields return field-specific errors", () => {
  assert.equal(Object.keys(validateContact({})).length, 4);
  assert.ok(validateContact({ ...valid, name: " \n " }).name);
  assert.ok(
    validateContact({
      ...valid,
      email: "alex@example.com\nBcc: other@example.com",
    }).email,
  );
  assert.ok(validateContact({ ...valid, service: "Payment" }).service);
  assert.ok(validateContact({ ...valid, message: "x".repeat(2001) }).message);
});
