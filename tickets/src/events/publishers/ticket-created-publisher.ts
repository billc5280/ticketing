import { Publisher, Subjects, TicketCreatedEvent } from '@my-sgtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
}
