import nats, { Stan } from 'node-nats-streaming';
// import { randomBytes } from "crypto";

class NatsWrapper {
   private _client?: Stan;

   get client() {
      if (!this._client) {
         throw new Error('Cannot connect to NATS client before connecting');
      }

      return this._client;
   }

   connect(clusterId: string, clientId: string, url: string) {
      this._client = nats.connect(clusterId, clientId, { url: url });

      return new Promise<void>((resolve, reject) => {
         this.client.on('connect', () => {
            console.log('Connected to NATS');
            resolve();
         });

         this.client.on('error', (err) => {
            console.log('NATS connection error');
            reject(err);
         });
      });
   }
}

export const natsWrapper = new NatsWrapper();
