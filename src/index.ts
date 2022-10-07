
import { V86Starter } from "./lib/v86/libv86";

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
  filesystem: {
    baseurl: "./lib/v86/images/arch/",
    basefs: "./lib/v86/images/fs.json",
  },
  autostart: true,
  bzimage_initrd_from_filesystem: true,
  cmdline: [
    "rw",
    "root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose",
    "init=/usr/bin/init-openrc",
  ].join(" "),
});
