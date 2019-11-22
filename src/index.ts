import { GraphQLServer } from 'graphql-yoga'
import {
  makeSchema,
  queryType,
  objectType,
  idArg,
  mutationType,
  stringArg,
} from 'nexus'
import { Photon } from '@generated/photon'

const photon = new Photon()

const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
    t.string('name', { nullable: true })
    t.string('email')
    t.list.field('posts', {
      type: 'Post',
      resolve: parent =>
        photon.users
          .findOne({
            where: { id: parent.id },
          })
          .posts(),
    })
  },
})

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.id('id')
    t.string('title')
    t.string('content', { nullable: true })
    t.boolean('published')
    t.field('author', {
      type: 'User',
      resolve: parent =>
        photon.posts
          .findOne({
            where: { id: parent.id },
          })
          .author(),
    })
  },
})

const Query = queryType({
  definition(t) {
    t.field('users', {
      type: 'User',
      list: true,
      resolve: () => photon.users.findMany(),
    })

    t.field('user', {
      type: 'User',
      nullable: true,
      args: { id: idArg() },
      resolve: (_, args) =>
        photon.users.findOne({
          where: { id: args.id },
        }),
    })

    t.list.field('feed', {
      type: 'Post',
      resolve: () =>
        photon.posts.findMany({
          where: { published: true },
        }),
    })
  },
})

const Mutation = mutationType({
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args: {
        name: stringArg({ nullable: true }),
        email: stringArg(),
      },
      resolve: (_, args) =>
        photon.users.create({
          data: {
            name: args.name,
            email: args.email,
          },
        }),
    })

    t.field('updateUser', {
      type: 'User',
      args: {
        id: idArg(),
        name: stringArg({ nullable: true }),
        email: stringArg({ nullable: true }),
      },
      resolve: (_, args) =>
        photon.users.update({
          where: { id: args.id },
          data: {
            name: args.name,
            email: args.email,
          },
        }),
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg({ nullable: true }),
        authorEmail: stringArg(),
      },
      resolve: (_, args) =>
        photon.posts.create({
          data: {
            title: args.title,
            content: args.content,
            author: {
              connect: {
                email: args.authorEmail,
              },
            },
          },
        }),
    })

    t.field('publish', {
      type: 'Post',
      args: {
        postId: idArg(),
      },
      resolve: (_, args) =>
        photon.posts.update({
          where: { id: args.postId },
          data: { published: true },
        }),
    })
  },
})

const schema = makeSchema({
  types: [Query, Mutation, User, Post],

  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },

  nonNullDefaults: {
    input: true,
    output: true,
  },
})

const server = new GraphQLServer({ schema })
server.start(() => console.log(`Server running on http://localhost:4000`))
