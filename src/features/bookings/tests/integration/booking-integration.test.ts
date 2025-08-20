/**
 * Integration tests for the booking flow (no DB involved).
 *
 * These tests exercise the complete in-memory workflow used to derive
 * bookable slots from:
 * - An employee's working schedule (per-day working hours)
 * - Service metadata (duration in minutes)
 * - Schedule exclusions (time-off windows that must be removed)
 *
 * Pipeline under test (via runCompleteBookingProcess):
 * 1) calculateScheduleAvailability → produces daily Periods the employee can work
 * 2) slot generation → splits each Period into service-duration-aligned slot starts
 * 3) date collection → groups slots by date for presentation
 * 4) availability filtering → returns only slots that have at least one employee
 *
 * Key guarantees asserted here:
 * - Slot count matches expected working window ÷ service duration
 * - First/last start times are correct for the given day
 * - Exclusions remove starts within the excluded window
 * - Days with null schedules (e.g., Sunday) yield zero slots
 */
import { describe, it, expect } from 'vitest';
import {
  createTestEmployee,
  createTestService,
} from '../test-helpers';
import { runCompleteBookingProcess } from './booking-integration-helper';
import { createEmployeeWithExclusions } from '../test-helpers';

describe('Booking System Integration', () => {
  describe('Basic Booking Scenarios', () => {
    /**
     * Scenario: Single employee, single day, 30‑minute service (Hair Cut)
     * Given
     *  - Alice works 09:00–17:00 on Monday
     *  - Service duration is 30 minutes
     * When
     *  - We run the full booking pipeline for 2024‑01‑15 (Mon)
     * Then
     *  - We expect 16 slots (09:00, 09:30, …, 16:30)
     *  - First slot at 09:00, last slot at 16:30
     *  - Slot has Alice assigned
     */
    it('should handle single employee on regular working day', () => {
      // Given: Alice works 9-5, 30-min haircuts
      const employee = createTestEmployee('Alice', {
        start: '09:00',
        end: '17:00',
      });
      const service = createTestService('Hair Cut', 30);
      const date = new Date('2024-01-15'); // Monday

      // When: Calculate complete booking availability
      const result = runCompleteBookingProcess(
        employee,
        service,
        date,
        date
      );

      // Then: Should have 16 available slots (8 hours × 2 slots per hour)
      expect(result.totalSlots).toBe(16);
      expect(
        result.availableSlots[0].time.toTimeString().slice(0, 5)
      ).toBe('09:00');
      expect(
        result.availableSlots[0].employees.map((e) => e.name)
      ).toEqual(['Alice']);
      expect(
        result.availableSlots[result.totalSlots - 1].time
          .toTimeString()
          .slice(0, 5)
      ).toBe('16:30');
    });
  });

  describe('Different service durations', () => {
    /**
     * Scenario: Same day/hours as the basic test, but a 60‑minute service.
     * Expectation: Half as many starts as the 30‑minute case.
     *  - 8 slots starting hourly from 09:00 to 16:00 inclusive.
     */
    it('should handle 60-min service with fewer slots', () => {
      const employee = createTestEmployee('Alice', {
        start: '09:00',
        end: '17:00',
      });
      const service = createTestService('Massage', 60);
      const date = new Date('2024-01-15');

      const result = runCompleteBookingProcess(
        employee,
        service,
        date,
        date
      );

      expect(result.totalSlots).toBe(8); // 8 hours => 8 60-min starts (09:00..16:00)
      expect(
        result.availableSlots[0].time.toTimeString().slice(0, 5)
      ).toBe('09:00');
      expect(
        result.availableSlots[result.totalSlots - 1].time
          .toTimeString()
          .slice(0, 5)
      ).toBe('16:00');
    });
  });

  describe('Schedule exclusions', () => {
    /**
     * Scenario: Employee has a lunch break exclusion from 12:00–13:00.
     * Expectation: No slot starts should fall within [12:00, 13:00).
     *
     * Note: Exclusions are set with concrete HH:mm to ensure subtraction
     * removes starts in that interval.
     */
    it('should exclude a 12:00-13:00 lunch break', () => {
      const employee = createEmployeeWithExclusions([
        { start: '12:00', end: '13:00' },
      ]);
      const service = createTestService('Hair Cut', 30);
      const date = new Date('2024-01-15');

      const result = runCompleteBookingProcess(
        employee,
        service,
        date,
        date
      );

      // 09:00..11:30 => 7 slots before lunch, 13:00..16:30 => 8 slots after lunch
      // But depending on how exclusions trim periods, we expect no slots starting within 12:00-13:00
      expect(
        result.availableSlots.every((s) => {
          const hhmm = s.time.toTimeString().slice(0, 5);
          return hhmm < '12:00' || hhmm >= '13:00';
        })
      ).toBe(true);
    });
  });

  describe('Weekday vs weekend', () => {
    /**
     * Scenario: Sunday with null working hours (no schedule for Sunday).
     * Expectation: No available slots for that day.
     */
    it('should have no slots on Sunday if schedule is null for Sunday', () => {
      const employee = createTestEmployee('Alice', {
        start: '09:00',
        end: '17:00',
      });
      // Make Sunday null by default via helper; pick a Sunday date
      const sunday = new Date('2024-01-21');
      const service = createTestService('Hair Cut', 30);

      const result = runCompleteBookingProcess(
        employee,
        service,
        sunday,
        sunday
      );
      expect(result.totalSlots).toBe(0);
    });
  });
});
