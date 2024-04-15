<template>
  <div class="article-page">
    <div class="banner">
      <div class="container" v-if="article">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <router-link
            :to="{
              name: 'userProfile',
              params: { slug: article.author.username },
            }"
          >
            <img :src="article.author.image" />
          </router-link>
          <div class="info">
            <router-link
              :to="{
                name: 'userProfile',
                params: { slug: article.author.username },
              }"
            >
              {{ article.author.username }}
            </router-link>
            <span class="date">{{ article.createdAt }}</span>
          </div>
          <span v-if="isAuthor">
            <router-link
              class="btn btn-outline-secondary btn-sm"
              :to="{ name: 'editArticle', params: { slug: article.slug } }"
            >
              <i class="ion-edit" />
              Edit Article
            </router-link>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteArticle"
            >
              <i class="ion-trash-a" />
              Delete Article
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="container page">
      <McvLoading v-if="isLoading" />
      <McvErrorMessage v-if="isLoading" :message="error" />
      <div class="row article-content" v-if="article">
        <div class="col-xs-12">
          <div>
            <p>{{ article.body }}</p>
          </div>
          <McvTags :article="article" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { actionTypes as articleActionTypes } from "@/store/modules/article.js";
  import { getterTypes as authGetterTypes } from "@/store/modules/auth.js";
  import { mapState } from "vuex";
  import { mapGetters } from "vuex";
  import McvLoading from "@/components/Loading.vue";
  import McvErrorMessage from "@/components/ErrorMessage.vue";
  import McvTags from "@/components/Tags.vue";
  export default {
    name: "McvArticleView",
    components: {
      McvLoading,
      McvErrorMessage,
      McvTags,
    },
    computed: {
      ...mapState({
        isLoading: (state) => state.article.isLoading,
        article: (state) => state.article.data,
        error: (state) => state.article.error,
      }),
      ...mapGetters({
        currentUser: authGetterTypes.currentUser,
        // isLoggedIn: authGetterTypes.isLoggedIn,
        // isAnonymous: authGetterTypes.isAnonymous,
      }),
      isAuthor() {
        if (!this.currentUser || !this.article) {
          return false;
        }
        return this.currentUser.username === this.article.author.username;
      },
    },
    mounted() {
      this.$store.dispatch(articleActionTypes.getArticle, {
        slug: this.$route.params.slug,
      });
    },
    methods: {
      deleteArticle() {
        this.$store
          .dispatch(articleActionTypes.deleteArticle, {
            slug: this.$route.params.slug,
          })
          .then(() => {
            this.$route.push({ name: "globalFeed" });
          });
      },
    },
  };
</script>