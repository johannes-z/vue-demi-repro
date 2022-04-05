<template>
  <div>
    <div
      v-bind="containerProps"
      ref="containerRef"
      @scroll="containerProps.onScroll"
    >
      <div v-bind="wrapperProps">
        <div v-for="item in list" :key="item.index">
          {{ item.data }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { h, defineComponent } from '@vue/composition-api';
import { useVirtualList } from '@vueuse/core';

export default defineComponent({
  setup() {
    const data = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }];

    const { list, containerProps, wrapperProps } = useVirtualList(data, {
      itemHeight: 30,
    });

    return {
      list,
      containerProps,
      containerRef: containerProps.ref,
      wrapperProps,
    };
  },
});
</script>
