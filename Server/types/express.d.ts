declare global {
  namespace Express {
    interface Request {
      sanitizedQuery?: unknown;
      sanitizedBody?: unknown;
      sanitizedParams?: unknown;
    }
  }
}

export {};
