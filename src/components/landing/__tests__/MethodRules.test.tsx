import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MethodRules, Hikarii_METHOD_RULES } from '../MethodRules';
import { Stats, STATS } from '../Stats';
import { OnboardingSteps, ONBOARDING_STEPS } from '../OnboardingSteps';

describe('Landing Page Decomposed Components Unit Tests', () => {
    describe('MethodRules Component', () => {
        it('should render the Hikarii Method heading and philosophy badge', () => {
            render(
                <MemoryRouter>
                    <MethodRules />
                </MemoryRouter>
            );

            expect(screen.getByText('The Philosophy')).toBeDefined();
            expect(screen.getByText('The Hikarii Method')).toBeDefined();
            expect(screen.getByText(/Learn all 5 rules/i)).toBeDefined();
        });

        it('should export all 5 method rules with expected keys', () => {
            expect(Hikarii_METHOD_RULES).toHaveLength(5);
            expect(Hikarii_METHOD_RULES[0].title).toBe('Give Every Task a Budget');
            expect(Hikarii_METHOD_RULES[1].title).toBe('Plan Project Expenses');
        });
    });

    describe('Stats Component', () => {
        it('should render all stat values and labels correctly', () => {
            render(<Stats />);

            STATS.forEach(stat => {
                expect(screen.getByText(stat.value)).toBeDefined();
                expect(screen.getByText(stat.label)).toBeDefined();
            });
        });
    });

    describe('OnboardingSteps Component', () => {
        it('should render all 4 onboarding step cards and titles', () => {
            render(<OnboardingSteps />);

            expect(screen.getByText('How It Works')).toBeDefined();
            expect(screen.getByText('Four simple steps to get started')).toBeDefined();

            ONBOARDING_STEPS.forEach(step => {
                expect(screen.getByText(step.title)).toBeDefined();
                expect(screen.getByText(step.body)).toBeDefined();
            });
        });
    });
});
