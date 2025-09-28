import * as validation from '../lib/validation';

describe('Validation Schemas', () => {
  it('registerSchema: should validate correct input', () => {
    expect(() =>
      validation.registerSchema.parse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      })
    ).not.toThrow();
  });

  it('registerSchema: should fail on invalid email', () => {
    expect(() =>
      validation.registerSchema.parse({
        name: 'John Doe',
        email: 'not-an-email',
        password: 'password123',
        role: 'user',
      })
    ).toThrow();
  });

  it('createEnquirySchema: should validate correct input', () => {
    expect(() =>
      validation.createEnquirySchema.parse({
        customerName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        message: 'This is a valid enquiry message.',
      })
    ).not.toThrow();
  });

  it('createEnquirySchema: should fail on short message', () => {
    expect(() =>
      validation.createEnquirySchema.parse({
        customerName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        message: 'short',
      })
    ).toThrow();
  });
});
