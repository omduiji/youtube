import App from '@/views/Home.vue';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { render, screen, waitFor } from '@testing-library/vue';
import '@testing-library/jest-dom';
import handlers from '../../src/mocks/handlers';
import fetchMock from 'jest-fetch-mock';
// import * as fetchers from '@/services/fetchers';

const server = setupServer(...handlers);
fetchMock.enableMocks();
beforeEach(() => {
  fetch.resetMocks();
});

const fetchMessageSpy = jest.spyOn(App.methods, 'getVideos');

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
    render(App);
    expect(fetchMessageSpy).toHaveBeenCalledTimes(1);
  });

  it('shows an error message on server error', async () => {
    server.use(
      rest.get('/message', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    render(App);
    await waitFor(() => {
      expect(screen.getByText('server error :(')).toBeInTheDocument();
    });
    expect(fetchMessageSpy).toHaveBeenCalledTimes(1);
  });
});
