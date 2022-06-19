<template>
  <div id="container">
    <table>
      <tbody>
        <tr>
          <td>
            <input
              v-model="inputValue"
              ref="input"
              :type="inputType"
              @keyup.enter="changeInputValue"
            />
          </td>
          <td id="clear-icon-container">
            <img
              v-if="inputValue"
              id="clear-icon"
              src="../../public/img/icons\clear-icon.svg"
              alt="close"
              @click="clearInputText"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "InputComponent",

  emits: ["inputValueChanged", "clearButtonClicked"],

  props: {
    inputType: String,
  },

  data() {
    return {
      inputValue: "",
    };
  },

  methods: {
    clearInputText() {
      this.inputValue = "";
      this.$refs.input.focus();
      this.$emit("clearButtonClicked");
    },
    changeInputValue() {
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
  width: -webkit-fill-available;
}

/* #clear-icon:hover {
  background-color: bisque;
} */

#clear-icon-container {
  width: 1em;
  height: 1em;
  text-align: center;
  /* border: 1px solid; */
}
</style>