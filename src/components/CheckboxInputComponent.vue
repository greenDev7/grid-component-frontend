<template>
  <div id="container">
    <table>
      <tbody>
        <tr>
          <td>
            <input
              v-model="inputValue"
              type="checkbox"
              :indeterminate="isIndeterminate"
              @change="changeInputValue"
            />
          </td>
          <td id="clear-icon-container">
            <img
              v-if="!isIndeterminate"
              id="clear-icon"
              src="../../public/img/icons\clear-icon.svg"
              alt="clear"
              @click="clearInputValue"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "CheckboxInputComponent",

  emits: ["inputValueChanged", "clearButtonClicked"],

  data() {
    return {
      inputValue: false,
      isIndeterminate: true,
    };
  },

  methods: {
    clearInputValue() {
      this.isIndeterminate = true;
      this.$emit("clearButtonClicked");
    },
    changeInputValue() {
      this.isIndeterminate = false;
      this.$emit("inputValueChanged", this.inputValue);
    },
  },
};
</script>

<style scoped>
table {
  /* border: 1px solid black; */
  width: -webkit-fill-available;
}

#clear-icon {
  width: 0.7em;
  height: 0.7em;
  cursor: pointer;
}

input {
  border: none;
  outline: none;
}

#clear-icon-container {
  width: 1em;
  height: 1em;
  text-align: center;
  /* border: 1px solid; */
}
</style>