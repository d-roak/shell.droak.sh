#!/bin/bash
cat > ../template.json << 'EOF'
{
  "provisioners": [
    {
      "type": "shell",
      "override": {
        "qemu": {
          "scripts": ["scripts/provision.sh"]
        }
      }
    }
  ],
  "builders": [
    {
      "type": "qemu",
      "boot_command": [
        "<enter><wait10>",
        "dhcpcd<enter><wait10>",
	"usermod --password $(echo toor | openssl passwd -1 -stdin) root<enter><wait10>",
        "systemctl start sshd<enter>"
      ],
      "headless": true,
      "boot_wait": "10s",
      "disk_size": 1500,
      "disk_interface": "ide",
      "http_directory": "http",
      "iso_url": "https://mirror.archlinux32.org/archisos/archlinux-2022.10.01-i686.iso",
      "ssh_wait_timeout": "120s",
      "ssh_pty": true,
      "ssh_username": "root",
      "ssh_password": "toor",
      "ssh_port": 22,
      "format": "raw",
      "vm_name": "Archlinux-v86"
    }
  ]
}
EOF
