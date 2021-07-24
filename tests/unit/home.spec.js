import { mount } from '@vue/test-utils';
import homePage from '@/views/Home.vue';
// import VideosList from '@/components/videosList.vue';
import LoadMore from '@/components/loadMore.vue';
import Loader from '@/components/loader.vue';
import Observer from '@/components/observer.vue';
// import { shallowMount } from '@vue/test-utils';
jest.mock('@/components/observer.vue');
describe('home page', () => {
  it('rendering components', async () => {
    const wrapper = mount(homePage);
    // let videoListComponent = wrapper.findComponent(VideosList);
    let loadMoreComponent = wrapper.findComponent(LoadMore);
    let loaderComponent = wrapper.findComponent(Loader);
    let observerComponent = wrapper.findComponent(Observer);
    expect(loadMoreComponent.exists()).toBe(true);
    expect(loaderComponent.exists()).toBe(true);
    expect(observerComponent.exists()).toBe(true);
    expect(wrapper.vm.videosList).toStrictEqual([]);
  });
});
