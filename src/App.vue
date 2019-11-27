<template>
  <div id="app" class="font-main p-2">
    <div class="w-full md:w-1/5 mx-auto mt-10">
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
              <option v-for="i in grid.maxX" :key="i" :value="i">{{ i }}</option>
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
              <option v-for="j in grid.maxX" :key="j" :value="j">{{ j }}</option>
            </select>
          </div>
        </div>

        <div class="w-full">
          <button
            class="w-full border border-gray-500 px-2 py-3 rounded text-white bg-teal-400 hover:bg-teal-500"
            @click="createCanvas"
          >Create canvas</button>
        </div>
      </div>

      <div v-if="canvas.length > 1">
        <div class="mb-4">
          <label for="mode" class="block">Mode</label>
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
          </select>
        </div>

        <div class="mb-4">
          <label for="type" class="block">I want to change</label>
          <select
            name="type"
            id="type"
            v-model="type"
            class="w-full border border-gray-500 rounded px-2 py-3"
          >
            <option value="shape">Shape</option>
            <option value="bg">Color</option>
          </select>
        </div>

        <div class="mb-4" v-if="type === 'shape'">
          <label for="shape" class="block">Set shape</label>
          <select
            name="shape"
            id="shape"
            v-model="settings.shape"
            class="w-full border border-gray-500 rounded px-2 py-3"
          >
            <option value="square">Square</option>
            <option value="circle">Circle</option>
          </select>
        </div>

        <div class="mb-4" v-if="type === 'bg'">
          <label for="color" class="block">Set color</label>
          <select
            name="color"
            id="color"
            v-model="settings.bg"
            class="w-full border border-gray-500 rounded px-2 py-3"
          >
            <option v-for="color in colors" :key="color.value" :value="color.value">{{ color.name }}</option>
          </select>
        </div>

        <div class="w-full">
          <button
            class="w-full border border-gray-500 px-2 py-3 rounded text-white bg-teal-400 hover:bg-teal-500"
            @click="resetCanvas"
          >Reset canvas</button>
        </div>
      </div>
    </div>

    <div class="mt-10 flex justify-center items-center flex-col" v-if="canvas.length > 1">
      <div
        class="canvas w-full flex justify-center flex-no-wrap"
        v-for="(row, x) in canvas"
        :key="x"
      >
        <div
          @click="handleClick(x,y)"
          class="shape w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 border border-gray-800 m-piccolo cursor-pointer shadow"
          :class="classObject(obj)"
          v-for="(obj, y) in row"
          :key="y"
        ></div>
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
          value: "white"
        },
        {
          name: "Gray",
          value: "gray"
        },
        {
          name: "Red",
          value: "red"
        },
        {
          name: "Orange",
          value: "orange"
        },
        {
          name: "Yellow",
          value: "yellow"
        },
        {
          name: "Green",
          value: "green"
        },
        {
          name: "Teal",
          value: "teal"
        },
        {
          name: "Blue",
          value: "blue"
        },
        {
          name: "Indigo",
          value: "indigo"
        },
        {
          name: "Purple",
          value: "purple"
        },
        {
          name: "Pink",
          value: "pink"
        },
        {
          name: "Black",
          value: "black"
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
        "bg-gray-100": obj.bg === "white",
        "bg-gray-900": obj.bg === "black",
        "bg-gray-400": obj.bg === "gray",
        "bg-red-400": obj.bg === "red",
        "bg-orange-400": obj.bg === "orange",
        "bg-yellow-400": obj.bg === "yellow",
        "bg-green-400": obj.bg === "green",
        "bg-teal-400": obj.bg === "teal",
        "bg-blue-400": obj.bg === "blue",
        "bg-indigo-400": obj.bg === "indigo",
        "bg-purple-400": obj.bg === "purple",
        "bg-pink-400": obj.bg === "pink",
        "rounded-full": obj.shape === "circle",
        "rounded-none": obj.shape === "square"
      };
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
            shape: "square",
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
