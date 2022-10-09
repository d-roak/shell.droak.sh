#!/bin/bash


echo "Creating a GPT partition on /dev/sda1"
echo -e "g\nn\n\n\n\nw" | fdisk /dev/sda

# In case you might want to create a DOS partition instead. It doesn't really matter.
#echo "Creating a DOS partition on /dev/sda1"
#echo -e "o\nn\np\n1\n\n\nw" | fdisk /dev/sda

echo "Formatting /dev/sda1 to ext4"
mkfs -t ext4 /dev/sda1

echo "Mounting new filesystem"
mount -t ext4 /dev/sda1 /mnt

echo "Create pacman package cache dir"
mkdir -p /mnt/var/cache/pacman/pkg

# We don't want the pacman cache to fill up the image. After reboot whatever tarballs pacman has cached are gone.
echo "Mount the package cache dir in memory so it doesn't fill up the image"
mount -t tmpfs none /mnt/var/cache/pacman/pkg

# Install the Archlinux base system
echo "Performing pacstrap"
pacstrap -i /mnt base --noconfirm

echo "Writing fstab"
genfstab -p /mnt >> /mnt/etc/fstab

# When the Linux boots we want it to automatically log in on tty1 as root
echo "Ensuring root autologin on tty1"
mkdir -p /mnt/etc/systemd/system/getty@tty1.service.d
cat << 'EOF' > /mnt/etc/systemd/system/getty@tty1.service.d/override.conf
[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --autologin root --noclear %I $TERM
EOF

# This is the tricky part. The current root will be mounted on /dev/sda1 but after we reboot 
# it will try to mount root during boot using the 9p network filesystem. This means the emulator
# will request all files over the network using XMLHttpRequests from the server. This is great 
# because then you only need to provide the client with a saved state (the memory) and the 
# session will start instantly and load needed files on the fly. This is fast and it saves bandwidth.
echo "Ensuring root is remounted using 9p after reboot"
mkdir -p /mnt/etc/initcpio/hooks
cat << 'EOF' > /mnt/etc/initcpio/hooks/9p_root
run_hook() {
    mount_handler="mount_9p_root"
}

mount_9p_root() {
    msg ":: mounting '$root' on real root (9p)"
    # Note the host9p. We won't mount /dev/sda1 on root anymore, 
    # instead we mount the network filesystem and the emulator will
    # retrieve the files on the fly.
    if ! mount -t 9p host9p "$1"; then
        echo "You are now being dropped into an emergency shell."
        launch_interactive_shell
        msg "Trying to continue (this will most likely fail) ..."
    fi
}
EOF

echo "Adding initcpio build hook for 9p root remount"
mkdir -p /mnt/etc/initcpio/install
cat << 'EOF' > /mnt/etc/initcpio/install/9p_root
#!/bin/bash
build() {
	add_runscript
}
EOF

sed -i 's/SigLevel    = Required DatabaseOptional/SigLevel = Never/g' /mnt/etc/pacman.conf
echo "Writing the installation script"
cat << 'EOF' > /mnt/bootstrap.sh
#!/usr/bin/bash
# pacman -S archlinux32-keyring-transition --noconfirm
# pacman -Sy archlinux32-keyring --noconfirm
# pacman-key --refresh-keys
pacman-key --recv-keys C8E8F5A0AF9BA7E7
pacman-key --recv-keys 2C146C01A952AC0F
pacman -Scc --noconfirm
pacman -Syyu --noconfirm

echo "Re-generate initial ramdisk environment"
pacman -S mkinitcpio --noconfirm
echo "Configure mkinitcpio for 9p"
sed -i 's/MODULES=()/MODULES=(atkbd i8042 virtio_pci 9p 9pnet 9pnet_virtio)/g' /mnt/etc/mkinitcpio.conf
sed -i 's/fsck"/fsck 9p_root"/g' /mnt/etc/mkinitcpio.conf
mkinitcpio -p linux

echo "Installing the grub package"
pacman -S os-prober grub --noconfirm

echo "Setting grub timeout to 0 seconds"
sed -i 's/GRUB_TIMEOUT=5/GRUB_TIMEOUT=0/g' /etc/default/grub

echo "Installing bootloader"
grub-install --target=i386-pc --recheck /dev/sda --force

echo "Writing grub config"
grub-mkconfig -o /boot/grub/grub.cfg
sync
EOF

echo "Chrooting and bootstrapping the installation"
arch-chroot /mnt bash bootstrap.sh

umount -R /mnt
