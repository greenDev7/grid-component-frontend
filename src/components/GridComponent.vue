<template>
  <table :style="getCommonTableOptions">
    <!-- Хедер таблицы. В нем хранятся чекбокс для выделения всех строк, заголовки столбцов и фильтры -->
    <thead>
      <tr :style="getHeaderOptions">
        <!-- Угловая левая верхняя ячейка с чекбоксом для выделение всех строк (MultipleSelection) -->
        <th v-if="getBehaviorOptions.allowMultipleSelection">
          <input
            v-if="getBehaviorOptions.allowSelectAll"
            type="checkbox"
            :checked="allDataGridRowsAreSelected"
            @change="
              extraCheckboxCheckChanged($event);
              $emit('selectionChanged', selectedRows);
            "
          />
        </th>
        <!-- В цикле генерируем заголовки столбцов -->
        <th
          v-for="column in getColumns"
          :key="column.name"
          @click="sortBy(column.name)"
          :class="{ 'active-header': sortColumn == column.name }"
          :style="getHeaderCellsOptions"
        >
          <!-- Если заголовок не определен, используем вместо него название столбца -->
          {{ column.caption || column.name }}
          <!-- "Сортировочные стрелочки" обозначающие направление сортировки -->
          <span
            class="arrow"
            :class="sortOrders[column.name] > 0 ? 'asc' : 'dsc'"
          ></span>
        </th>
      </tr>
      <!-- Строка фильтров -->
      <tr v-if="getBehaviorOptions.allowFiltering" :style="getFilterOptions">
        <!-- Пустая ячейка слева от фильтров (в нее, кстати, можно поместить кнопку для сброса сразу всех фильтров) -->
        <th
          v-if="getBehaviorOptions.allowMultipleSelection"
          :style="getFilterCellsOptions"
        ></th>
        <!-- В цикле выводим фильтры по количеству столбцов -->
        <th
          v-for="column in getColumns"
          :key="column.name"
          :style="getFilterCellsOptions"
        >
          <!-- Передаем в фильтр тип и название столбца -->
          <FilterComponent
            :columnType="column.type"
            :columnName="column.name"
            @filterChanged="applyFiltersAndUpdateRows"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Основные строки грида -->
      <tr
        class="input-row alt"
        :style="getStyleByRowId(row.id)"
        @click="selectSingleRow(row.id)"
        v-for="row in dataGridRows"
        :key="row.id"
      >
        <!-- Ячейка с чекбоксом для выделения строки -->
        <td
          v-if="getBehaviorOptions.allowMultipleSelection"
          class="extra-checkbox-column"
        >
          <input
            type="checkbox"
            :value="row.id"
            v-model="selectedRows"
            @change="$emit('selectionChanged', selectedRows)"
          />
        </td>
        <!-- Формируем столбцы -->
        <template v-for="column in getColumns" :key="column.name">
          <!-- checkbox column  -->
          <td
            v-if="column.type == 'checkbox'"
            :style="getColumnOptions(column)"
          >
            <input
              :type="column.type"
              :checked="row[column.name]"
              :style="getInputOptions(column)"
              :disabled="column.input.readonly"
            />
          </td>
          <!-- datetime-local column -->
          <td
            v-else-if="column.type == 'datetime-local'"
            :style="getColumnOptions(column)"
          >
            <input
              v-if="row[column.name]"
              :type="column.type"
              :value="getNormalDate(row[column.name])"
              :style="getInputOptions(column)"
              :readonly="column.input.readonly"
            />
          </td>
          <!-- number/text column -->
          <td v-else :style="getColumnOptions(column)">
            <input
              :type="column.type"
              :value="row[column.name]"
              :style="[getnumberInputHorizontalAlign, getInputOptions(column)]"
              :readonly="column.input.readonly"
            />
          </td>
        </template>
      </tr>
      <!--  Пагинация -->
      <tr v-if="getBehaviorOptions.allowPaging">
        <td id="paging-container" :colspan="pagingColSpan">
          <PagingComponent
            id="paging"
            @pagingDataChanged="loadOrRefreshDataGridRows"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import FilterComponent from "./FilterComponent.vue";
import PagingComponent from "./PagingComponent.vue";
import { mapGetters } from "vuex";

