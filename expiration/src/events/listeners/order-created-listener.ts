import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@my-sgtickets/common";
import { expirationServiceQueueGroupName } from './queue-group-name';
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   readonly subject = Subjects.OrderCreated;
   queueGroupName = expirationServiceQueueGroupName;

   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
      console.log("Waiting this many milliseconds to process the job:", delay);

      await expirationQueue.add({
            orderId: data.id,
         },
         {
            delay,
         }
      );

      // ack the message
      msg.ack();
   }
}
