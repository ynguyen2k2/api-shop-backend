# Logger Module

Custom logger implementation for NestJS application using structured logging.

## Overview

This module provides a custom logger service that extends NestJS Logger with additional features like context setting and structured log formatting.

## Table of Contents

- [Logger Module](#logger-module)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Log Levels](#log-levels)
  - [Best Practices](#best-practices)

## Installation

Add logger module into the module that needs logging:

```ts
@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
    MyLoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
```

## Log Levels

Available log methods:

- `logger.error()` - Error messages
- `logger.warn()` - Warning messages
- `logger.log()` - General information
- `logger.debug()` - Debug information
- `logger.verbose()` - Verbose output

## Best Practices

1. Always set context in constructor: `this.logger.setContext(ClassName.name)`
2. Use appropriate log levels (debug for dev, log for production)
3. Don't log sensitive data (passwords, tokens)
4. Include relevant context in error messages

```ts
import { MyLogger } from '~/logger/mylogger.service'

export class UsersService {
  constructor(
    private readonly logger: MyLogger,
    ...
  ) {
    this.logger.setContext(UsersService.name)
  }
```

```ts
async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug('Creating user with email: ' + createUserDto.email)
    ...
}
```
