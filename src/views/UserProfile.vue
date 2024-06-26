<template>
  <div class="profile-page" v-if="userProfile">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img class="user-img" :src="userProfile.image" />
            <h4>{{ userProfile.username }}</h4>
            <p>{{ userProfile.bio }}</p>
            <div>
              <span>
                <mcv-add-to-follow
                  v-if="currentUser && !isCurrentUserProfile"
                  :is-followed="userProfile.following"
                  :profile-slug="userProfile.username"
                />
                <router-link
                  v-if="isCurrentUserProfile"
                  class="btn btn-sm btn-outline-secondary action-btn"
                  :to="{ name: 'settings' }"
                >
                  Edit Profile Settings
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="article-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <router-link
                  :to="{
                    name: 'userProfile',
                    params: { slug: userProfile.username },
                  }"
                  class="nav-link"
                  :class="{ active: routeName === 'userProfile' }"
                >
                  My Posts
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{
                    name: 'userProfileFavorites',
                    params: { slug: userProfile.username },
                  }"
                  class="nav-link"
                  :class="{ active: routeName === 'userProfileFavorites' }"
                >
                  Favorites Posts
                </router-link>
              </li>
              <li v-if="isCurrentUserProfile" class="nav-item">
                <router-link
                  :to="{
                    name: 'userFollowedAuthors',
                    params: { slug: userProfile.username },
                  }"
                  class="nav-link"
                  :class="{ active: routeName === 'userFollowedAuthors' }"
                >
                  Followed Authors
                </router-link>
              </li>
            </ul>
          </div>
          <mcv-feed
            v-if="routeName != 'userFollowedAuthors'"
            :api-url="apiUrl"
          ></mcv-feed>
          <mcv-followed-authors v-if="routeName === 'userFollowedAuthors'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { actionTypes as userProfileActionTypes } from "@/store/modules/userProfile.js";
import { getterTypes as authGetterTypes } from "@/store/modules/auth.js";
import McvFeed from "@/components/Feed.vue";
import McvAddToFollow from "@/components/AddToFollow.vue";
import McvFollowedAuthors from "@/components/FollowedAuthors.vue";

export default {
  name: "McvUserProfile",
  components: {
    McvFeed,
    McvAddToFollow,
    McvFollowedAuthors,
  },
  computed: {
    ...mapState({
      userProfile: (state) => state.userProfile.data,
      isLoading: (state) => state.userProfile.isLoading,
      error: (state) => state.userProfile.error,
    }),
    ...mapGetters({
      currentUser: authGetterTypes.currentUser,
    }),
    isCurrentUserProfile() {
      if (!this.currentUser || !this.userProfile) {
        return false;
      }
      return this.currentUser.username === this.userProfile.username;
    },
    apiUrl() {
      const isFavorites = this.$route.path.includes("favorites");
      return isFavorites
        ? `/articles?favorited=${this.userProfileSlug}`
        : `/articles?author=${this.userProfileSlug}`;
    },
    userProfileSlug() {
      return this.$route.params.slug;
    },
    routeName() {
      return this.$route.name;
    },
  },
  watch: {
    userProfileSlug: "fetchUserProfileFeed",
  },
  created() {
    this.fetchUserProfileFeed();
  },
  methods: {
    fetchUserProfileFeed() {
      this.$store.dispatch(userProfileActionTypes.getUserProfile, {
        slug: this.userProfileSlug,
      });
    },
  },
};
</script>
