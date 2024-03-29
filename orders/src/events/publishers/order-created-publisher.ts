import { Publisher, Subjects, OrderCreatedEvent } from '@my-sgtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
   readonly subject = Subjects.OrderCreated;
}
