<template>
  <div>
    <McvTopBar />
    <router-view />
  </div>
</template>

<script>
import McvTopBar from "@/components/TopBar.vue";
import { actionTypes } from "@/store/modules/auth.js";

export default {
  name: "McvApp",
  components: { McvTopBar },

  mounted() {
    this.$store.dispatch(actionTypes.getCurrentUser);
  },
};
</script>
