import { Subjects, Publisher, PaymentCreatedEvent } from '@my-sgtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
