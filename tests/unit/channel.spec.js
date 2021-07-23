import { mount } from '@vue/test-utils';
import app from '@/views/channel.vue';
import VideosList from '@/components/videosList.vue';

describe('channel page', () => {
  it('renders videilist component', () => {
    const wrapper = mount(app);
    let headerComponent = wrapper.findComponent(VideosList);
    expect(headerComponent.exists()).toBe(true);
  });
});
