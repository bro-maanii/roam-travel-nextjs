export const contactServices = [
  "A complete trip",
  "Flight booking",
  "Hotel booking",
  "Visa assistance",
  "Car rental",
] as const;
export type ContactPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
  website?: string;
};
export type ContactErrors = Partial<
  Record<"name" | "email" | "service" | "message", string>
>;

export function validateContact(input: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  if (
    typeof input.name !== "string" ||
    input.name.trim().length < 2 ||
    input.name.length > 80 ||
    /[\r\n]/.test(input.name)
  )
    errors.name = "Enter your name (2–80 characters).";
  if (
    typeof input.email !== "string" ||
    input.email.length > 150 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(input.email)
  )
    errors.email = "Enter a valid email address.";
  if (
    typeof input.service !== "string" ||
    !contactServices.some((service) => service === input.service)
  )
    errors.service = "Choose one of our travel services.";
  if (
    typeof input.message !== "string" ||
    input.message.trim().length < 10 ||
    input.message.length > 2000
  )
    errors.message = "Tell us a little about your plans (10–2,000 characters).";
  return errors;
}