export default {
  components: { FilterComponent, PagingComponent },

  name: "GridComponent",

  emits: ["selectionChanged"],

  data() {
    let sortOrders = {};

    // Инициализируем направление сортировки каждого столбца по возрастанию (ASC)
    this.$store.getters.getColumns.forEach((column) => {
      sortOrders[column.name] = 1; // ASC = 1
    });

    // Если пользователь передал значение по убыванию (DESC) для конректного столбца,
    // необходимо изменить направление сортировки выбранного столбца
    // this.orderBy - название столбца для сортировки
    if (this.$store.getters.sortDirection == "DESC") {
      sortOrders[this.$store.getters.sortColumn] *= -1; // DESC = -1
    }

    return {
      selectedRows: [],
      sortOrders: sortOrders,
    };
  },

  computed: {
    ...mapGetters([
      "dataGridRows",
      "getHeaderOptions",
      "getCommonTableOptions",
      "getHeaderCellsOptions",
      "getFilterOptions",
      "getFilterCellsOptions",
      "getnumberInputHorizontalAlign",
      "getColumns",
      "getRowOptions",
      "getBehaviorOptions",
      "sortColumn",
      "pagingColSpan",
    ]),

    allDataGridRowsAreSelected() {
      if (this.dataGridRows && this.selectedRows) {
        return this.dataGridRows.every((r) =>
          this.selectedRows.includes(r["id"])
        );
      }
    },
  },

  methods: {
    sortBy(sortColumn) {
      this.sortOrders[sortColumn] *= -1;
      let sortDirection = this.sortOrders[sortColumn] == 1 ? "ASC" : "DESC";

      this.$store.commit("updateSortColumn", sortColumn);
      this.$store.commit("updateSortDirection", sortDirection);

      this.$store.dispatch("fetchDataGridRows");
    },

    getStyleByRowId(rowId) {
      if (this.selectedRows.includes(rowId)) {
        return {
          backgroundColor: this.getRowOptions.rowSelectionColor,
        };
      }
    },

    getColumnOptions(column) {
      let columnOptions = [];
      Array.prototype.push.apply(columnOptions, [
        this.$store.getters.getColumnOptions.borders,
        this.$store.getters.getColumnOptions.horizontalAlign,
        { width: column.width },
        { padding: column.padding },
      ]);
      return columnOptions;
    },

    getInputOptions(column) {
      let inputOptions = [];
      inputOptions.push({ width: column.input.width });
      return inputOptions;
    },

    extraCheckboxCheckChanged(event) {
      if (event.target.checked && this.dataGridRows) {
        this.selectedRows = [];
        this.dataGridRows.forEach((r) => {
          this.selectedRows.push(r.id);
        });
      } else {
        this.selectedRows = [];
      }
    },

    selectSingleRow(rowId) {
      if (!this.getBehaviorOptions.allowMultipleSelection) {
        if (!this.selectedRows.includes(rowId)) {
          this.selectedRows = [];
          this.selectedRows.push(rowId);
          this.$emit("selectionChanged", this.selectedRows);
        }
      }
    },

    getNormalDate(value) {
      if (value) {
        return value.split(".000Z")[0]; // Преобразуем дату для вывода в грид
      }
    },

    applyFiltersAndUpdateRows() {
      this.$store.commit("updatePageNumber", 1); // После применения фильтров переходим на первую страницу
      this.$store.dispatch("fetchDataGridRows");
    },

    async loadOrRefreshDataGridRows() {
      this.$store.dispatch("fetchDataGridRows");
    },
  },

  async mounted() {
    this.$store.dispatch("fetchDataGridRows");
  },
};
</script>

<style scoped>
#paging-container {
  padding: 20px 15px 15px 15px;
}
/* Чередование цвета строк привязываем в CSS, */
.alt:nth-child(even) {
  background-color: rgb(242, 242, 242);
}

/* Этот стиль позволяет сделать бэкграунд инпут элементов таким же, как и родительский */
tbody tr td input {
  background-color: inherit;
}

/* Убираем границы и аутлайны с инпутов */
tbody input {
  border: none;
  outline: none;
}

/* Оформление сортировочных стрелочек */

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid rgb(242, 242, 242);
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgb(242, 242, 242);
}

th.active-header {
  color: #fff;
}

th.active-header .arrow {
  opacity: 1;
}

td.extra-checkbox-column {
  text-align: center;
  width: 50px;
}
</style>