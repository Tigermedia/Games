# Changelog

All notable changes to the Gmail Agent project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Weekly optimization reports
- Rule conflict detection
- Bulk rule import/export
- Mobile app for decision-making
- Slack/Discord integration
- Email snooze functionality
- Sentiment analysis

---

## [0.1.0] - 2025-01-13

### Added
- Initial project setup and documentation
- Comprehensive architecture design for single n8n workflow
- Project documentation files:
  - `claude.md` - AI assistant context and guidelines
  - `README.md` - Project overview and navigation
  - `PLAN.md` - Detailed implementation specifications
  - `TODOS.md` - Phase-based implementation checklist
  - `CHANGELOG.md` - This file
  - `.gitignore` - Security and privacy protection
- Single workflow architecture with two branches:
  - Branch A: Known pattern execution (confidence ≥80%)
  - Branch B: Unknown pattern learning (confidence <80%)
- Google Sheets database schema with 3 tabs:
  - Rules: Pattern definitions and statistics
  - Activity Log: Email processing history
  - Statistics: Dashboard metrics (optional)
- AI integration design:
  - Email analysis and rule matching
  - Pattern extraction from user decisions
  - Confidence scoring system
- Interactive feedback system using Wait node webhooks
- Email templates for:
  - Decision requests
  - Rule confirmations
  - Daily summaries
- Error handling and retry logic specifications
- Comprehensive testing procedures
- Deployment checklist

### Design Decisions
- **Single Workflow**: Chose unified workflow over multiple workflows for simplicity
- **Google Sheets**: Selected over PostgreSQL for easier setup and manual editing
- **Email Notifications**: Chose over Slack/Discord for simpler setup
- **Confidence Threshold**: Set to 80% as starting point
- **AI Provider**: Support for both OpenAI (GPT-4) and Anthropic (Claude)
- **Wait Node Timeout**: Set to 7 days for user responses

### Technical Specifications
- n8n version required: 1.0+
- Schedule: Daily at 8am (configurable via cron)
- Email processing capacity: 50-200 emails/day
- Maximum batch size: 100 emails per run
- Rule types supported: sender, domain, subject_contains, content_ai, complex
- Action types supported: label, archive, delete, forward, mark_read, star, combinations

### Documentation
- Added comprehensive node-by-node workflow specifications
- Documented all AI prompts and logic
- Created Google Sheets schema with example data
- Wrote email HTML templates
- Documented error handling strategies
- Created testing procedures for all phases
- Compiled deployment checklist with prerequisites

### Notes
- Project is in planning phase, no code implementation yet
- All documentation prepared for implementation start
- Ready to begin Phase 1: Setup & Configuration

---

## Version History Template

### [X.Y.Z] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing functionality

#### Deprecated
- Features marked for removal

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security patches

---

## Version Numbering Guide

- **Major (X.0.0)**: Breaking changes, major feature additions
- **Minor (0.X.0)**: New features, non-breaking changes
- **Patch (0.0.X)**: Bug fixes, minor improvements

### Examples
- `1.0.0` - First production release (after all phases complete)
- `0.5.0` - Core workflow implemented and tested
- `0.5.1` - Bug fix in email processing
- `0.6.0` - AI integration added
- `1.1.0` - Weekly reports feature added
- `2.0.0` - Migration to PostgreSQL (breaking change)

---

**Current Version**: 0.1.0 (Planning)
**Next Milestone**: 0.2.0 (Setup & Configuration Complete)
