import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper functions for common queries
export const postHelpers = {
  // Get all published posts
  async getPublishedPosts() {
    return prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
  },

  // Get post by slug
  async getPostBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
  },

  // Get posts by category
  async getPostsByCategory(categorySlug: string) {
    return prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        categories: {
          some: {
            category: {
              slug: categorySlug,
            },
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
  },

  // Search posts
  async searchPosts(query: string) {
    return prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
  },
}

export const categoryHelpers = {
  // Get all categories
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  },

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    })
  },
}
