const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    isEmployee: Boolean
    progress: Int
    userIcon: String
    area: Area
    tasks: [Task]
  }
  type Area {
    _id: ID
    name: String
    supervisor: User
    progress: Int
    users: [User]
  }
  type Task {
    _id: ID
    name: String
    taskDesc: String
    createdAt: String
    isCompleted: Boolean
    user: User
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    users: [User]
    user(email: String!): User
    me: User
    areas: [Area]
    area(_id: ID): Area
    tasks: [Task]
    task(_id: ID): Task
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    forgotPassword(email: String!, password: String!): Auth
    addUser(
      firstName: String!
      lastName: String!
      isEmployee: Boolean!
      email: String!
      password: String!
    ): Auth
    addTask(
      name: String!
      taskDesc: String!
      isCompleted: Boolean!
      user: ID!
    ): User
    addArea(name: String!, supervisorID: String!): Area
    removeTask(taskId: ID!): User
    removeUser(userId: ID!): User
    removeArea(areaId: ID!): Area
  }
`;
module.exports = typeDefs;
