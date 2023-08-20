const { User, Area, Task, Product, Order } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')

const resolvers = {
  Query: {
    users: async () => {
      try {
        return User.find()
          .populate('area')
          .populate('tasks')
          .populate({ path: 'area', populate: 'users' });
      } catch (err) {
        console.log(err);
      }
    },
    user: async (parent, { id }) => {
      try {
        return User.findById(id).populate('tasks').populate('area');
      } catch (err) {
        console.log(err);
      }
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate('tasks')
          .populate('area')
          .populate({ path: 'area', populate: 'users' });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    areas: async () => {
      try {
        return Area.find().populate('users').populate('supervisor');
      } catch (err) {
        console.log(err);
      }
    },
    area: async (parent, { _id }) => {
      try {
        return Area.findById(_id)
          .populate('users')
          .populate('supervisor')
          .populate({ path: 'users', populate: 'tasks' });
      } catch (err) {
        console.log(err);
      }
    },
    tasks: async () => {
      try {
        return Task.find().populate('user');
      } catch (err) {
        console.log(err);
      }
    },
    task: async (parent, { _id }) => {
      try {
        return Task.findById(_id).populate('user');
      } catch (err) {
        console.log(err);
      }
    },

    products: async (parent, { name }) => {
      const params = {};

      if (name) {
        params.name = {
          $regex: name,
        };
      }

      return await Product.find(params).populate('name');
    },

    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      // We map through the list of products sent by the client to extract the _id of each item and create a new Order.
      await Order.create({ products: args.products.map(({ _id }) => _id) });
      const line_items = [];

      for (const product of args.products) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },




  },
  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError(
            'No user found with this email address'
          );
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },
    forgotPassword: async (parents, { email, password }) => {
      try {
        const user = await User.findOneAndUpdate(
          { email: email },
          { password: password },
          { runValidators: true, new: true }
        );
        const token = signToken(user);
        return { user, token };
      } catch (err) {
        console.log(err);
      }
    },
    addArea: async (parent, { name, supervisorID }) => {
      try {
        const newArea = await Area.create({
          name,
          supervisor: supervisorID,
        });
        const populatedArea = await Area.findById(newArea._id)
          .populate('supervisor')
          .populate('users');

        return populatedArea;
      } catch (err) {
        console.log(err);
      }
    },
    addUser: async (
      parent,
      { firstName, lastName, isEmployee, email, password, area, userIcon }
    ) => {
      const user = await User.create({
        firstName,
        lastName,
        isEmployee,
        email,
        password,
        area,
        userIcon,
      });
      const token = signToken(user);
      return { token, user };
    },
    AddUserArea: async (parent, { user, area }) => {
      const userAreaUpdated = await User.findByIdAndUpdate(
        { _id: user },
        { $set: { area: area } },
        { new: true }
      ).populate('area');

      return userAreaUpdated;
    },
    addTask: async (parent, { taskDesc, name, isCompleted, user }, context) => {
      try {
        const newTask = await Task.create({
          taskDesc,
          name,
          isCompleted,
          user,
        });
        const populatedTask = await Task.findOne({ _id: newTask._id }).populate(
          'user'
        );
        updatedUser = await User.findOneAndUpdate(
          { _id: user },
          { $addToSet: { tasks: newTask._id } },
          { new: true }
        ).populate('tasks');
        return populatedTask;
      } catch (err) {
        console.log(err);
      }
    },
    removeTask: async (parent, { taskId }, context) => {
      try {
        const deleteTask = await Task.findOneAndDelete({
          _id: taskId,
        });
        return deleteTask;
      } catch (err) {
        console.log(err);
      }
    },
    removeUser: async (parent, { userId }, context) => {
      try {
        const deleteUser = await User.findOneAndDelete({
          _id: userId,
        });
        return deleteUser;
      } catch (err) {
        console.log(err);
      }
    },
    removeArea: async (parent, { areaId }, context) => {
      try {
        const deleteArea = await Area.findOneAndDelete({
          _id: areaId,
        });
      } catch (err) {
        console.log(err);
      }
    },

    addOrder: async (parent, { products }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, {
          $push: { orders: order },
        });

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
};

module.exports = resolvers;

/*

Mutation: {
  addUser: async (
    parent,
    { firstName, lastName, isEmployee, email, password }
  ) => {
    const user = await User.create({
      firstName,
      lastName,
      isEmployee,
      email,
      password,
    });
    const token = signToken(user);
    return { token, user };
  },
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('No user found with this email address');
    }
    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      throw new AuthenticationError('Incorrect credentials');
    }
    const token = signToken(user);
    return { token, user };
  },
  saveTask: async (parent, { taskDesc , name, isCompleted,  user}, context) => {
   // if (context.user) {
      const newTask = await Task.create( {
        taskDesc, name, isCompleted, user})


        const populatedTask = await Task.findOne({ _id: newTask._id }).populate('user')

        updatedUser = await User.findOneAndUpdate(
          { _id: user}, 
          { $addToSet: {tasks: newTask._id } },
          { new: true}, 
        )

    return  populatedTask;
    },

  throw new AuthenticationError("You must be logged in to assign tasks")
  } removeTask: async (parent, { taskId }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { taskId } } },
        { new: true }
      );
      return updatedUser;
    }
    throw new AuthenticationError('Error when deleting task');
  },
  forgotPassword: async (parents, { email, password }) => {
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: password },
      { runValidators: true, new: true }
    );
    const token = signToken(user);
    return { user, token };
  },
},
};*/
