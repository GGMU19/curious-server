const mutations = require('./mutations.resolvers');
const fakeDb = require('../../models/index');

jest.mock('../../models/index', () => ({
  Topics: {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },

  Roadmaps: {
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Mutations', () => {
  describe('createTopic', () => {
    it('should create & return the new topic, given valid input', async () => {
      // Given
      const createTopicInput = { title: 'cool title', rowNumber: 5, RoadmapId: 42 };
      const expectedResult = { name: 'bob' };
      fakeDb.Topics.findAll.mockResolvedValue([]);
      fakeDb.Topics.create.mockResolvedValue({ dataValues: expectedResult });

      // When
      const result = await mutations.createTopic(null, createTopicInput);

      // Then
      expect(result).toEqual({ ...expectedResult, checklist: [] });
      expect(fakeDb.Topics.create).toHaveBeenCalledWith(createTopicInput);
    });
  });

  describe('createRoadmap', () => {
    it('should create & return the new roadmap, given a valid input', async () => {
      // Given
      const createRoadmapInput = { UserId: 'id', title: 'title', category: 'category' };
      // const expectedRoadmapResult = { dataValues: {} };
      const dataValues = { data: 'dataValues' };
      fakeDb.Roadmaps.create.mockResolvedValue({ dataValues });

      // When
      const result = await mutations.createRoadmap(null, createRoadmapInput);

      // Then
      expect(result).toEqual({ ...dataValues, topics: [] });
      expect(fakeDb.Roadmaps.create).toHaveBeenCalledWith(createRoadmapInput);
    });
  });

  describe('deleteRoadmap', () => {
    it('should delete Roadmaps given valid input & return id', async () => {
      // Given

      const id = 'id';
      fakeDb.Roadmaps.destroy.mockResolvedValue({});
      // When
      const result = await mutations.deleteRoadmap(null, { id });
      // Then
      expect(fakeDb.Roadmaps.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(id);
    });

    it('should throw Error "Roadmap does not exist"', async () => {
      // Given
      const deleteRoadmapInput = { id: undefined };
      fakeDb.Roadmaps.destroy.mockResolvedValue(undefined);
      // When
      try {
        await mutations.deleteRoadmap(null, deleteRoadmapInput);
      } catch (err) {
        expect(err.toString()).toEqual('Error: Roadmap does not exist');
      }
    });

    describe('updateRoadmap', () => {
      it('should update & return road map, given valid input', async () => {
        //  Given
        const updateRoadmapInput = { title: 'title', category: 'category' };
        fakeDb.Roadmaps.update.mockResolvedValue([null, [{ dataValues: {} }]]);

        //  When
        const result = await mutations.updateRoadmap(null, { id: 'id', ...updateRoadmapInput });

        //  Then
        expect(fakeDb.Roadmaps.update).toHaveBeenCalledWith(updateRoadmapInput, { where: { id: 'id' }, returning: true });
        expect(result).toEqual({ ...updateRoadmapInput.dataValues });
      });
    });

    describe('updateTopic', () => {
      it('should update & return topic', async () => {
      // Given
        const args = {
          title: 'title',
          description: 'description',
          resources: 'resources',
          completed: Boolean,
          rowNumber: 5,
        };
        const updateTopicInput = args;
        fakeDb.Topics.update.mockResolvedValue([null, [{ dataValues: {} }]]);
        // When
        const result = await mutations.updateTopic(null, { id: 'id', ...updateTopicInput });

        //  Then
        expect(fakeDb.Topics.update).toHaveBeenCalledWith(updateTopicInput, { where: { id: 'id' }, returning: true });
        expect(result).toEqual({ ...updateTopicInput.dataValues });
      });
    });

    describe('deleteTopic', () => {
      it('delete topic and return id', async () => {
        // Given
        const id = 'id';
        fakeDb.Topics.destroy.mockResolvedValue({});
        // When
        const result = await mutations.deleteTopic(null, { id });
        // Then
        expect(fakeDb.Topics.destroy).toHaveBeenCalledWith({ where: { id } });
        expect(result).toEqual(id);
      });
      it("return throw new Error('Topic does not exist') if id undefined", async () => {
        const deleteTopicInput = { id: undefined };
        fakeDb.Topics.destroy.mockResolvedValue(undefined);
        try {
          await mutations.deleteTopic(null, deleteTopicInput);
        } catch (err) {
          expect(err.toString()).toEqual('Error: Topic does not exist');
        }
      });
    });
  });
});
