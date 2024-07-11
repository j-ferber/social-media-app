import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {createTRPCRouter, protectedProcedure} from '~/server/api/trpc';

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(z.object({postId: z.string(), text: z.string()}))
    .mutation(async ({ctx, input}) => {
      const postId = Number(input.postId);
      const post = await ctx.db.post.findFirst({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }
      return await ctx.db.comment.create({
        data: {
          comment: input.text,
          postId: postId,
          userId: ctx.session.user.id,
        },
      });
    }),

  getPostComments: protectedProcedure
    .input(z.object({postId: z.string()}))
    .query(async ({ctx, input}) => {
      const postId = Number(input.postId);
      const comments = await ctx.db.comment.findMany({
        where: {
          postId: postId,
        },
        include: {
          user: true,
          commentLikes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return comments.map(comment => ({
        ...comment,
        isLikedByCurrentUser: comment.commentLikes.some(
          like => like.userId === ctx.session.user.id
        ),
        createdByCurrentUser: comment.userId === ctx.session.user.id,
      }));
    }),

  likeComment: protectedProcedure
    .input(z.object({commentId: z.number()}))
    .mutation(async ({ctx, input}) => {
      const existingComment = await ctx.db.comment.findFirst({
        where: {
          id: input.commentId,
        },
      });
      if (!existingComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }
      const existingLike = await ctx.db.commentLikes.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.session.user.id,
        },
      });
      if (!existingLike) {
        await ctx.db.commentLikes.create({
          data: {
            commentId: input.commentId,
            userId: ctx.session.user.id,
          },
        });
      } else {
        await ctx.db.commentLikes.delete({
          where: {
            id: existingLike.id,
          },
        });
      }
    }),

  deleteComment: protectedProcedure
    .input(z.object({commentId: z.number()}))
    .mutation(async ({ctx, input}) => {
      const existingComment = await ctx.db.comment.findFirst({
        where: {
          id: input.commentId,
        },
      });
      if (!existingComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }
      if (existingComment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this comment',
        });
      }
      return await ctx.db.comment.delete({
        where: {
          id: input.commentId,
        },
      });
    }),
});
