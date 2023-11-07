// TODO: update user with all fields
const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    //working with auth
    users: async () => {
      return await User.find({}).populate("friends");
    },
  },
  Mutation: {
    //working with auth
    addUser: async (parent, { user }) => {
      const userdata = await User.create({ ...user });
      const token = signToken(userdata);
      return { token };
    },
    // wroking with auth
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw AuthenticationError;
      }

      const passwordCheck = await user.isCorrectPassword(password);

      if (!passwordCheck) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token };
    },
    //working with auth
    updateUser: async (parent, { criteria }, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $set: criteria },
          { new: true, runValidators: true }
        );
      }
    },
    //working with auth
    deleteUser: async (parent, args, context) => {
      console.log(context.user);
      if (context.user) {
        return User.findOneAndDelete({ _id: context.user._id });
      }
    },
    // addFriend: async (parent, { userId }, context) => {
    //   if (context) {
    //     console.log("context.id: ", context._id);
    //     return await User.findOneAndUpdate(
    //       { _id: context._id },
    //       { $addToSet: { friends: userId } },
    //       { new: true, runValidators: true }
    //     );
    //   }
    // },
    // deleteFriend: async (parent, { userId }, context) => {
    //   if (context) {
    //     return User.findOneAndUpdate(
    //       { _id: context._id },
    //       { $pull: { friends: userId } },
    //       { new: true }
    //     );
    //   }
    // },
  },
};

module.exports = resolvers;
