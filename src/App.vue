<template>
  <div id="app" class="font-main p-2">
    <div class="w-full md:w-2/5 mx-auto mt-10">
      <div v-if="canvas.length === 0">
        <div class="w-full flex justify-between items-center mb-4">
          <div class="w-full mr-1">
            <label for="grid_x" class="block">Rows</label>
            <select
              name="grid_x"
              id="grid_x"
              v-model="grid.x"
              class="w-full border border-gray-500 rounded px-2 py-3"
            >
              <option v-for="i in grid.maxX" :key="i" :value="i">{{
                i
              }}</option>
            </select>
          </div>

          <div class="w-full ml-1">
            <label for="grid_y" class="block">Columns</label>
            <select
              name="grid_y"
              id="grid_y"
              v-model="grid.y"
              class="w-full border border-gray-500 rounded px-2 py-3"
            >
              <option v-for="j in grid.maxX" :key="j" :value="j">{{
                j
              }}</option>
            </select>
          </div>
        </div>

        <div class="w-full">
          <button
            class="w-full border border-gray-500 px-2 py-3 rounded text-white bg-teal-400 hover:bg-teal-500"
            @click="createCanvas"
          >
            Create canvas
          </button>
        </div>
      </div>

      <div v-if="canvas.length > 1">
        <div class="mb-4">
          <!-- <label for="mode" class="block">Mode</label>
          <select
            name="mode"
            id="mode"
            v-model="settings.mode"
            class="w-full border border-gray-500 rounded px-2 py-3"
          >
            <option value="single">Single</option>
            <option value="row">Row</option>
            <option value="column">Column</option>
            <option value="flood">Flood</option>
          </select> -->
          <div class="w-full h-12 flex">
            <div
              class="w-1/4 h-full border border-gray-500 border-r-0 flex justify-center items-center rounded-l cursor-pointer"
              :class="{ 'bg-teal-400 text-white': settings.mode === 'single' }"
              @click="updateMode('single')"
            >
              <fa-icon icon="dot-circle"></fa-icon>
            </div>

            <div
              class="w-1/4 h-full border border-gray-500 border-r-0 flex justify-center items-center cursor-pointer"
              :class="{ 'bg-teal-400 text-white': settings.mode === 'row' }"
              @click="updateMode('row')"
            >
              <fa-icon icon="arrows-alt-h"></fa-icon>
            </div>

            <div
              class="w-1/4 h-full border border-gray-500 border-r-0 flex justify-center items-center cursor-pointer"
              :class="{ 'bg-teal-400 text-white': settings.mode === 'column' }"
              @click="updateMode('column')"
            >
              <fa-icon icon="arrows-alt-v"></fa-icon>
            </div>

            <div
              class="w-1/4 h-full border border-gray-500 flex justify-center items-center rounded-r cursor-pointer"
              :class="{ 'bg-teal-400 text-white': settings.mode === 'flood' }"
              @click="updateMode('flood')"
            >
              <fa-icon icon="arrows-alt"></fa-icon>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="w-full h-12 flex">
            <div
              class="w-1/2 h-full border border-gray-500 border-r-0 flex justify-center items-center rounded-l cursor-pointer"
              :class="{ 'bg-teal-400 text-white': type === 'bg' }"
              @click="updateType('bg')"
            >
              Color
            </div>
            <div
              class="w-1/2 h-full border border-gray-500 flex justify-center items-center rounded-r cursor-pointer"
              :class="{ 'bg-teal-400 text-white': type === 'shape' }"
              @click="updateType('shape')"
            >
              Shape
            </div>
          </div>
        </div>

        <div class="mb-4" v-if="type === 'shape'">
          <div class="w-full flex justify-between items-center">
            <fa-icon
              v-for="shape in shapes"
              :key="shape.value"
              :icon="shape.value"
              @click="updateShape(shape.value)"
              class="text-gray-400 text-3xl mr-2 last:mr-0 cursor-pointer"
              :class="{ 'text-teal-400': settings.shape === shape.value }"
            ></fa-icon>
          </div>
        </div>

        <div class="mb-4" v-if="type === 'bg'">
          <div class="w-full flex justify-between items-center flex-wrap">
            <div
              v-for="color in colors"
              :key="color.value"
              class="w-1/6 h-10 flex justify-center items-center"
            >
              <div
                @click="updateColor(color.value)"
                class="rounded-full h-8 w-8 cursor-pointer"
                :class="[
                  color.class,
                  { 'shadow-outline': color.value === settings.bg }
                ]"
              ></div>
            </div>
          </div>
        </div>

        <div class="w-full">
          <button
            class="w-full border border-gray-500 px-2 py-3 rounded text-white bg-teal-400 hover:bg-teal-500"
            @click="resetCanvas"
          >
            Reset canvas
          </button>
        </div>
      </div>
    </div>

    <div
      class="mt-10 flex justify-center items-center flex-col"
      v-if="canvas.length > 1"
    >
      <div
        class="canvas w-full flex justify-center flex-no-wrap"
        v-for="(row, x) in canvas"
        :key="x"
      >
        <div
          @click="handleClick(x, y)"
          class="w-7 h-7 xs:w-8 xs:h-8 md:w-10 md:h-10 m-piccolo cursor-pointer flex justify-center items-center"
          :class="classObject(obj)"
          v-for="(obj, y) in row"
          :key="y"
        >
          <fa-icon
            class="text-sm sm:text-2xl md:text-3xl"
            :icon="obj.shape"
            :class="classObject(obj)"
          ></fa-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      grid: {
        x: 5,
        maxX: 20,
        y: 10,
        maxY: 20
      },
      colors: [
        {
          name: "White",
          value: "white",
          class: "bg-gray-200 border border-gray-400"
        },
        {
          name: "Gray",
          value: "gray",
          class: "bg-gray-400"
        },
        {
          name: "Red",
          value: "red",
          class: "bg-red-400"
        },
        {
          name: "Orange",
          value: "orange",
          class: "bg-orange-400"
        },
        {
          name: "Yellow",
          value: "yellow",
          class: "bg-yellow-400"
        },
        {
          name: "Green",
          value: "green",
          class: "bg-green-400"
        },
        {
          name: "Teal",
          value: "teal",
          class: "bg-teal-400"
        },
        {
          name: "Blue",
          value: "blue",
          class: "bg-blue-400"
        },
        {
          name: "Indigo",
          value: "indigo",
          class: "bg-indigo-500"
        },
        {
          name: "Purple",
          value: "purple",
          class: "bg-purple-400"
        },
        {
          name: "Pink",
          value: "pink",
          class: "bg-pink-400"
        },
        {
          name: "Black",
          value: "black",
          class: "bg-gray-900"
        }
      ],
      shapes: [
        {
          name: "Square",
          value: "square-full"
        },
        {
          name: "Circle",
          value: "circle"
        },
        {
          name: "Star",
          value: "star"
        },
        {
          name: "Asterisk",
          value: "asterisk"
        },
        {
          name: "Snowflake",
          value: "snowflake"
        },
        {
          name: "Stroopwafel",
          value: "stroopwafel"
        },
        {
          name: "Dice One",
          value: "dice-one"
        },
        {
          name: "Dice Five",
          value: "dice-five"
        }
      ],
      canvas: [],
      coords: {
        x: "",
        y: ""
      },
      settings: {
        shape: "circle",
        bg: "red",
        mode: "flood" // single|row|column|flood
      },
      type: "bg", // shape|bg
      generateId: null
    };
  },
  methods: {
    classObject(obj) {
      return {
        "text-gray-200": obj.bg === "white",
        "text-gray-900": obj.bg === "black",
        "text-gray-400": obj.bg === "gray",
        "text-red-400": obj.bg === "red",
        "text-orange-400": obj.bg === "orange",
        "text-yellow-400": obj.bg === "yellow",
        "text-green-400": obj.bg === "green",
        "text-teal-400": obj.bg === "teal",
        "text-blue-400": obj.bg === "blue",
        "text-indigo-500": obj.bg === "indigo",
        "text-purple-400": obj.bg === "purple",
        "text-pink-400": obj.bg === "pink"
      };
    },
    updateShape(shape) {
      this.settings.shape = shape;
    },
    updateColor(color) {
      this.settings.bg = color;
    },
    updateType(type) {
      this.type = type;
    },
    updateMode(mode) {
      this.settings.mode = mode;
    },
    handleClick(x, y) {
      this.coords.x = x;
      this.coords.y = y;

      switch (this.settings.mode) {
        case "single":
          this.handlePoint(x, y);
          break;

        case "row":
          this.handleRow(x, y);
          break;

        case "column":
          this.handleColumn(x, y);
          break;

        case "flood":
          this.handleFlood(x, y);
          break;

        default:
          break;
      }
    },
    handlePoint(x, y) {
      if (!this.pointExists(x, y)) {
        return;
      }

      this.canvas[x][y][this.type] = this.realTypeValue;
    },
    handleRow(x, y) {
      const targetValue = this.canvas[x][y][this.type];

      this.handlePoint(x, y);

      this.handleNextPoint(x, y + 1, "right", targetValue);
      this.handleNextPoint(x, y - 1, "left", targetValue);
    },
    handleColumn(x, y) {
      const targetValue = this.canvas[x][y][this.type];

      this.handlePoint(x, y);

      this.handleNextPoint(x + 1, y, "up", targetValue);
      this.handleNextPoint(x - 1, y, "down", targetValue);
    },
    handleNextPoint(x, y, direction, targetValue) {
      if (!this.pointExists(x, y)) {
        return;
      }

      const replacementValue = this.realTypeValue;

      if (this.canvas[x][y][this.type] === replacementValue) {
        return;
      }

      if (this.canvas[x][y][this.type] !== targetValue) {
        return;
      }

      setTimeout(() => {
        const { newX, newY } = this.getNewCoords(x, y, direction);
        this.handlePoint(x, y);
        this.handleNextPoint(newX, newY, direction, targetValue);
      }, 150);
    },
    handleFlood(x, y) {
      const targetValue = this.canvas[x][y][this.type];
      const replacementValue = this.realTypeValue;

      if (this.canvas[x][y][this.type] === replacementValue) {
        return;
      }

      if (this.canvas[x][y][this.type] !== targetValue) {
        return;
      }

      this.handlePoint(x, y);
      this.handleFlodInQueue(x, y, targetValue);
    },
    pointExists(x, y) {
      if (!this.canvas[x]) {
        return false;
      }

      if (!this.canvas[x][y]) {
        return false;
      }

      return true;
    },
    handleFlodInQueue(x, y, targetValue) {
      let queue = [];

      queue.push(this.canvas[x][y]);

      while (queue.length != 0) {
        let initial = queue.shift(); // remove 1st element of an array

        let coords = {
          x: initial.coords[0],
          y: initial.coords[1]
        };

        if (
          this.pointExists(coords.x, coords.y + 1) &&
          this.canvas[coords.x][coords.y + 1][this.type] === targetValue
        ) {
          this.handlePoint(coords.x, coords.y + 1);
          queue.push(this.canvas[coords.x][coords.y + 1]);
        }

        if (
          this.pointExists(coords.x, coords.y - 1) &&
          this.canvas[coords.x][coords.y - 1][this.type] === targetValue
        ) {
          this.handlePoint(coords.x, coords.y - 1);
          queue.push(this.canvas[coords.x][coords.y - 1]);
        }

        if (
          this.pointExists(coords.x + 1, coords.y) &&
          this.canvas[coords.x + 1][coords.y][this.type] === targetValue
        ) {
          this.handlePoint(coords.x + 1, coords.y);
          queue.push(this.canvas[coords.x + 1][coords.y]);
        }

        if (
          this.pointExists(coords.x - 1, coords.y) &&
          this.canvas[coords.x - 1][coords.y][this.type] === targetValue
        ) {
          this.handlePoint(coords.x - 1, coords.y);
          queue.push(this.canvas[coords.x - 1][coords.y]);
        }
      }
    },
    getNewCoords(x, y, direction) {
      let newCoords = {};
      switch (direction) {
        case "right":
          newCoords = { newX: x, newY: y + 1 };
          break;

        case "left":
          newCoords = { newX: x, newY: y - 1 };
          break;

        case "up":
          newCoords = { newX: x + 1, newY: y };
          break;

        case "down":
          newCoords = { newX: x - 1, newY: y };
          break;

        default:
          break;
      }

      return newCoords;
    },
    *idGenerator() {
      let id = 0;

      while (true) {
        yield ++id;
      }
    },
    createCanvas() {
      let canvas = [];

      for (let x = 0; x < this.grid.x; x++) {
        canvas[x] = [];
        for (let y = 0; y < this.grid.y; y++) {
          canvas[x][y] = {
            id: this.generateId.next().value,
            coords: [x, y],
            shape: "square-full",
            bg: "white"
          };
        }
      }

      this.canvas = canvas;
    },
    resetCanvas() {
      this.canvas = [];
    }
  },
  mounted() {
    this.generateId = this.idGenerator();
  },
  computed: {
    realTypeValue() {
      return this.settings[this.type];
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

@tailwind base;

@tailwind components;

@tailwind utilities;
</style>
