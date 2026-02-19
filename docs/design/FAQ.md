# FAQ

## History

| Status | Date |
| --- | --- |
| Initial draft written | 2026-02-18 |

## Signoffs

| Role | Date |
| --- | --- |
| Web Team | - |
| VATUSA6 | - |
| VATUSA4 | - |

## Brief

The FAQ section of the VATUSA main website, currently at <https://www.vatusa.net/help/kb>, lists various very-commonly referenced questions & answers. Controllers new to VATSIM and/or to VATUSA are frequently
directed to this page to get answers to commonly-asked questions posted in Discord.

## Features

This page is fairly simple, as it is designed to have largely static content.

1. List questions and their answers.

Currently, categories come from the `knowledgebase_categories` table in the `vatusa-old` database. Questions and answers come from the `knowledgebase_questions` table in the same DB.

2. Allow linking to a specific question.

When a link to the FAQ is given to someone, it is helpful to be able to link to a specific question. This should be done through some mechanism in the URL, likely the fragment identifier (`#...`). Some
sort of visual indication should be included to focus the linked question's answer.

3. Have the questions & answers be configurable by VATUSA staff.

While these items don't change frequently, the ability to do so without reaching directly for the database would be nice to have. This action should be limited to VATUSA# staff only; no other division or
subdivision roles should see any sort of controls for editing content.
