import mitt from 'mitt';

type Events = {
  updateCart: void;
};

const eventBus = mitt<Events>();

export default eventBus;