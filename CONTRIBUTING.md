# For contributors

## Introduction

Thank you for your interest to contribute to **appstore-connect-app-version** Github Action!

You can help us with the following:
- New features
- Bug fixes
- Refactoring
- Unit tests
- Documentation improvements
- Bug reports
- Feature requests

To start you can check [open issues](https://github.com/IlyaLehchylin/educats-xamarin/issues) and 
choose a preferred work. You can also start testing the action 
(more details on [README](../README.md)) and then create your own 
[bug reports](https://github.com/ilyalehchylin/appstore-connect-app-version/issues/new?assignees=ilyalehchylin&labels=bug&template=bug_report.md&title=%5BBug%5D+) 
or [feature requests](https://github.com/ilyalehchylin/appstore-connect-app-version/issues/new?assignees=ilyalehchylin&labels=feature&template=feature_request.md&title=%5BFeature%5D).

Ask repository owner to add you to contributors list.

## Repository

### Branches

Branches **must be** created from [develop](https://github.com/IlyaLehchylin/educats-xamarin/tree/develop) branch. 
Direct pushes to **develop** and **master** are not allowed.

Name conventions for branches:

```
[feature/bug/update]/[#issue_number-branch-name]
```

Examples:

```
bug/#123-app-settings-crash
update/docs-resources
feature/new-page
feature/#41-new-feature
```

### Commits

Name conventions for commits:

```
[ADD/DELETE/UPDATE/FIX/ETC] [#ISSUE_NUMBER] Description
```

Examples:

```
[FIX] [#123] Action failure
[UPDATE] Private key is not present
[ADD] New functionality
[ADD] [#41] New feature
```

### Pull requests

Before submitting pull request you should choose the reviewer.  
The following checks should pass:

- Github Actions
- Reviewer check

Name conventions for pull request commits:

```
[PR] [GH-Associated_issue_number] Description
```

Examples:

```
[PR] [GH-123] Fixed action failing
```
