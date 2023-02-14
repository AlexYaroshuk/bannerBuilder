<template>
    <div class="options-button" :class="{ 'is-active': isActive }" @click="showDropdown = !showDropdown">
        <i class="fas fa-cog"></i>
        <div class="dropdown" :class="{ show: showDropdown }">
            <ul>
                <li @click="showPopup = true">Option 1</li>
                <li>Option 2</li>
                <li>Option 3</li>
            </ul>
        </div>
        <div class="popup" :class="{ show: showPopup }">
            <div class="popup-content">
                <h3>Change Text</h3>
                <div class="form-group">
                    <label for="text-field">Text:</label>
                    <input id="text-field" type="text" v-model="newText" />
                </div>
                <div class="popup-buttons">
                    <button @click="updateBanner">OK</button>
                    <button @click="showPopup = false">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showDropdown: false,
            showPopup: false,
            newText: '',
        };
    },
    methods: {
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        updateBanner() {
            this.$emit('update-text', this.newText);
            this.showPopup = false;
        },
    },
};
</script>

<style scoped>
.options-button {
  display: block;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 4px;
  z-index: 10;
  opacity: 0;
}

.options-button.is-active {
  display: block;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dropdown {
  position: absolute;
  border-radius: 4px;
  top: 100%;
  right: 0;
  width: 100px;
  background-color: white;
  border: 1px solid black;
  color: black;
  transform: translateY(-10px);
  transition: transform 0.2s ease-in-out;
  opacity: 0;
  z-index: 10;
}

.dropdown.show {
  opacity: 1;
  transform: translateY(0);
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 0.5rem;
  cursor: pointer;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 20;
    color: black;
}

.popup.show {
  display: flex;
}

.popup-content {
    background-color: white;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.popup-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.popup-input {
    margin-bottom: 1rem;
}

.popup-button {
    display: inline-block;
    background-color: blue;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 1rem;
}

.popup-button:hover {
    background-color: darkblue;
}

.popup-button-secondary {
    display: inline-block;
    background-color: #ccc;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.popup-button-secondary:hover {
    background-color: #aaa;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}
</style>