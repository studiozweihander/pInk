/**
 * Tests for api-utils.js module
 * Tests utility functions for API operations
 */

// Mock fetch for testing
global.fetch = jest.fn ? jest.fn() : (() => {
  throw new Error('Jest not available, skipping fetch tests');
});

// Mock console methods
global.console = {
  warn: () => {},
  log: () => {}
};

// Mock window object
global.window = {
  api: {
    baseURL: 'http://localhost:3000/api'
  }
};

import { ApiUtils, createSlug, handleImageError, isValidUrl } from '../api-utils.js';

// Test suite
console.log('🧪 Running tests for api-utils.js...\n');

// Test isValidUrl function
test('isValidUrl should validate URLs correctly', () => {
  assert(isValidUrl('https://example.com'));
  assert(isValidUrl('http://example.com'));
  assert(!isValidUrl('not-a-url'));
  assert(!isValidUrl('ftp://example.com'));
  assert(!isValidUrl(''));
  assert(!isValidUrl(null));
  assert(!isValidUrl(undefined));
});

// Test generateFallbackSlug function
test('generateFallbackSlug should create valid slugs', () => {
  const slug1 = ApiUtils.generateFallbackSlug('Hello World!');
  assert(slug1 === 'hello-world');

  const slug2 = ApiUtils.generateFallbackSlug('Test & Special@Characters');
  assert(slug2 === 'test-special-characters');

  const slug3 = ApiUtils.generateFallbackSlug('  Multiple   Spaces  ');
  assert(slug3 === 'multiple-spaces');

  const slug4 = ApiUtils.generateFallbackSlug('');
  assert(slug4 === '');
});

// Test handleImageError function (basic structure test)
test('handleImageError should be a function', () => {
  assert(typeof handleImageError === 'function');
  assert(handleImageError.length === 1); // Should accept one parameter
});

// Test createSlug function (basic structure test)
test('createSlug should be a function', () => {
  assert(typeof createSlug === 'function');
  assert(createSlug.length === 1); // Should accept one parameter
});

// Test ApiUtils class methods
test('ApiUtils class should have static methods', () => {
  assert(typeof ApiUtils.createSlug === 'function');
  assert(typeof ApiUtils.generateFallbackSlug === 'function');
  assert(typeof ApiUtils.handleImageError === 'function');
  assert(typeof ApiUtils.isValidUrl === 'function');
  assert(typeof ApiUtils.debounce === 'function');
  assert(typeof ApiUtils.throttle === 'function');
});

// Test debounce function
test('debounce should return a function', () => {
  const debouncedFn = ApiUtils.debounce(() => {}, 100);
  assert(typeof debouncedFn === 'function');
});

// Test throttle function
test('throttle should return a function', () => {
  const throttledFn = ApiUtils.throttle(() => {}, 100);
  assert(typeof throttledFn === 'function');
});

// Test ApiUtils static method binding
test('ApiUtils methods should be properly bound', () => {
  assert(ApiUtils.createSlug === createSlug);
  assert(ApiUtils.handleImageError === handleImageError);
  assert(ApiUtils.isValidUrl === isValidUrl);
});

// Test URL validation edge cases
test('isValidUrl should handle edge cases correctly', () => {
  // Valid URLs
  assert(isValidUrl('https://subdomain.example.com/path?query=value'));
  assert(isValidUrl('http://localhost:3000/api'));

  // Invalid URLs
  assert(!isValidUrl('javascript:alert(1)'));
  assert(!isValidUrl('data:text/plain;base64,SGVsbG8='));
  assert(!isValidUrl('file:///path/to/file'));
  assert(!isValidUrl('mailto:user@example.com'));
});

// Test slug generation edge cases
test('generateFallbackSlug should handle edge cases', () => {
  assert(ApiUtils.generateFallbackSlug('a') === 'a');
  assert(ApiUtils.generateFallbackSlug('A') === 'a');
  assert(ApiUtils.generateFallbackSlug('123') === '123');
  assert(ApiUtils.generateFallbackSlug('!@#$%^&*()') === '');
  assert(ApiUtils.generateFallbackSlug('   ') === '');
  assert(ApiUtils.generateFallbackSlug('-start-end-') === 'start-end');
});

console.log('\n🏁 API utils tests completed!');
