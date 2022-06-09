import { Publisher, Subjects, OrderCancelledEvent } from '@my-sgtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
   readonly subject = Subjects.OrderCancelled;
}
