import { Publisher, Subjects, ExpirationCompleteEvent } from '@my-sgtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
   readonly subject = Subjects.ExpirationComplete;
}
