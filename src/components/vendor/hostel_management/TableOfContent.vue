<template>
  <v-navigation-drawer
    id="default-toc"
    v-scroll="onScroll"
    app
    class="py-4 pr-3"
    floating
    width="256"
    disable-resize-watcher="true"
  >
    <ul class="mb-6">
      <router-link
        v-for="({ to, text }, i) in toc"
        :key="text"
        #default="{ href, isActive }"
        :to="to"
      >
        <li
          :class="{
            'primary--text router-link-active': isActive,
            'text--disabled': !isActive,
          }"
          class="pl-3 text-body-2 py-1 font-weight-regular"
        >
          <a
            :href="href"
            class="v-toc-link d-block transition-swing text-decoration-none"
            @click.prevent.stop="onClick(to, i)"
            v-text="text"
          />
        </li>
      </router-link>
    </ul>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'TableOfContent',
  data: () => ({}),
  props: ['toc'],
  methods: {
    async onClick(hash, i) {
      console.log(i);
      if (this.hash === hash) return;

      this.scrolling = true;

      this.$router.replace({ path: this.path, hash });

      await this.$vuetify.goTo(hash);
      // await wait(200);

      this.scrolling = false;
    },
    setOffsets() {
      const offsets = [];
      const toc = this.toc.slice().reverse();
      // eslint-disable-next-line
      for (const item of toc) {
        const section = document.getElementById(item.to.slice(1));

        if (section) {
          offsets.push(section.offsetTop - 48);
        }
      }

      this.offsets = offsets;
    },
    async findActiveIndex() {
      if (this.$vuetify.breakpoint.mobile) return;

      const currentOffset = window.pageYOffset || document.documentElement.offsetTop || 0;

      // If we are at the top of the page
      // reset the offset
      if (currentOffset === 0) {
        if (this.hash) {
          this.$router.replace({ path: this.path });
        }

        return;
      }

      if (this.offsets.length !== this.toc.length) this.setOffsets();

      const index = this.offsets.findIndex((offset) => offset < currentOffset);

      let tindex = index > -1 ? this.offsets.length - 1 - index : 0;

      if (currentOffset + window.innerHeight === document.documentElement.offsetHeight) {
        tindex = this.toc.length - 1;
      }

      const hash = this.toc[tindex].to;

      if (hash === this.hash) return;

      this.scrolling = true;

      await this.$router.replace({
        path: this.path,
        hash,
      });

      this.scrolling = false;
    },
    onScroll() {
      clearTimeout(this.timeout);

      if (this.scrolling || !this.toc.length) return;

      this.timeout = setTimeout(this.findActiveIndex, 17);
    },
  },
};
</script>
