<template>
  <table>
    <tbody>
      <tr>
        <span style="float: left;">
          <td id="select-container">
            <select v-model="pageSize" @change="$emit('pagingDataChanged')">
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </td>
          <td id="total-row-count-container">
            <span>({{ totalRowCount }})</span>
          </td>
        </span>        
        <span style="float: right;">
          <td id="first-page-container">
            <span class="pointer" @click="goToTheFirstPage()">&Lt;</span>
          </td>
          <td id="previous-page-container">
            <span class="pointer" @click="goToThePreviousPage()"> &lt;</span>
          </td>
          <td id="current-page-container">
            <input
              type="text"
              v-model="pageNumber"
              @keyup.enter="onPageNumberKeyUpEnter()"
            />
          </td>
          <td id="total-page-count-container">
            из
            <span class="pointer" @click="goToTheLastPage()">{{
              totalPageCount
            }}</span>
          </td>
          <td id="next-page-container">
            <span class="pointer" @click="goToTheNextPage()">&gt;</span>
          </td>
        </span>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "PagingComponent",

  emits: ["pagingDataChanged"],

  computed: {
    totalRowCount() {
      return this.$store.getters.dataGridRowsCount;
    },
    totalPageCount() {
      let integerQuotient = Math.floor(
        this.$store.getters.dataGridRowsCount / this.$store.getters.pageSize
      );

      let remainder =
        this.$store.getters.dataGridRowsCount % this.$store.getters.pageSize;

      if (remainder) return integerQuotient + 1;
      else return integerQuotient;
    },
    pageNumber: {
      get() {
        return this.$store.getters.pageNumber;
      },
      set(value) {
        this.$store.commit("updatePageNumber", value);
      },
    },
    pageSize: {
      get() {
        return this.$store.getters.pageSize;
      },
      set(value) {
        this.$store.commit("updatePageSize", value);
      },
    },
  },

  methods: {
    goToTheFirstPage() {
      if (this.$store.getters.pageNumber != 1) {
        this.$store.commit("updatePageNumber", 1);
        this.$emit("pagingDataChanged");
      }
    },
    goToThePreviousPage() {
      let currentPageNumber = this.$store.getters.pageNumber;
      if (currentPageNumber > 1) {
        currentPageNumber--;
        this.$store.commit("updatePageNumber", currentPageNumber);
        this.$emit("pagingDataChanged");
      }
    },
    goToTheNextPage() {
      let currentPageNumber = this.$store.getters.pageNumber;
      if (currentPageNumber < this.totalPageCount) {
        currentPageNumber++;
        this.$store.commit("updatePageNumber", currentPageNumber);
        this.$emit("pagingDataChanged");
      }
    },
    goToTheLastPage() {
      if (this.$store.getters.pageNumber != this.totalPageCount) {
        this.$store.commit("updatePageNumber", this.totalPageCount);
        this.$emit("pagingDataChanged");
      }
    },
    onPageNumberKeyUpEnter() {
      if (this.$store.getters.pageNumber > this.totalPageCount)
        this.$store.commit("updatePageNumber", this.totalPageCount);

      if (this.$store.getters.pageNumber < 1)
        this.$store.commit("updatePageNumber", 1);

      this.$emit("pagingDataChanged");
    },
  },
};
</script>

<style scoped>
table {
  width: -webkit-fill-available;
}

.pointer {
  cursor: pointer;
}

#select-container {
  width: 4em;
}

#first-page-container {
  width: 1.3em;
}

#previous-page-container {
  width: 1.3em;
}

#current-page-container {
  width: 1em;
}

#current-page-container > input {
  text-align: center;
}

#total-page-count-container {
  width: 3.3em;
}

#next-page-container {
  width: 1em;
}
</style>