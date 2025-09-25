declare global {
  namespace Express {
    interface Request {
      sanitizedQuery?: Request['query'];
      sanitizedBody?: Request['body'];
      sanitizedParams?: Request['params'];
    }
  }
}

export {};
