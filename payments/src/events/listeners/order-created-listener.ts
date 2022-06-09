import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@my-sgtickets/common";
import { paymentsServiceQueueGroupName } from './queue-group-name';
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   readonly subject = Subjects.OrderCreated;
   queueGroupName = paymentsServiceQueueGroupName;

   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      const order = Order.build({
         id: data.id,
         price: data.ticket.price,
         status: data.status,
         userId: data.userId,
         version: data.version,
      });

      await order.save();

      // ack the message
      msg.ack();
   }
}
