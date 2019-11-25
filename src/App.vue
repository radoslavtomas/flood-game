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
            v-model="settings.type"
            class="w-full border border-gray-500 rounded px-2 py-3"
          >
            <option value="shape">Shape</option>
            <option value="bg">Color</option>
          </select>
        </div>

        <div class="mb-4" v-if="settings.type === 'shape'">
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

        <div class="mb-4" v-if="settings.type === 'bg'">
          <label for="color" class="block">Set color</label>
          <select
            name="color"
            id="color"
            v-model="settings.bg"
            class="w-full border border-gray-500 rounded px-2 py-3"
          >
            <option value="blue">Blue</option>
            <option value="red">Red</option>
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
          :class="{ 'bg-blue-400':obj.bg == 'blue', 'bg-red-400':obj.bg == 'red', 'rounded-full':obj.shape == 'circle', 'rounded-none':obj.shape == 'square' }"
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
      canvas: [],
      coords: {
        x: "",
        y: ""
      },
      shape: {
        shape: "square",
        bg: "blue"
      },
      colors: {
        blue: "bg-blue-400",
        red: "bg-red-400"
      },
      shapes: {
        square: "rounded-none",
        circle: "rounded-full"
      },
      settings: {
        shape: "circle",
        bg: "red",
        mode: "flood", // single|row|column|flood
        type: "bg" // shape|bg
      },
      generateId: null
    };
  },
  methods: {
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

      this.canvas[x][y][this.settings.type] = this.settings[this.settings.type];
    },
    handleRow(x, y) {
      this.handlePoint(x, y);

      this.handleNextPoint(x, y + 1, "right");
      this.handleNextPoint(x, y - 1, "left");
    },
    handleColumn(x, y) {
      this.handlePoint(x, y);

      this.handleNextPoint(x + 1, y, "up");
      this.handleNextPoint(x - 1, y, "down");
    },
    handleFlood(x, y) {
      if (!this.pointExists(x, y)) {
        return;
      }

      if (
        this.canvas[x][y][this.settings.type] ===
        this.settings[this.settings.type]
      ) {
        return;
      }

      this.handlePoint(x, y);
      this.handleFlodInQueue(x, y);
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
    handleFlodInQueue(x, y) {
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
          this.canvas[coords.x][coords.y + 1][this.settings.type] !==
            this.settings[this.settings.type]
        ) {
          this.handlePoint(coords.x, coords.y + 1);
          queue.push(this.canvas[coords.x][coords.y + 1]);
        }

        if (
          this.pointExists(coords.x, coords.y - 1) &&
          this.canvas[coords.x][coords.y - 1][this.settings.type] !==
            this.settings[this.settings.type]
        ) {
          this.handlePoint(coords.x, coords.y - 1);
          queue.push(this.canvas[coords.x][coords.y - 1]);
        }

        if (
          this.pointExists(coords.x + 1, coords.y) &&
          this.canvas[coords.x + 1][coords.y][this.settings.type] !==
            this.settings[this.settings.type]
        ) {
          this.handlePoint(coords.x + 1, coords.y);
          queue.push(this.canvas[coords.x + 1][coords.y]);
        }

        if (
          this.pointExists(coords.x - 1, coords.y) &&
          this.canvas[coords.x - 1][coords.y][this.settings.type] !==
            this.settings[this.settings.type]
        ) {
          this.handlePoint(coords.x - 1, coords.y);
          queue.push(this.canvas[coords.x - 1][coords.y]);
        }
      }
    },
    handleNextPoint(x, y, direction) {
      if (!this.canvas[x]) {
        return;
      }

      if (!this.canvas[x][y]) {
        return;
      }

      if (
        this.canvas[x][y][this.settings.type] !==
        this.settings[this.settings.type]
      ) {
        setTimeout(() => {
          const { newX, newY } = this.getNewCoords(x, y, direction);
          this.handlePoint(x, y);
          this.handleNextPoint(newX, newY, direction);
        }, 150);
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
            bg: "blue"
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
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

@tailwind base;

@tailwind components;

@tailwind utilities;
</style>
