import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { appointmentConfirmationEvent } from '@/features/appointments/events/event-appointment-confirmation';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [appointmentConfirmationEvent],
});
