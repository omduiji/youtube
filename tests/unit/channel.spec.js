import { mount } from "@vue/test-utils";
import App from "@/views/Channel.vue";
// import VideosList from '@/components/videosList.vue';

describe("cahnnel page", () => {
  it("rendering components", async () => {
    const wrapper = mount(App);
    // let videoListComponent = wrapper.findComponent(VideosList);

    expect(wrapper.vm.Playlists).toStrictEqual([]);
    expect(wrapper.vm.Videos).toStrictEqual([]);
  });
});
