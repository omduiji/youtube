// import { mount } from '@vue/test-utils';
import App from '@/views/Home.vue';
// import LoadMore from '@/components/loadMore.vue';
// import Loader from '@/components/loader.vue';
// import Observer from '@/components/observer.vue';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
jest.mock('@/components/observer.vue');
describe('home page', () => {
  it('rendering components', async () => {
    // const wrapper = mount(homePage);
    // let videoListComponent = wrapper.findComponent(VideosList);
    // let loadMoreComponent = wrapper.findComponent(LoadMore);
    // let loaderComponent = wrapper.findComponent(Loader);
    // let observerComponent = wrapper.findComponent(Observer);
    // expect(loadMoreComponent.exists()).toBe(true);
    // expect(loaderComponent.exists()).toBe(true);
    // expect(observerComponent.exists()).toBe(true);
    // expect(wrapper.vm.videosList).toStrictEqual([]);
    fetch.mockResponseOnce(
      JSON.stringify(
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: {
              lat: '-37.3159',
              lng: '81.1496',
            },
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets',
          },
        },
        {
          id: 2,
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv',
          address: {
            street: 'Victor Plains',
            suite: 'Suite 879',
            city: 'Wisokyburgh',
            zipcode: '90566-7771',
            geo: {
              lat: '-43.9509',
              lng: '-34.4618',
            },
          },
          phone: '010-692-6593 x09125',
          website: 'anastasia.net',
          company: {
            name: 'Deckow-Crist',
            catchPhrase: 'Proactive didactic contingency',
            bs: 'synergize scalable supply-chains',
          },
        }
      )
    );
    let fn = jest.spyOn(App.methods, 'hydrateResponse');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
