<template>
  <div id="container">
    <div class="grid-settings">
      <input
        type="checkbox"
        id="allowFilter"
        name="filtering"
        v-model="filterVisibleProperty"
      />
      <label for="allowFilter">Фильтрация</label>
    </div>
    <div class="grid-settings">
      <input
        type="checkbox"
        id="allowSelection"
        name="selection"
        v-model="selectionVisibleProperty"
      />
      <label for="allowSelection">Мультистрочное выделение</label>
    </div>
    <div class="grid-settings">
      <input
        type="checkbox"
        id="allowSelectAll"
        name="selectAll"
        v-model="selectAllVisibleProperty"
      />
      <label for="allowSelectAll">Выделить все</label>
    </div>
    <div class="grid-settings">
      <input
        type="checkbox"
        id="allowPaging"
        name="paging"
        v-model="pagingVisibleProperty"
      />
      <label for="allowPaging">Пагинация</label>
    </div>
    <GridComponent @selectionChanged="showSelectedRowIds" />
    <div id="selected-ids">Id выделенных строк: {{ selectedIds }}</div>
  </div>
</template>

<script>
import GridComponent from "@/components/GridComponent.vue";

export default {
  name: "GridView",

  data() {
    let selectedIds = "";
    return { selectedIds };
  },

  components: {
    GridComponent,
  },

  computed: {
    filterVisibleProperty: {
      get() {
        return this.$store.getters.getBehaviorOptions.allowFiltering;
      },
      set(value) {
        this.$store.commit("enableFiltering", value);
      },
    },
    selectionVisibleProperty: {
      get() {
        return this.$store.getters.getBehaviorOptions.allowMultipleSelection;
      },
      set(value) {
        this.$store.commit("enableMultipleSelection", value);
      },
    },
    selectAllVisibleProperty: {
      get() {
        return this.$store.getters.getBehaviorOptions.allowSelectAll;
      },
      set(value) {
        this.$store.commit("enableSelectAll", value);
      },
    },
    pagingVisibleProperty: {
      get() {
        return this.$store.getters.getBehaviorOptions.allowPaging;
      },
      set(value) {
        this.$store.commit("enablePaging", value);
      },
    },
  },

  methods: {
    showSelectedRowIds(selectedRows) {
      this.selectedIds = selectedRows.join(", ");
    },
  },

  async mounted() {
    console.log(
      "process.env.VUE_APP_BACKEND_APP_URL: ",
      process.env.VUE_APP_BACKEND_APP_URL
    );
    console.log(
      "process.env.VUE_APP_BACKEND_APP_PORT: ",
      process.env.VUE_APP_BACKEND_APP_PORT
    );

    console.log("process.env: ", process.env);
  },
};
</script>

<style scoped>
#container {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.grid-settings {
  margin-bottom: 10px;
}

#selected-ids {
  margin-top: 50px;
}
</style>