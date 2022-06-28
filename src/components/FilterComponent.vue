<template>
  <div id="container">
    <table>
      <tbody>
        <tr>
          <td id="selector-container">
            <select
              v-model="comparisonOperator"
              @change="updateComparisonOperator"
            >
              <option
                v-for="comparisonOperator in getComparisonOperatorsByColumnType(
                  columnType
                )"
                :value="comparisonOperator.value"
                :key="comparisonOperator.value"
              >
                <span v-html="comparisonOperator.content"></span>
              </option>
            </select>
          </td>
          <td id="input-container">
            <InputComponent
              v-if="['number', 'text'].includes(columnType)"
              :inputType="columnType"
              @inputValueChanged="updateFilterValue"
              @clearButtonClicked="clearFilterValue"
            />
            <CheckboxInputComponent
              v-else-if="columnType == 'checkbox'"
              @inputValueChanged="updateFilterValue"
              @clearButtonClicked="clearFilterValue"
            />
            <DateTimeInputComponent
              v-else
              @inputValueChanged="updateFilterValue"
              @clearButtonClicked="clearFilterValue"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CheckboxInputComponent from "./CheckboxInputComponent.vue";
import DateTimeInputComponent from "./DateTimeInputComponent.vue";
import InputComponent from "./InputComponent.vue";
export default {
  components: {
    InputComponent,
    CheckboxInputComponent,
    DateTimeInputComponent,

  },

  name: "FilterComponent",

  emits: ["filterChanged"],

  props: {
    columnType: String,
    columnName: String,
  },

  data() {
    return {
      comparisonOperator: this.defaultComparisonOperatorByColumnType(
        this.columnType
      ),
      valueToFilter: ""
    };
  },

  methods: {
    clearFilterValue() {
      this.valueToFilter = "";
      this.commitFilterAndEmit();
    },
    updateComparisonOperator() {
      if (this.valueToFilter) {
        this.commitFilterAndEmit();
      }
    },
    updateFilterValue(inputValue) {
      this.valueToFilter = inputValue;
      this.commitFilterAndEmit();
    },
    getComparisonOperatorsByColumnType(columnType) {
      const operators = {
        like: { value: "likeOperator", content: "Like" },
        notLike: { value: "notLikeOperator", content: "!Like" },
        e: { value: "equalOperator", content: "=" },
        ne: { value: "notEqualOperator", content: "!=" },
        gt: { value: "greaterThanOperator", content: "&gt;" },
        lt: { value: "lessThanOperator", content: "&lt;" },
        geq: { value: "greaterThanOrEqualOperator", content: "&geq;" },
        leq: { value: "lessThanOrEqualOperator", content: "&leq;" },
      };

      switch (columnType) {
        case "number":
          return [
            operators.like,
            operators.notLike,
            operators.e,
            operators.ne,
            operators.gt,
            operators.lt,
            operators.geq,
            operators.leq,
          ];
        case "text":
          return [operators.like, operators.notLike, operators.e, operators.ne];
        case "checkbox":
          return [operators.e];
        case "datetime-local":
          return [
            operators.e,
            operators.ne,
            operators.gt, 
            operators.lt,
            operators.geq,
            operators.leq,
          ];
      }
    },
    defaultComparisonOperatorByColumnType(columnType) {
      switch (columnType) {
        case "number":
          return "equalOperator";
        case "text":
          return "likeOperator";
        case "checkbox":
          return "equalOperator";
        case "datetime-local":
          return "greaterThanOrEqualOperator";
      }
    },
    commitFilterAndEmit() {
      const columnData = {
        columnName: this.columnName,
        columnType: this.columnType,
        comparisonOperator: this.comparisonOperator,
        valueToFilter: this.valueToFilter,
      };
      this.$store.commit("addNewColumnDataToFilter", columnData);
      this.$emit("filterChanged");
    },
  }
};
</script>

<style scoped>
table {
  width: -webkit-fill-available;
}

#selector-container {
  width: 35px;
}

#input-container > input {
  width: -webkit-fill-available;
  border: none;
  /* outline: 1px solid blue; */
}


#checkbox-filter-container {
  width: 35px;
  border: 1px solid black;
  border-radius: 5px;
} 
</style>