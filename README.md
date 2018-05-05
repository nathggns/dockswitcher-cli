# DockSwitcher

Basic command line tool for managing and creating macOS Dock profiles. This is designed to be used with apps
like ControlPlane, where you may want to different items in your dock based on different "contexts".

**Note: This has been developed for personal use, and has not been fully tested. I cannot verifying which versions
of macOS this may work with, or if it will even work at all. If your Dock setup is important to you, please do not use
this tool, or at the very least, backup your setup.**

## Usage

```bash
$ sudo dockSwitcher get # list the current active profile
$ sudo dockSwitcher new newProfileName # clone the current profile into newProfileName. THIS DOES NOT ACTIVATE THE PROFILE
$ sudo dockSwitcher activate profileName # activate a profile

$ sudo dockSwitcher verify # Verify that the macOS dock items matches the items specified in the active profile – mostly used for internal testing
$ sudo dockSwitcher update # Update the current profile to match the macOS dock items – mostly used for internal testing
```
