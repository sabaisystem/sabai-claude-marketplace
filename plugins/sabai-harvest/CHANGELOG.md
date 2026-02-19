# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-02-20

### Added
- Hook-based role access control using UserPromptSubmit hook
- Role validation script (hooks/validate-role.sh) to block manager-only commands for employees
- Role detection flow in /setup-harvest command
- Role configuration storage in ~/.sabai/harvest.json
- Role access control skill documentation

### Changed
- Updated /setup-harvest command to detect and configure user role from Harvest API permissions

## [1.0.0] - 2026-02-16

### Added
- Initial release
