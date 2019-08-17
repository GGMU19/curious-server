const { AuthenticationError } = require('apollo-server');
const db = require('../../models/index');

exports.roadmaps = async (obj, args, { user }) => {
  if (!user) throw new AuthenticationError('You must be logged in');
  if (args.id === String(user.id)) {
    const roadmaps = await db.Roadmaps.findAll({ where: { UserId: args.id } });
    return roadmaps;
  }
  throw new Error('incorrect user');
};

exports.topics = async (obj, args, { user }) => {
  if (!user) throw new AuthenticationError('You must be logged in');
  const topics = await db.Topics.findAll({ where: { RoadmapId: args.id } });
  return topics;
};

exports.allRoadmaps = async () => {
  const allRoadmaps = await db.Roadmaps.findAll();
  return allRoadmaps;
};
