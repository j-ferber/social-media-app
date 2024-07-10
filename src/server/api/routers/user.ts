import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  changeUsername: protectedProcedure
    .input(z.object({username: z.string().min(3).max(13)}))
    .mutation(async ({ctx, input}) => {
      const unavailableNames = ['explore', 'upload', 'home'];
      if (unavailableNames.includes(input.username)) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This username cannot be taken.',
        });
      }
      const exisitingUser = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!exisitingUser) {
        return ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            username: input.username,
          },
        });
      } else {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This username is already taken.',
        });
      }
    }),

  getUserData: publicProcedure.query(async ({ctx}) => {
    if (!ctx.session) return null;
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });
  }),

  getCurrentViewed: protectedProcedure
    .input(z.object({username: z.string().min(3).max(13)}))
    .query(({ctx, input}) => {
      return ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followers: true,
          following: true,
          posts: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    }),

  followUnfollowCurrentUser: protectedProcedure
    .input(z.object({vUsername: z.string().min(3).max(13)}))
    .mutation(async ({ctx, input}) => {
      const vUser = await ctx.db.user.findFirst({
        where: {
          username: input.vUsername,
        },
      });
      if (!vUser)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The user requested to follow does not exist.',
        });
      if (ctx.session.user.id === vUser.id) return;
      const existingFollow = await ctx.db.follow.findFirst({
        where: {
          followerId: vUser.id,
          followingId: ctx.session.user.id,
        },
      });
      if (existingFollow) {
        return await ctx.db.follow.delete({
          where: {
            id: existingFollow.id,
          },
        });
      } else {
        return await ctx.db.follow.create({
          data: {
            followerId: vUser.id,
            followingId: ctx.session.user.id,
          },
        });
      }
    }),

  checkIfFollowing: protectedProcedure
    .input(z.object({username: z.string().min(3).max(13)}))
    .query(async ({ctx, input}) => {
      const inputUser = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (!inputUser)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The requested user does not exist.',
        });
      const follow = await ctx.db.follow.findFirst({
        where: {
          followerId: inputUser.id,
          followingId: ctx.session.user.id,
        },
      });
      return !!follow;
    }),

  searchForUsers: protectedProcedure
    .input(z.object({username: z.string().min(1).max(13)}))
    .query(async ({ctx, input}) => {
      const matchingUsers = await ctx.db.user.findMany({
        where: {
          username: {
            contains: input.username,
          },
        },
        include: {
          followers: true,
          following: true,
        },
      });
      if (!matchingUsers.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No users found with that name.',
        });
      }
      return matchingUsers;
    }),

  editUserProfile: protectedProcedure
    .input(
      z.object({username: z.string().optional(), bio: z.string().optional()})
    )
    .mutation(async ({ctx, input}) => {
      const currentUser = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!currentUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found. You need to be signed in.',
        });
      }
      const existingUser = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (existingUser && existingUser.id !== currentUser.id) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This username is already taken.',
        });
      }
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
          bio: input.bio,
        },
      });
    }),
});
