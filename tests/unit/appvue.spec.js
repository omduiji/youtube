import { mount } from '@vue/test-utils';
import app from '@/App.vue';
import Header from '@/components/header.vue';

describe('app.vue', () => {
  it('renders header component', () => {
    const wrapper = mount(app);
    let headerComponent = wrapper.findComponent(Header);
    expect(headerComponent.exists()).toBe(true);
  });
});
describe('app.vue', () => {
  it('gets emitted event', async () => {
    const wrapper = mount(app);
    wrapper.vm.$emit('getParams');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().getParams).toBeTruthy();
  });
});
