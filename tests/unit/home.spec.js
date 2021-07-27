import { mount } from "@vue/test-utils";
// import flushPromises from 'flush-promises';
// import { render } from '@vue/server-test-utils';
import App from "@/views/Home.vue";
import LoadMore from "@/components/loadMore.vue";
import Loader from "@/components/loader.vue";
import Observer from "@/components/observer.vue";
import fetchMock from "jest-fetch-mock";

jest.mock("@/components/observer.vue");

describe("home page", () => {
  fetchMock.enableMocks();
  beforeEach(() => {
    fetchMock.mockReset();
  });
  it("rendering components", async () => {
    const wrapper = mount(App);
    // let videoListComponent = wrapper.findComponent(VideosList);
    let loadMoreComponent = wrapper.findComponent(LoadMore);
    let loaderComponent = wrapper.findComponent(Loader);
    let observerComponent = wrapper.findComponent(Observer);
    expect(loadMoreComponent.exists()).toBe(true);
    expect(loaderComponent.exists()).toBe(true);
    expect(observerComponent.exists()).toBe(true);
    expect(wrapper.vm.videosList).toStrictEqual([]);
  });
  it("Testing success case while calling API", async () => {
    fetch.mockReject(new Error("fake error message"));
    mount(App);

    expect(fetchMock.mock.calls.length).toBe(1);
  });
});
