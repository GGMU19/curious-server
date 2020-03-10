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

  ChecklistItems: {
    create: jest.fn(),
    update: jest.fn(),
  },

}));

describe('Mutations', () => {
  describe('createTopic', () => {
    it('should create & return the new topic, given valid input', async () => {
      // Given
      const createTopicInput = { title: 'cool title', rowNumber: 5, RoadmapId: 42 };
      // const expectedResult = { name: 'bob' };
      fakeDb.Topics.findAll.mockResolvedValue({});
      fakeDb.Topics.create.mockResolvedValue({ dataValues: createTopicInput });

      // When
      const result = await mutations.createTopic(null, createTopicInput);

      // Then
      expect(result).toEqual({ ...createTopicInput, checklist: [] });
      expect(fakeDb.Topics.create).toHaveBeenCalledWith(createTopicInput);
    });
  });

  describe('createRoadmap', () => {
    it('should create & return the new roadmap, given a valid input', async () => {
      // Given
      const createRoadmapInput = { UserId: 'id', title: 'title', category: 'category' };
  
      fakeDb.Roadmaps.create.mockResolvedValue({ dataValues: createRoadmapInput });

      // When
      const result = await mutations.createRoadmap(null, createRoadmapInput);

      // Then
      expect(result).toEqual({ ...createRoadmapInput, topics: [] });
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
        fakeDb.Roadmaps.update.mockResolvedValue([1, [{ dataValues: updateRoadmapInput }]]);

        //  When
        const result = await mutations.updateRoadmap(null, { id: 'id', ...updateRoadmapInput });

        //  Then
        expect(fakeDb.Roadmaps.update).toHaveBeenCalledWith(updateRoadmapInput, { where: { id: 'id' }, returning: true });
        expect(result).toEqual({ ...updateRoadmapInput });
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
        //  below is passed the return value of the function
        fakeDb.Topics.update.mockResolvedValue([1, [{ dataValues: args }]]);
        // When
        //below is passed the actual values the function takes
        const result = await mutations.updateTopic(null, { id: 'id', ...updateTopicInput });
        //  Then
        //  check that update has been called with the correct values
        expect(fakeDb.Topics.update).toHaveBeenCalledWith(updateTopicInput, { where: { id: 'id' }, returning: true });
        //  check that updateTopic is returning the correct value
        expect(result).toEqual({ ...updateTopicInput });
      });
    });


    describe('deleteTopic', () => {
      it('delete topic and return id', async () => {
        // Given
        const id = 'id';
        // also worksfakeDb.Topics.destroy.mockResolvedValue({});
        // accepts anything other than undefined or null
        fakeDb.Topics.destroy.mockResolvedValue('id');
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

    describe('createChecklistItem', () => {
      it('should create a checklist item given a valid input', async () => {
        // Given        
        const createChecklistItemInput = { TopicId: 'id', title: 'title' };
        fakeDb.ChecklistItems.create.mockResolvedValue({ dataValues: createChecklistItemInput });
        // When
        const result = await mutations.createChecklistItem(null, createChecklistItemInput);
        // Then
        expect(fakeDb.ChecklistItems.create).toHaveBeenCalledWith(createChecklistItemInput)
        expect(result).toEqual({ ...createChecklistItemInput })
      })
      it("should throw Error: 'Could not create ChecklistItem'", async () => {
        // Given
        const createChecklistItemInput = { TopicId: undefined, title: undefined };
        fakeDb.ChecklistItems.create.mockResolvedValue(null, undefined);
        try {
          await mutations.createChecklistItem(null, createChecklistItemInput)
        } catch (err) {
          expect(err.toString()).toEqual('Error: Could not create ChecklistItem')
        }
      })
    })

    describe('updateChecklistItem', () => {
      it('should update ChecklistItem given a valid input', async () => {
        // Given
        const id = 'id';
        const updateChecklistItemInput = { title: 'title', completed: Boolean };
        fakeDb.ChecklistItems.update.mockResolvedValue([1, [{ dataValues: updateChecklistItemInput }]])

        // Then
        const result = await mutations.updateChecklistItem(null, { id: 'id', ...updateChecklistItemInput} );

        // When
        expect(fakeDb.ChecklistItems.update).toHaveBeenCalledWith(updateChecklistItemInput,
          { where: { id }, returning: true })
        expect(result).toEqual({ ...updateChecklistItemInput })
      })
    })
  });
});

