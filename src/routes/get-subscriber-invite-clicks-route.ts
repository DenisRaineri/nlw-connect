import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getSubscriberInviteClicks } from '../functions/get-subscriber-invite-clicks';

export const getSubscriberInviteClicksRoute: FastifyPluginAsyncZod = async (
  app,
) => {
  app.get(
    '/subscribers/:subscriberId/ranking/clicks',
    {
      schema: {
        summary: 'Get subscriber invite clicks count',
        tags: ['referral'],
        operationId: 'getSubscriberInviteClicks',
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            count: z.number(),
          }),
        },
      },
    },
    async (req) => {
      const { subscriberId } = req.params;

      const { count } = await getSubscriberInviteClicks({ subscriberId });

      return { count };
    },
  );
};
