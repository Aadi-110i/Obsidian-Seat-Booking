import { isFloatingUnlocked } from './lib/scheduling';
import { addDays } from 'date-fns';

console.log("=== Testing Floating Seat Rules ===");

// We mock the Date object to simulate current time as Friday 2 PM and Friday 4 PM
const OriginalDate = Date;

function runTest(mockNowStr: string, targetOffsetDays: number, expected: boolean) {
    const mockNow = new Date(mockNowStr);
    
    // override global Date
    // @ts-ignore
    global.Date = class MockDate extends OriginalDate {
        constructor(...args: any[]) {
            if (args.length) {
                // @ts-ignore
                super(...args);
            } else {
                super(mockNow.getTime());
            }
        }
        static now() { return mockNow.getTime(); }
    } as any;

    const target = addDays(new OriginalDate(mockNowStr), targetOffsetDays);
    const result = isFloatingUnlocked(target);
    const passed = result === expected;
    console.log(`Now: ${mockNow.toDateString()} ${mockNow.getHours()}:00, Target is +${targetOffsetDays} days. Expected: ${expected}, Got: ${result} -> ${passed ? 'PASS' : 'FAIL'}`);
    
    global.Date = OriginalDate;
}

// Today is Friday
const FRI = "2026-03-13T12:00:00.000Z";
runTest("2026-03-13T14:00:00.000+05:30", 3, false); // Friday 2 PM, booking for Monday (+3 days). Expected: false (only unlocks at 3 PM)
runTest("2026-03-13T16:00:00.000+05:30", 3, true);  // Friday 4 PM, booking for Monday (+3 days). Expected: true
// Today is Saturday
runTest("2026-03-14T10:00:00.000+05:30", 2, true);  // Saturday 10 AM, booking for Monday (+2 days). Expected: true
// Booking same day
runTest("2026-03-13T16:00:00.000+05:30", 0, false); // Friday 4 PM, booking for Friday (same day). Expected: false
// Booking for Tuesday on Friday
runTest("2026-03-13T16:00:00.000+05:30", 4, false); // Friday 4 PM, booking for Tuesday. Expected: false (too early)

console.log("Done.");
