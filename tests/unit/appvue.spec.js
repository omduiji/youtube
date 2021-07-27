import { shallowMount } from '@vue/test-utils';
import app from '@/App.vue';
import Header from '@/components/header.vue';

describe('render header', () => {
  it('renders header component', () => {
    const wrapper = shallowMount(app, {
      mocks: { $route: { name: 'Home' } },
    });

    let headerComponent = wrapper.findComponent(Header);
    expect(headerComponent.exists()).toBe(true);
  });
});
// describe('testing emitted events', () => {
//   it('gets emitted event', async () => {
//     const wrapper = shallowMount(app);
//     wrapper.vm.$emit('getParams');
//     await wrapper.vm.$nextTick();
//     expect(wrapper.emitted().getParams).toBeTruthy();
//   });
// });
