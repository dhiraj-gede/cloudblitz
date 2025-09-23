// Test file with FIXED code
// This should pass the pre-commit hook

// Fixed: Remove unused imports and use proper types
function goodFunction(param: string): string {
  return param;
}

export { goodFunction };
