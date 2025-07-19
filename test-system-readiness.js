#!/usr/bin/env node

/**
 * System Readiness Test - HateSub
 * 
 * This script verifies that the authentication system is working
 * and ready for the next phase of development (Subscription Management).
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 HateSub System Readiness Test');
console.log('=====================================\n');

const tests = [
  {
    name: 'Core Authentication Tests',
    command: 'npm run test:unit -- --run src/lib/server/auth.test.ts',
    description: 'Testing core authentication functionality'
  },
  {
    name: 'Authentication Utilities Tests',
    command: 'npm run test:unit -- --run src/lib/server/auth-utils.test.ts',
    description: 'Testing authentication utilities'
  },
  {
    name: 'Page Component Tests',
    command: 'npm run test:unit -- --run src/routes/page.svelte.test.ts',
    description: 'Testing page components'
  },
  {
    name: 'Demo Tests',
    command: 'npm run test:unit -- --run src/demo.spec.ts',
    description: 'Testing demo functionality'
  },
  {
    name: 'TypeScript Compilation',
    command: 'npm run check',
    description: 'Checking TypeScript compilation'
  },
  {
    name: 'Database Schema',
    command: 'npm run db:push',
    description: 'Verifying database schema is up to date'
  }
];

let passed = 0;
let failed = 0;

console.log('Running system readiness tests...\n');

for (const test of tests) {
  try {
    console.log(`⏳ ${test.name}: ${test.description}`);
    execSync(test.command, { 
      cwd: __dirname, 
      stdio: 'pipe',
      timeout: 30000 
    });
    console.log(`✅ ${test.name}: PASSED\n`);
    passed++;
  } catch (error) {
    console.log(`❌ ${test.name}: FAILED`);
    console.log(`   Error: ${error.message.split('\n')[0]}\n`);
    failed++;
  }
}

console.log('=====================================');
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 System is ready for Phase 2: Subscription Management!');
  console.log('\nNext steps:');
  console.log('1. SUB-001: Database Schema Implementation');
  console.log('2. SUB-002: Subscription CRUD API Endpoints');
  console.log('3. SUB-003: Subscription Management UI Components');
  
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please fix issues before proceeding.');
  process.exit(1);
}