import { Publisher, Subjects, TicketUpdatedEvent } from '@my-sgtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
}
