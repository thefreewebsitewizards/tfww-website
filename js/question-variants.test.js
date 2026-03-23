import { describe, it, expect } from 'vitest';
import {
  questionVariants,
  TOPICS,
  getRandomVariant,
  getNextVariant,
  handleEvasiveResponse
} from './question-variants.js';

describe('questionVariants', () => {
  it('has all required qualification topics', () => {
    expect(questionVariants).toHaveProperty('budget');
    expect(questionVariants).toHaveProperty('timeline');
    expect(questionVariants).toHaveProperty('authority');
    expect(questionVariants).toHaveProperty('pain_specifics');
  });

  it('has 3-4 variants per topic', () => {
    for (const topic of TOPICS) {
      expect(questionVariants[topic].length).toBeGreaterThanOrEqual(3);
      expect(questionVariants[topic].length).toBeLessThanOrEqual(4);
    }
  });

  it('contains only non-empty strings', () => {
    for (const topic of TOPICS) {
      for (const variant of questionVariants[topic]) {
        expect(typeof variant).toBe('string');
        expect(variant.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has no duplicate variants within a topic', () => {
    for (const topic of TOPICS) {
      const unique = new Set(questionVariants[topic]);
      expect(unique.size).toBe(questionVariants[topic].length);
    }
  });
});

describe('TOPICS', () => {
  it('lists all topic keys', () => {
    expect(TOPICS).toEqual(['budget', 'timeline', 'authority', 'pain_specifics']);
  });
});

describe('getRandomVariant', () => {
  it('returns a string from the correct topic', () => {
    for (const topic of TOPICS) {
      const result = getRandomVariant(topic);
      expect(typeof result).toBe('string');
      expect(questionVariants[topic]).toContain(result);
    }
  });

  it('returns null for an unknown topic', () => {
    expect(getRandomVariant('nonexistent')).toBeNull();
  });
});

describe('getNextVariant', () => {
  it('returns variants sequentially based on attemptCount', () => {
    for (const topic of TOPICS) {
      const variants = questionVariants[topic];
      for (let i = 0; i < variants.length; i++) {
        expect(getNextVariant(topic, i)).toBe(variants[i]);
      }
    }
  });

  it('wraps around when attemptCount exceeds variant count', () => {
    const variants = questionVariants.budget;
    expect(getNextVariant('budget', variants.length)).toBe(variants[0]);
    expect(getNextVariant('budget', variants.length + 1)).toBe(variants[1]);
  });

  it('returns null for an unknown topic', () => {
    expect(getNextVariant('nonexistent', 0)).toBeNull();
  });
});

describe('handleEvasiveResponse', () => {
  it('returns question and incremented attempt number', () => {
    const result = handleEvasiveResponse('budget', 0);
    expect(result).toEqual({
      question: questionVariants.budget[0],
      attemptNumber: 1
    });
  });

  it('advances through variants on repeated evasions', () => {
    const variants = questionVariants.timeline;
    for (let i = 0; i < variants.length; i++) {
      const result = handleEvasiveResponse('timeline', i);
      expect(result.question).toBe(variants[i]);
      expect(result.attemptNumber).toBe(i + 1);
    }
  });

  it('wraps around after exhausting all variants', () => {
    const variants = questionVariants.authority;
    const result = handleEvasiveResponse('authority', variants.length);
    expect(result.question).toBe(variants[0]);
    expect(result.attemptNumber).toBe(variants.length + 1);
  });

  it('defaults previousAttempts to 0', () => {
    const result = handleEvasiveResponse('pain_specifics');
    expect(result).toEqual({
      question: questionVariants.pain_specifics[0],
      attemptNumber: 1
    });
  });

  it('returns null for an unknown topic', () => {
    expect(handleEvasiveResponse('nonexistent', 0)).toBeNull();
  });
});
