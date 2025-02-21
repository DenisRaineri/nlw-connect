import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { env } from '../env';
import { accessInviteLink } from '../functions/access-invite-link';
import { redis } from '../redis/client';

export const acessInviteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Acess invite link and redirects user',
        tags: ['referral'],
        description: 'Acess invite link and redirects use',
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (req, res) => {
      const { subscriberId } = req.params;

      await accessInviteLink({ subscriberId });

      console.log(await redis.hgetall('referral:access-count'));

      console.log(subscriberId);

      const redirectUrl = new URL(env.WEB_URL);

      redirectUrl.searchParams.set('referrer', subscriberId);

      return res.redirect(redirectUrl.toString(), 302);
    },
  );
};
