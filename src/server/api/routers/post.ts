import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({text: z.string()}))
    .query(({input}) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: protectedProcedure.query(({ctx}) => {
    return ctx.db.post.findFirst({
      orderBy: {createdAt: 'desc'},
      where: {createdBy: {id: ctx.session.user.id}},
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),

  createMedia: protectedProcedure
    .input(z.object({url: z.string()}))
    .mutation(async ({ctx, input}) => {
      const splitURL = input.url.split('?')[0];
      if (splitURL === undefined) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Invalid URL',
        });
      }
      const newPost = await ctx.db.media.create({
        data: {
          url: splitURL,
          createdById: ctx.session.user.id,
        },
      });
      return newPost.id;
    }),

  createPost: protectedProcedure
    .input(z.object({mediaId: z.number(), caption: z.string()}))
    .mutation(async ({ctx, input}) => {
      const media = await ctx.db.media.findFirst({
        where: {
          id: input.mediaId,
        },
      });
      if (!media) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Media not found',
        });
      }
      if (media.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'You do not have permission to create a post with this media',
        });
      }
      return await ctx.db.post.create({
        data: {
          mediaId: media.id,
          caption: input.caption,
          createdById: ctx.session.user.id,
        },
      });
    }),

  getMediaURL: protectedProcedure
    .input(z.object({mediaId: z.number()}))
    .query(async ({ctx, input}) => {
      const media = await ctx.db.media.findFirst({
        where: {
          id: input.mediaId,
        },
      });
      if (!media) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Media not found',
        });
      }
      return media.url;
    }),

  getPostData: protectedProcedure
    .input(z.object({postId: z.number()}))
    .query(async ({ctx, input}) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.postId,
        },
        include: {
          media: true,
          createdBy: true,
          likes: true,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      const userLiked = post.likes.some(
        like => like.userId === ctx.session.user.id
      );

      return {
        ...post,
        userLiked,
        createdByCurrentUser: post.createdById === ctx.session.user.id,
      };
    }),

  likePost: protectedProcedure
    .input(z.object({postId: z.number()}))
    .mutation(async ({ctx, input}) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.postId,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }
      const existingLike = await ctx.db.likes.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      if (!existingLike) {
        await ctx.db.likes.create({
          data: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        });
      } else {
        await ctx.db.likes.delete({
          where: {
            id: existingLike.id,
          },
        });
      }
    }),

    updatePost: protectedProcedure
      .input(z.object({postId: z.number(), caption: z.string()}))
      .mutation(async ({ctx, input}) => {
        const post = await ctx.db.post.findFirst({
          where: {
            id: input.postId
          }
        })
        if (!post) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found'
          })
        }
        if (post.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this post'
          })
        }
        return await ctx.db.post.update({
          where: {
            id: input.postId
          }, 
          data: {
            caption: input.caption
          }
        })
      })
});
