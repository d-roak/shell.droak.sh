"use strict";
window.onload = function() {
  console.log("Start onload");
  var emulator = window.emulator = new V86Starter({
    wasm_path: "./lib/v86/v86.wasm",
    memory_size: 1024 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    screen_container: document.getElementById("screen_container"),
    bios: {
      url: "./lib/v86/bios/seabios.bin",
    },
    vga_bios: {
      url: "./lib/v86/bios/vgabios.bin",
    },
    hda: {
      url: "./lib/v86/images/arch.img",
      size: 3 * 1024 * 1024 * 1024,
    },
    autostart: true
  });
  console.log("End onload");
  console.log(emulator);
};
