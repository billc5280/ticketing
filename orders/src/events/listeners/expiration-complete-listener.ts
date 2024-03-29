import { Message } from 'node-nats-streaming';
import {
   Listener,
   Subjects,
   ExpirationCompleteEvent,
   OrderStatus,
} from '@my-sgtickets/common';
import { ordersServiceQueueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
   queueGroupName = ordersServiceQueueGroupName;
   readonly subject = Subjects.ExpirationComplete;

   async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
      const order = await Order.findById(data.orderId).populate('ticket');

      if (!order) {
         throw new Error('Order not found');
      }

      if (order.status !== OrderStatus.Complete) {
         order.set({
            status: OrderStatus.Cancelled,
         });

         await order.save();

         await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
               id: order.ticket.id,
            },
         });
      }

      msg.ack();
   }
}
