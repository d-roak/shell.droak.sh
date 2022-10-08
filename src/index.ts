
import { V86Starter } from "v86";

const render = () => {
  new V86Starter({
    wasm_path: "./lib/v86/v86.wasm",
    memory_size: 512 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    screen_container: document.getElementById("screen_container"),
    bios: {
      url: "./lib/v86/bios/seabios.bin",
    },
    vga_bios: {
      url: "./lib/v86/bios/vgabios.bin",
    },
    cdrom: {
      url: "./lib/v86/images/linux.iso",
    },
    autostart: true,
  });
};

render();
