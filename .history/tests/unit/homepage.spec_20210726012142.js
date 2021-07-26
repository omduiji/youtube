import App from '@/views/Home.vue';
// import { flushPromises } from '@vue/test-utils';
import { render } from '@vue/server-test-utils';
import { setupServer } from 'msw/node';
// import { rest } from 'msw';
// import { render } from '@testing-library/vue';
import '@testing-library/jest-dom';
import handlers from '../../src/mocks/handlers';
import fetchMock from 'jest-fetch-mock';
// import * as fetchers from '@/services/fetchers';

const server = setupServer(...handlers);
fetchMock.enableMocks();
jest.mock('@/components/observer.vue');

beforeEach(() => {
  fetch.resetMocks();
});

const fetchMessageSpy = jest.spyOn(App.methods, 'hydrateResponse');

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  fetchMessageSpy.mockClear();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('App', () => {
  it('calls fetchMessage once and displays a message', async () => {
    await render(App);
    // await flushPromises();
    expect(fetchMessageSpy).toHaveBeenCalledTimes(1);
  });

  // it('shows an error message on server error', async () => {
  //   server.use(
  //     rest.get('/message', (req, res, ctx) => {
  //       return res(ctx.status(500));
  //     })
  //   );
  //   render(App);
  //   await waitFor(() => {
  //     expect(screen.getByText('server error :(')).toBeInTheDocument();
  //   });
  //   expect(fetchMessageSpy).toHaveBeenCalledTimes(1);
  // });
});
